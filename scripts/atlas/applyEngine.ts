import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { bootstrapAtlasMemory, memoryEngine } from "@/atlas/brain/memory";
import { updatePlanStatusById, updatePlanStepByKind } from "@/atlas/brain/planner";

import { ROOT_DIR } from "./shared";
import { isSafePath, PROPOSAL_MANIFEST_FILENAME, type SkippedFileChange } from "./executionEngine";
import { runPostApplyValidation, type PostApplyValidationResult } from "./postApplyValidation";
import { draftFixMissionForFailedValidation, type FixMissionDraftResult } from "./replanOnFailure";

/**
 * EXEC-001 · Apply Engine
 *
 * The second half of "goedkeuring → toepassing": takes a proposal the Execution Engine
 * already drafted and reviewed into engineering/packages/<MISSION-ID>/proposed-changes/,
 * and writes those files into the real working tree — the one step this platform never
 * did on its own before.
 *
 * Safety model (still conservative, but this is the step that actually touches your code):
 *  - Only ever applies files that already passed the Execution Engine's path allowlist —
 *    and re-validates every path again here, independently, before writing.
 *  - Only ever reads from proposed-changes/ and writes to the exact same relative path in
 *    the working tree — it cannot be pointed at an arbitrary source or destination.
 *  - After applying, the proposed-changes/ folder is renamed (not deleted) to
 *    applied-<timestamp>/ — so nothing is silently lost and nothing can be re-applied by
 *    accident on a second call.
 *  - git is the real undo button: every applied file is a normal working-tree change, so
 *    `git diff` / `git checkout -- <file>` works exactly like any other edit.
 *  - Can be triggered two ways: manually via `npm run atlas:apply -- <MISSION-ID>`, or
 *    automatically when the CEO approves the matching "Review engineering package" item
 *    in Atlas Control (via the local apply-bridge server in atlas-runtime.ts) — both paths
 *    call this exact same function, so behavior is identical either way.
 */

export type AppliedFileChange = { path: string; action: "create" | "modify"; bytesWritten: number };

export type ApplyEngineResult =
  | {
      ok: true;
      missionId: string;
      applied: AppliedFileChange[];
      skipped: SkippedFileChange[];
      archivedTo: string;
      /** EXEC-002 · null when nothing was actually applied (nothing to validate), otherwise
       * the automatic post-apply typecheck + commit-prep result — see postApplyValidation.ts. */
      validation: PostApplyValidationResult | null;
      /** BRAIN-011 · null unless validation actually failed and a fix mission was
       * successfully drafted — see replanOnFailure.ts. */
      fixMission: FixMissionDraftResult;
    }
  | { ok: false; missionId: string; message: string };

type ProposalManifest = {
  missionId?: string;
  title?: string;
  summary?: string;
  files?: Array<{ path?: string; action?: string; reason?: string }>;
};

function readProposalManifest(reviewDir: string): ProposalManifest | null {
  const manifestPath = join(reviewDir, PROPOSAL_MANIFEST_FILENAME);
  if (!existsSync(manifestPath)) return null;

  try {
    return JSON.parse(readFileSync(manifestPath, "utf8")) as ProposalManifest;
  } catch {
    return null;
  }
}

// Context/Planner integration (2026-07-11) · Best-effort only, same contract as the drafting
// engines' safeStepUpdate helpers — a planner hiccup must never block a real apply, which is
// the single most consequential step in the whole mission pipeline.
function safeStepUpdate(
  missionId: string,
  kind: "approval-gate" | "apply" | "validate",
  patch: Parameters<typeof updatePlanStepByKind>[2],
): void {
  try {
    updatePlanStepByKind(missionId, kind, patch);
  } catch {
    // best-effort only
  }
}

function safeStatusUpdate(missionId: string, patch: Parameters<typeof updatePlanStatusById>[1]): void {
  try {
    updatePlanStatusById(missionId, patch);
  } catch {
    // best-effort only
  }
}

/** Records a real, durable memory entry so Atlas' own history reflects that code was
 * actually shipped, not just proposed — best-effort, never blocks the apply. */
function rememberApply(missionId: string, applied: AppliedFileChange[]): void {
  try {
    bootstrapAtlasMemory();
    memoryEngine.saveMemory({
      type: "decision",
      title: `Applied ${missionId}`,
      summary: `${applied.length} file(s) applied to the working tree for ${missionId}: ${applied.map((file) => file.path).join(", ")}`,
      content: `Execution Engine proposal for ${missionId} was reviewed and applied to the real working tree.`,
      tags: ["execution", "applied", missionId],
      source: "atlas.execution.apply",
      importance: 7,
      confidence: 0.9,
      status: "active",
    });
  } catch {
    // Memory is best-effort — never let a persistence failure hide a successful apply.
  }
}

/** Applies an already-reviewed Execution Engine proposal to the real working tree. Always
 * resolves; never throws — callers (CLI, local apply-bridge server) get a structured
 * ok/false result instead. */
export async function applyProposedChanges(missionIdInput: string): Promise<ApplyEngineResult> {
  const missionId = missionIdInput.trim().toUpperCase();
  const reviewDir = join(ROOT_DIR, "engineering", "packages", missionId, "proposed-changes");

  if (!existsSync(reviewDir)) {
    return {
      ok: false,
      missionId,
      message: `Geen proposed-changes gevonden voor ${missionId}. Draai eerst npm run atlas:execute -- ${missionId}.`,
    };
  }

  const manifest = readProposalManifest(reviewDir);

  if (!manifest) {
    return {
      ok: false,
      missionId,
      message: `${PROPOSAL_MANIFEST_FILENAME} ontbreekt of is onleesbaar in ${reviewDir} — niets om toe te passen. Draai npm run atlas:execute -- ${missionId} opnieuw.`,
    };
  }

  // This function only ever runs after an explicit CEO Inbox "Approve" click (or the
  // equivalent `npm run atlas:apply` CLI) — so reaching this point IS the approval-gate step
  // resolving, and the apply step starting.
  safeStepUpdate(missionId, "approval-gate", { status: "completed" });
  safeStepUpdate(missionId, "apply", { status: "running" });

  const entries = manifest.files ?? [];

  // Bugfix 2026-07-10 · A manifest that legitimately proposes 0 files (mission.implement
  // concluded the work already exists elsewhere — a real, valid outcome, not a failure) used
  // to be treated identically to "manifest missing/corrupt": ok:false, nothing archived, never
  // recorded in appliedHistory. That left the CEO Inbox permanently stuck showing "approved
  // but not applied — run npm run atlas:apply" for a mission that will *always* propose 0
  // files again on retry, an unclearable warning loop. Found live on BRAIN-007. Now: 0 files
  // is resolved the same way as N files — archived to applied-<timestamp>/ so
  // buildAppliedHistory() picks it up and the warning clears itself, same as any other apply.
  const applied: AppliedFileChange[] = [];
  const skipped: SkippedFileChange[] = [];

  for (const entry of entries) {
    const path = typeof entry.path === "string" ? entry.path.trim() : "";
    const action = entry.action === "modify" ? "modify" : "create";

    if (!path || !isSafePath(path)) {
      skipped.push({ path: path || "(onbekend pad)", reason: "Pad geweigerd door veiligheidscontrole bij toepassen." });
      continue;
    }

    const source = join(reviewDir, path);
    if (!existsSync(source)) {
      skipped.push({ path, reason: "Bestand staat in de manifest maar ontbreekt in proposed-changes/." });
      continue;
    }

    const content = readFileSync(source, "utf8");
    const destination = join(ROOT_DIR, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content, "utf8");
    applied.push({ path, action, bytesWritten: Buffer.byteLength(content, "utf8") });
  }

  const archiveDir = join(ROOT_DIR, "engineering", "packages", missionId, `applied-${Date.now()}`);
  renameSync(reviewDir, archiveDir);
  safeStepUpdate(missionId, "apply", { status: "completed" });

  let validation: PostApplyValidationResult | null = null;
  let fixMission: FixMissionDraftResult = null;
  if (applied.length > 0) {
    rememberApply(missionId, applied);
    safeStepUpdate(missionId, "validate", { status: "running" });

    // EXEC-002 · Best-effort, never blocks the (already-successful) apply: a typecheck or
    // staging problem here is reported, not thrown — the files are already safely in the
    // working tree at this point regardless of what this step finds.
    try {
      validation = runPostApplyValidation({
        missionId,
        title: manifest?.title ?? missionId,
        summary: manifest?.summary ?? "",
        applied,
        archiveDir,
      });
    } catch {
      validation = null;
    }

    const validationPassed = validation ? validation.typecheckOk && validation.testsOk : null;
    safeStepUpdate(missionId, "validate", {
      status: validationPassed === false ? "failed" : "completed",
    });

    // BRAIN-011 · If validation just found a real problem, don't just report it — draft a
    // real fix proposal too, same best-effort/never-blocks guarantee as validation itself.
    if (validation) {
      try {
        fixMission = await draftFixMissionForFailedValidation({
          missionId,
          title: manifest?.title ?? missionId,
          applied,
          archiveDir,
          validation,
        });
      } catch {
        fixMission = null;
      }
    }
  } else {
    // A legitimately empty proposal (mission already implemented elsewhere) — nothing to
    // validate, not a failure. See the 2026-07-10 bugfix note above.
    safeStepUpdate(missionId, "validate", { status: "skipped" });
  }

  // The plan's job ends here regardless of validation outcome: the code is in the working
  // tree either way. A failed validation drafts a *new* fix mission (its own separate plan),
  // it doesn't reopen this one.
  safeStatusUpdate(missionId, { status: "completed", completedAt: new Date().toISOString() });

  return {
    ok: true,
    missionId,
    applied,
    skipped,
    archivedTo: `engineering/packages/${missionId}/${archiveDir.split("/").pop()}`,
    validation,
    fixMission,
  };
}

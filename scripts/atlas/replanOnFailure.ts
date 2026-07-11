import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ROOT_DIR } from "./shared";
import { getExecutionProposalState, runExecutionEngine, PROPOSAL_MANIFEST_FILENAME } from "./executionEngine";
import type { PostApplyValidationResult } from "./postApplyValidation";
import type { AppliedFileChange } from "./applyEngine";

/**
 * BRAIN-011 · Re-plan on validation failure
 *
 * Closes the last piece of the planning gap on record: "still single-shot planning
 * documents, no iterative re-planning if an execution attempt fails validation." Until now,
 * a failed post-apply typecheck/test (EXEC-002/EXEC-003) just sat there as a red warning —
 * nothing acted on it. This module turns "a failure was detected" into "a real fix proposal
 * is drafted and waiting for review", using the exact same Execution Engine and CEO-Inbox-
 * approve-first safety model as every other mission. It never applies anything on its own.
 *
 * Design note: the CEO Inbox's "Open" tab is built around a single `activePackage` (whatever
 * the Decision Engine currently ranks top, or whatever the CEO explicitly queued via the
 * CEO-instruction slot) — see buildCandidateApprovals() in realCompanyData.ts. A freshly
 * drafted fix mission would NOT automatically win that slot, so it would silently sit
 * invisible. Rather than hijacking the CEO's single instruction slot (which could silently
 * override something they explicitly asked for, like a content retry), listPendingFixMissions()
 * gives fix proposals their own guaranteed-visible lane in the Inbox, regardless of whatever
 * else is currently active.
 */

const MISSIONS_DIR = join(ROOT_DIR, "engineering/missions");
const PACKAGES_DIR = join(ROOT_DIR, "engineering/packages");
const FIX_ID_PATTERN = /^FIX-(\d{3,4})$/;

function nextFixMissionId(): string {
  let highest = 0;
  if (existsSync(MISSIONS_DIR)) {
    for (const filename of readdirSync(MISSIONS_DIR)) {
      const id = filename.replace(/\.mission$/, "").toUpperCase();
      const match = id.match(FIX_ID_PATTERN);
      if (match) highest = Math.max(highest, Number(match[1]));
    }
  }
  return `FIX-${String(highest + 1).padStart(3, "0")}`;
}

function buildFixMissionSource(input: {
  fixId: string;
  missionId: string;
  title: string;
  applied: AppliedFileChange[];
  validation: PostApplyValidationResult;
}): string {
  const focusLines = input.applied.map((file) => file.path);
  const failureLines: string[] = [];
  if (!input.validation.typecheckOk) {
    failureLines.push("TypeScript compileert niet meer na deze Apply:");
    failureLines.push(input.validation.typecheckSummary);
  }
  if (input.validation.testsOk === false) {
    failureLines.push("De testsuite faalt na deze Apply:");
    failureLines.push(input.validation.testSummary ?? "");
  }

  return [
    "Mission:",
    input.fixId,
    "",
    "Title:",
    `Fix: ${input.title} — validatie mislukt na toepassen`,
    "",
    "Goal:",
    `Mission ${input.missionId} ("${input.title}") is toegepast, maar de automatische post-apply validatie (EXEC-002/EXEC-003) slaagde niet. Dit is een automatisch gegenereerde herstel-missie (BRAIN-011) — los precies dit op, zonder de rest van ${input.missionId}'s werk terug te draaien of onnodig te wijzigen.\n\n${failureLines.join("\n")}`,
    "",
    "Focus:",
    ...(focusLines.length > 0 ? focusLines : ["(geen specifieke bestanden bekend — zie de foutmelding in Goal)"]),
    "",
    "Constraints:",
    `Wijzig alleen wat nodig is om de gerapporteerde typecheck-/testfout op te lossen — geen ongerelateerde refactors`,
    `Verander de bedoeling van ${input.missionId} niet; dit is een reparatie, geen herontwerp`,
    "TypeScript moet weer schoon compileren (app + scripts + tests) en de testsuite moet weer slagen",
    "Dit voorstel wordt, zoals elke andere missie, alleen toegepast na een expliciete Approve-klik van de CEO — nooit automatisch",
    "",
    "Success:",
    "TypeScript compileert schoon en de testsuite slaagt weer, met een zo klein mogelijke, gerichte wijziging.",
    "",
  ].join("\n");
}

export type FixMissionDraftResult = { fixMissionId: string; reviewDir: string } | null;

/** Best-effort, never throws: called right after runPostApplyValidation() inside
 * applyProposedChanges(). A problem here must never hide or undo the Apply that already
 * succeeded — it only ever adds a new, separately-reviewable proposal. */
export async function draftFixMissionForFailedValidation(input: {
  missionId: string;
  title: string;
  applied: AppliedFileChange[];
  archiveDir: string;
  validation: PostApplyValidationResult;
}): Promise<FixMissionDraftResult> {
  const failed = !input.validation.typecheckOk || input.validation.testsOk === false;
  if (!failed) return null;

  const markerPath = join(input.archiveDir, "fix-mission.json");
  if (existsSync(markerPath)) {
    try {
      return JSON.parse(readFileSync(markerPath, "utf8")) as FixMissionDraftResult;
    } catch {
      // fall through and try again
    }
  }

  try {
    const fixId = nextFixMissionId();
    const source = buildFixMissionSource({ fixId, ...input });
    mkdirSync(MISSIONS_DIR, { recursive: true });
    writeFileSync(join(MISSIONS_DIR, `${fixId}.mission`), source, "utf8");

    console.log(`  [replan] validatie faalde voor ${input.missionId} — fix-missie ${fixId} aangemaakt, voorstel wordt opgesteld...`);

    const result = await runExecutionEngine(fixId);
    if (!result.ok) {
      console.log(`  [replan] kon geen fix-voorstel opstellen voor ${fixId}: ${result.message}`);
      return null;
    }

    const outcome: FixMissionDraftResult = { fixMissionId: fixId, reviewDir: result.reviewDir };
    try {
      writeFileSync(markerPath, JSON.stringify(outcome, null, 2), "utf8");
    } catch {
      // best-effort marker — a missing marker only risks a duplicate draft on a retry, never a crash
    }

    console.log(`  [replan] fix-voorstel ${fixId} klaar voor review in de CEO Inbox.`);
    return outcome;
  } catch (error) {
    console.log(`  [replan] herplannen mislukte: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export type PendingFixMission = { missionId: string; title: string; packageDir: string };

/** Scans engineering/packages/ for FIX-prefixed mission folders that have a real drafted
 * proposal still awaiting review — never "none" (nothing drafted yet) or "applied" (already
 * resolved and cleared by the CEO). Read fresh from disk every call, same as the rest of the
 * runtime state — never cached, never hand-maintained. */
export function listPendingFixMissions(): PendingFixMission[] {
  if (!existsSync(PACKAGES_DIR)) return [];

  const pending: PendingFixMission[] = [];
  for (const entry of readdirSync(PACKAGES_DIR)) {
    if (!FIX_ID_PATTERN.test(entry)) continue;
    if (getExecutionProposalState(entry) !== "pending-review") continue;

    const manifestPath = join(PACKAGES_DIR, entry, "proposed-changes", PROPOSAL_MANIFEST_FILENAME);
    let title = entry;
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { title?: string };
      if (typeof manifest.title === "string" && manifest.title.trim()) title = manifest.title.trim();
    } catch {
      // fall back to the mission id as title
    }

    pending.push({ missionId: entry, title, packageDir: `engineering/packages/${entry}` });
  }

  return pending;
}

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { bootstrapAtlas } from "@/atlas/bootstrap";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { executeTask, formatTaskExecutionLog } from "@/atlas/ai/core/Orchestrator";
import { updatePlanStepByKind } from "@/atlas/brain/planner";

import {
  buildChangesMarkdown,
  isSafePath,
  PROPOSAL_MANIFEST_FILENAME,
  type ExecutionEngineResult,
  type ProposedFileChange,
  type SkippedFileChange,
} from "./executionEngine";
import { ROOT_DIR } from "./shared";

/**
 * BRAIN-011-vervolg · Tips Generation Engine
 *
 * Real gap found while scoping the next content move: tips.ts (31 one-liner tips across 7
 * categories) is a genuinely different, much simpler data model than the KnowledgeBite
 * articles CONTENT_MISSIONS/contentGenerationEngine.ts targets — a flat {id, categoryId,
 * text, order} with a single short sentence, no sections/sources/links/visuals. Routing tip
 * generation through the full copywriter → visual-designer → fact-checker → link-engine →
 * domain-validator pipeline would be pure overhead for a one-line tip; there is nothing there
 * to fact-check, link, or illustrate. This is a small, dedicated engine instead: one direct
 * "tips.write" task call per category (see routes.ts/provider-config.ts/ClaudeProvider.ts for
 * the new task type), batched per category to keep the call count low.
 *
 * Output contract deliberately mirrors runExecutionEngine()/runContentGenerationEngine()'s
 * ExecutionEngineResult exactly — same CEO Inbox, same Apply Engine, same approval flow, a
 * tips mission just drafts differently.
 *
 * Safety: the full tips.ts file is always rewritten deterministically from the real existing
 * 31 entries (read fresh from disk, byte-for-byte preserved) plus newly generated entries
 * appended at the end — never an AI-authored rewrite of the whole file, and never a
 * replacement of any existing tip.
 */

const TIPS_TARGET_FILE = "src/modules/doughbert/tips/tips.ts";

// Context/Planner integration (2026-07-11) · Best-effort only, same contract as
// contentGenerationEngine.ts's safeStepUpdate — a planner hiccup must never block a real tip.
function safeStepUpdate(
  missionId: string,
  kind: "copywriter",
  patch: Parameters<typeof updatePlanStepByKind>[2],
): void {
  try {
    updatePlanStepByKind(missionId, kind, patch);
  } catch {
    // best-effort only
  }
}

export type TipsCategoryRequest = { categoryId: string; categoryLabel: string; count: number };

export type TipsMissionConfig = {
  missionId: string;
  categories: TipsCategoryRequest[];
};

export const TIP_MISSIONS: Record<string, TipsMissionConfig> = {
  "TIPS-001": {
    missionId: "TIPS-001",
    categories: [
      { categoryId: "brood", categoryLabel: "Brood", count: 2 },
      { categoryId: "pizza", categoryLabel: "Pizza", count: 2 },
      { categoryId: "starter", categoryLabel: "Starter", count: 2 },
      { categoryId: "temperatuur", categoryLabel: "Temperatuur", count: 2 },
      { categoryId: "oven-bakken", categoryLabel: "Oven & bakken", count: 2 },
      { categoryId: "plakken-voorkomen", categoryLabel: "Plakken voorkomen", count: 2 },
      { categoryId: "snelle-reddingen", categoryLabel: "Snelle reddingen", count: 2 },
    ],
  },
};

export function isTipsMission(missionId: string): boolean {
  return missionId.toUpperCase() in TIP_MISSIONS;
}

type ExistingTip = { id: string; categoryId: string; text: string; order: number };

/** Parses the real, currently-committed tips.ts by pattern-matching its own `tip(id, cat,
 * text, order)` calls — never re-derives from a re-import (this file is a .ts source file
 * read at generation time, not something we can safely `require` mid-mission), and never
 * assumes a shape the file doesn't actually have. Best-effort: throws with a clear message
 * if the file doesn't match the expected pattern, rather than silently producing zero tips. */
function parseExistingTips(source: string): ExistingTip[] {
  const pattern = /tip\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\d+)\s*,?\s*\)/g;
  const results: ExistingTip[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    results.push({ id: match[1], categoryId: match[2], text: match[3].replace(/\\"/g, '"'), order: Number(match[4]) });
  }
  return results;
}

function slugifyId(categoryId: string, text: string, usedIds: Set<string>): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 4)
    .join("-");
  let candidate = `${categoryId}-${base || "tip"}`;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${categoryId}-${base || "tip"}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function escapeForTsString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Deterministic serialization — never AI-authored TypeScript. Every existing tip is written
 * back byte-identical (same id/categoryId/text/order); new tips are appended in a clearly
 * commented block per category, using the same `tip(...)` call format the file already uses. */
function buildTipsFile(source: string, existing: ExistingTip[], added: ExistingTip[]): string {
  const insertionMarker = "];";
  const lastArrayCloseIndex = source.lastIndexOf(insertionMarker, source.indexOf("function buildTipRegistry"));
  if (lastArrayCloseIndex === -1) {
    throw new Error("Kon de TIP_DEFINITIONS-array niet vinden in tips.ts om nieuwe tips aan toe te voegen.");
  }

  const byCategory = new Map<string, ExistingTip[]>();
  for (const tip of added) {
    const list = byCategory.get(tip.categoryId) ?? [];
    list.push(tip);
    byCategory.set(tip.categoryId, list);
  }

  const blocks: string[] = [];
  for (const [categoryId, tips] of byCategory) {
    blocks.push(`\n  // TIPS-001 · nieuw gegenereerd, ${new Date().toISOString().slice(0, 10)}`);
    for (const tip of tips) {
      blocks.push(
        `  tip(\n    "${tip.id}",\n    "${categoryId}",\n    "${escapeForTsString(tip.text)}",\n    ${tip.order},\n  ),`,
      );
    }
  }

  const before = source.slice(0, lastArrayCloseIndex);
  const after = source.slice(lastArrayCloseIndex);
  return `${before}${blocks.join("\n")}\n${after}`;
}

type RawTipsWriteOutput = { tips?: Array<{ text?: unknown }> };

function normalizeGeneratedTips(output: unknown): string[] {
  const data = (output ?? {}) as RawTipsWriteOutput;
  if (!Array.isArray(data.tips)) return [];
  return data.tips
    .map((entry) => (entry && typeof entry.text === "string" ? entry.text.trim() : ""))
    .filter((text) => text.length >= 15 && text.length <= 220);
}

export async function runTipsGenerationEngine(missionIdInput: string): Promise<ExecutionEngineResult> {
  const missionId = missionIdInput.trim().toUpperCase();
  const config = TIP_MISSIONS[missionId];

  if (!config) {
    return { ok: false, missionId, message: `Geen tips-missie geconfigureerd voor "${missionId}".` };
  }

  if (!isAnthropicConfigured()) {
    return {
      ok: false,
      missionId,
      message: "ANTHROPIC_API_KEY is niet geconfigureerd — Tips Generation Engine vereist een echte Claude-call en heeft geen mock-modus.",
    };
  }

  bootstrapAtlas();
  safeStepUpdate(missionId, "copywriter", { status: "running" });

  const tipsPath = join(ROOT_DIR, TIPS_TARGET_FILE);
  if (!existsSync(tipsPath)) {
    return { ok: false, missionId, message: `${TIPS_TARGET_FILE} bestaat niet — kan geen tips toevoegen.` };
  }
  const source = readFileSync(tipsPath, "utf8");
  const existing = parseExistingTips(source);
  if (existing.length === 0) {
    return { ok: false, missionId, message: `Kon geen bestaande tips uitlezen uit ${TIPS_TARGET_FILE} — regex-patroon matcht niets.` };
  }

  const usedIds = new Set(existing.map((tip) => tip.id));
  const existingTextsLower = new Set(existing.map((tip) => tip.text.toLowerCase()));
  const added: ExistingTip[] = [];
  const skipped: SkippedFileChange[] = [];
  const risks: string[] = [];
  const contextFiles: string[] = [];

  for (const request of config.categories) {
    const existingForCategory = existing.filter((tip) => tip.categoryId === request.categoryId);
    const maxOrder = existingForCategory.reduce((max, tip) => Math.max(max, tip.order), 0);

    try {
      const execution = await executeTask<{ tips?: Array<{ text?: unknown }> }>({
        task: "tips.write",
        payload: {
          categoryId: request.categoryId,
          categoryLabel: request.categoryLabel,
          count: request.count,
          existingTips: existingForCategory.map((tip) => tip.text),
        },
        agentId: "copywriter",
        moduleId: "atlas-content",
        skipCache: true,
      });
      console.log(`  [tips] ${formatTaskExecutionLog(execution)}`);

      const texts = normalizeGeneratedTips(execution.output);
      let nextOrder = maxOrder + 1;
      let acceptedForCategory = 0;

      for (const text of texts) {
        const lower = text.toLowerCase();
        if (existingTextsLower.has(lower)) continue; // real or near-duplicate of an existing tip — skip silently, not an error

        const id = slugifyId(request.categoryId, text, usedIds);
        added.push({ id, categoryId: request.categoryId, text, order: nextOrder });
        existingTextsLower.add(lower);
        nextOrder += 1;
        acceptedForCategory += 1;
        if (acceptedForCategory >= request.count) break;
      }

      if (acceptedForCategory === 0) {
        skipped.push({ path: request.categoryId, reason: "Geen bruikbare nieuwe tips ontvangen (leeg, te kort, of allemaal duplicaten van bestaande tips)." });
        risks.push(`${request.categoryLabel}: 0 nieuwe tips toegevoegd.`);
      } else if (acceptedForCategory < request.count) {
        risks.push(`${request.categoryLabel}: ${acceptedForCategory}/${request.count} nieuwe tips (rest was duplicaat of ongeldig).`);
      }
      contextFiles.push(`${request.categoryId} (${acceptedForCategory}/${request.count} nieuwe tips, echte AI-generatie)`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      skipped.push({ path: request.categoryId, reason: message });
      risks.push(`${request.categoryLabel} mislukt: ${message}`);
    }
  }

  if (added.length === 0) {
    safeStepUpdate(missionId, "copywriter", { status: "failed" });
    return {
      ok: false,
      missionId,
      message: `Geen enkele nieuwe tip gehaald. Details: ${risks.join(" | ")}`,
    };
  }

  if (!isSafePath(TIPS_TARGET_FILE)) {
    return { ok: false, missionId, message: `Onveilig doelpad geweigerd: ${TIPS_TARGET_FILE}` };
  }

  const newFileContent = buildTipsFile(source, existing, added);
  const written: ProposedFileChange[] = [
    {
      path: TIPS_TARGET_FILE,
      action: "modify",
      content: newFileContent,
      reason: `${added.length} nieuwe tip(s) toegevoegd over ${config.categories.length} categorieën — alle ${existing.length} bestaande tips blijven ongewijzigd.`,
    },
  ];

  const missionDir = join(ROOT_DIR, "engineering", "packages", missionId);
  const reviewDir = join(missionDir, "proposed-changes");
  mkdirSync(reviewDir, { recursive: true });

  for (const file of written) {
    const destination = join(reviewDir, file.path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, file.content, "utf8");
  }

  const summary = `${added.length} nieuwe tip(s) geschreven door de echte copywriter (real AI, geen mock) over ${config.categories.length} categorieën — de bestaande ${existing.length} tips blijven exact zoals ze waren.`;
  const followUp =
    skipped.length > 0
      ? `${skipped.length} categorie(ën) leverden minder tips dan gevraagd (zie risico's) — draai deze missie opnieuw om ze alsnog aan te vullen.`
      : "Alle gevraagde tips gehaald — controleer toon en feitelijke juistheid voor het toepassen.";

  const changesLog = buildChangesMarkdown({
    missionId,
    title: "Tips uitbreiden",
    summary,
    files: written,
    skipped,
    risks,
    followUp,
    contextFiles,
    missingContextPaths: [],
  });
  writeFileSync(join(reviewDir, "CHANGES.md"), changesLog, "utf8");

  writeFileSync(
    join(reviewDir, PROPOSAL_MANIFEST_FILENAME),
    JSON.stringify(
      {
        missionId,
        title: "Tips uitbreiden",
        generatedAt: new Date().toISOString(),
        summary,
        files: written.map((file) => ({ path: file.path, action: file.action, reason: file.reason })),
        risks,
        followUp,
      },
      null,
      2,
    ),
    "utf8",
  );

  safeStepUpdate(missionId, "copywriter", { status: "completed" });

  return {
    ok: true,
    missionId,
    title: "Tips uitbreiden",
    summary,
    files: written,
    skippedFiles: skipped,
    risks,
    followUp,
    reviewDir: `engineering/packages/${missionId}/proposed-changes`,
    contextFiles,
    missingContextPaths: [],
  };
}

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { ROOT_DIR } from "./shared";
import type { AppliedFileChange } from "./applyEngine";

/**
 * EXEC-002 · Post-Apply Validation & Commit Prep
 *
 * Closes the remaining Execution capability gap: until now, once the Apply Engine wrote a
 * mission's files into the working tree, nothing automatically checked whether the result
 * still compiles, and nothing helped prepare the actual git commit — the CEO had to run
 * `git diff` / `npm run atlas:commit-check` by hand to find out either.
 *
 * This runs automatically right after every successful apply (both the CLI path and the
 * CEO Inbox "Approve" -> apply-bridge path), and is deliberately a safety net + time saver,
 * never a gate: even if typecheck fails, the files stay applied exactly like before this
 * existed — nothing is rolled back automatically, since an automatic revert could destroy
 * a real, reviewable diff the CEO still needs to look at. The point is that a compile
 * failure is now visible immediately (in Atlas Control's applied history) instead of being
 * discovered later from a broken `npm run atlas:web`.
 *
 * git add is run (staging only — trivially reversible with `git reset`), but git commit
 * never is: the CEO stays the one who actually authors the commit, same as always. This
 * just saves them from re-typing a commit message from scratch.
 *
 * EXEC-003 · Also runs the real automated test suite (node:test files, executed via `tsx
 * --test`) right after typecheck. Before this, "validation" meant typecheck-only — code
 * could compile cleanly while still being behaviourally wrong (exactly the kind of thing
 * BRAIN-009's retention math or BRAIN-010's retry classification could have silently broken
 * without anyone noticing). Same philosophy as typecheck here: best-effort and never a gate,
 * a failing test is surfaced, not rolled back.
 */

export type PostApplyValidationResult = {
  typecheckOk: boolean;
  typecheckSummary: string;
  testsOk: boolean;
  testSummary: string;
  suggestedCommitMessage: string;
  staged: boolean;
  stageNote: string;
};

const TYPECHECK_TIMEOUT_MS = 120_000;
const TEST_TIMEOUT_MS = 120_000;

/** Mirrors the same TypeScript checks scripts/commit-check.ts already runs manually (root
 * tsconfig.json covers the app, scripts/tsconfig.json covers the Node-side Atlas scripts,
 * tsconfig.test.json covers *.test.ts files — a separate, narrow overlay because test files
 * need real Node ambient types (node:test, node:assert/strict) that the RN app config
 * deliberately doesn't carry, the same reasoning that gave scripts/ its own tsconfig) — same
 * ground truth, just triggered automatically per mission instead of only when a human
 * remembers to run the CLI. */
function runTypecheck(): { ok: boolean; summary: string } {
  try {
    execFileSync("npx", ["tsc", "--noEmit"], {
      cwd: ROOT_DIR,
      stdio: "pipe",
      encoding: "utf8",
      timeout: TYPECHECK_TIMEOUT_MS,
    });
    execFileSync("npx", ["tsc", "--noEmit", "-p", "scripts/tsconfig.json"], {
      cwd: ROOT_DIR,
      stdio: "pipe",
      encoding: "utf8",
      timeout: TYPECHECK_TIMEOUT_MS,
    });
    execFileSync("npx", ["tsc", "--noEmit", "-p", "tsconfig.test.json"], {
      cwd: ROOT_DIR,
      stdio: "pipe",
      encoding: "utf8",
      timeout: TYPECHECK_TIMEOUT_MS,
    });
    return { ok: true, summary: "TypeScript compileert schoon (app + scripts + tests)." };
  } catch (error) {
    const raw =
      (error as { stdout?: string })?.stdout || (error instanceof Error ? error.message : String(error));
    const trimmed = raw.split("\n").filter(Boolean).slice(0, 15).join("\n");
    return { ok: false, summary: trimmed || "TypeScript-fouten gevonden na toepassen." };
  }
}

/** EXEC-003 · Runs the real node:test suite via `tsx --test` (no explicit file list — tsx
 * delegates to Node's test runner, which recursively auto-discovers every *.test.ts file in
 * the repo, node_modules excluded, so this never needs updating when a new test file is
 * added anywhere). A repo with zero test files yet is reported as ok (nothing to fail), not
 * as a problem — this only starts meaning something once real test files exist, which as of
 * EXEC-003 they now do. */
function runTestSuite(): { ok: boolean; summary: string } {
  try {
    const output = execFileSync("npx", ["tsx", "--test"], {
      cwd: ROOT_DIR,
      stdio: "pipe",
      encoding: "utf8",
      timeout: TEST_TIMEOUT_MS,
    });
    const summaryLine = output
      .split("\n")
      .find((line) => line.startsWith("# pass") || line.startsWith("# fail"));
    return { ok: true, summary: summaryLine ? `Tests geslaagd (${summaryLine.replace("# ", "")}).` : "Tests geslaagd." };
  } catch (error) {
    const raw =
      (error as { stdout?: string })?.stdout || (error instanceof Error ? error.message : String(error));
    const trimmed = raw.split("\n").filter(Boolean).slice(-20).join("\n");
    return { ok: false, summary: trimmed || "Testfouten gevonden na toepassen." };
  }
}

function buildCommitMessage(missionId: string, title: string, summary: string, fileCount: number): string {
  const headline = `${missionId}: ${title}`.slice(0, 72);
  const body = summary.trim() || "Toegepast door Atlas na CEO-goedkeuring.";
  return `${headline}\n\n${body}\n\n${fileCount} bestand(en) aangepast — automatisch toegepast na goedkeuring in de CEO Inbox.`;
}

/** Stages exactly the files this mission just applied — never `git add -A`, so it can never
 * accidentally stage unrelated in-progress work sitting elsewhere in the working tree. */
function stageAppliedFiles(paths: string[]): { staged: boolean; note: string } {
  if (paths.length === 0) return { staged: false, note: "Geen bestanden om te stagen." };

  try {
    execFileSync("git", ["add", "--", ...paths], { cwd: ROOT_DIR, stdio: "pipe", encoding: "utf8" });
    return { staged: true, note: `${paths.length} bestand(en) gestaged (git add) — nog niet gecommit.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { staged: false, note: `Stagen mislukt: ${message.split("\n")[0]}` };
  }
}

/** Called by the Apply Engine right after it archives a mission's proposed-changes/ to
 * applied-<timestamp>/. Best-effort end to end: a failure in typecheck or staging is
 * recorded as a normal (not-ok) result, never thrown — the apply itself already succeeded
 * and must never be hidden or undone by a problem in this follow-up step. */
export function runPostApplyValidation(input: {
  missionId: string;
  title: string;
  summary: string;
  applied: AppliedFileChange[];
  archiveDir: string;
}): PostApplyValidationResult {
  const typecheck = runTypecheck();
  const tests = runTestSuite();
  const commitMessage = buildCommitMessage(input.missionId, input.title, input.summary, input.applied.length);
  const staging = stageAppliedFiles(input.applied.map((file) => file.path));

  const result: PostApplyValidationResult = {
    typecheckOk: typecheck.ok,
    typecheckSummary: typecheck.summary,
    testsOk: tests.ok,
    testSummary: tests.summary,
    suggestedCommitMessage: commitMessage,
    staged: staging.staged,
    stageNote: staging.note,
  };

  try {
    writeFileSync(join(input.archiveDir, "validation-result.json"), JSON.stringify(result, null, 2), "utf8");
    writeFileSync(join(input.archiveDir, "COMMIT_MESSAGE.txt"), commitMessage, "utf8");
  } catch {
    // Best-effort persistence — never let a disk-write problem hide that validation ran.
  }

  return result;
}

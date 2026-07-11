import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { executeTask } from "@/atlas/ai/core/Orchestrator";
import { bootstrapAiProviders } from "@/atlas/ai/providers/bootstrap";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { missionRegistry, orchestrateMission, registerMissionFromSource } from "@/atlas/engineering/mission-orchestrator";

import { ROOT_DIR } from "./shared";

/**
 * EXEC-001 · Execution Engine
 *
 * The missing link between "Atlas decided what to build and generated an engineering
 * package" and "there is real code". This module takes an already-registered mission,
 * pulls its real architecture brief + validation plan (via the existing Mission
 * Orchestrator — never fabricated), and asks Claude to draft a small, focused
 * implementation.
 *
 * Safety model (deliberately conservative for a v1):
 *  - Only runs when a real ANTHROPIC_API_KEY is configured — no mock code generation.
 *  - Never writes into the working tree. Every proposed file lands under
 *    engineering/packages/<MISSION-ID>/proposed-changes/, mirroring its real target path,
 *    plus a CHANGES.md summary. A human reviews and applies the changes manually.
 *  - Every proposed path is validated against an allowlist (src/, scripts/, engineering/)
 *    and a denylist (path traversal, package.json, .env, lockfiles). Anything that fails
 *    is skipped and reported, never silently written or silently dropped.
 *  - Triggered manually via `npm run atlas:execute -- <MISSION-ID>`, and also automatically
 *    by the always-on runtime for whichever mission it currently ranks as top priority (see
 *    `ensureExecutionProposal` in atlas-runtime.ts). Either way this only ever drafts into
 *    the review-only proposed-changes/ folder — a human still always decides, via an
 *    explicit CEO Inbox "Approve" click or `npm run atlas:apply`, when a proposal is
 *    actually written into the real working tree.
 */

export const PROPOSAL_MANIFEST_FILENAME = "proposal-manifest.json";

export type ExecutionProposalState = "none" | "pending-review" | "applied";

/** Reports whether a mission already has a code proposal drafted (awaiting review under
 * proposed-changes/) or already applied (archived under applied-<timestamp>/), so callers
 * never draft a duplicate proposal for the same mission. */
export function getExecutionProposalState(missionId: string): ExecutionProposalState {
  const packageDir = join(ROOT_DIR, "engineering", "packages", missionId);
  if (!existsSync(packageDir)) return "none";

  const pendingManifest = join(packageDir, "proposed-changes", PROPOSAL_MANIFEST_FILENAME);
  if (existsSync(pendingManifest)) return "pending-review";

  const hasApplied = readdirSync(packageDir).some(
    (name) => name.startsWith("applied-") && existsSync(join(packageDir, name, PROPOSAL_MANIFEST_FILENAME)),
  );
  return hasApplied ? "applied" : "none";
}

export type ProposedFileChange = {
  path: string;
  action: "create" | "modify";
  content: string;
  reason: string;
};

export type SkippedFileChange = {
  path: string;
  reason: string;
};

export type ExecutionEngineResult =
  | {
      ok: true;
      missionId: string;
      title: string;
      summary: string;
      files: ProposedFileChange[];
      skippedFiles: SkippedFileChange[];
      risks: string[];
      followUp: string;
      reviewDir: string;
      contextFiles: string[];
      missingContextPaths: string[];
    }
  | { ok: false; missionId: string; message: string };

const SAFE_PREFIX_PATTERN = /^(src|scripts|engineering)\//;
const DENYLIST_PATTERNS = [/(^|\/)\.env/, /package(-lock)?\.json$/, /(^|\/)\.git\//, /node_modules\//];

export function isSafePath(path: string): boolean {
  if (!path || path.includes("..") || path.startsWith("/")) return false;
  if (!SAFE_PREFIX_PATTERN.test(path)) return false;
  if (DENYLIST_PATTERNS.some((pattern) => pattern.test(path))) return false;
  return true;
}

// --- Real repository context gathering -------------------------------------------------
// The very first Execution Engine run (EXEC-001) proved this gap by guessing a fictional
// Orchestrator import path. Instead of drafting blind from the architecture brief alone,
// we scan the mission's own text for real file paths it references and read them from
// disk — so Claude grounds its proposal in what actually exists, not what it assumes.

const EXISTING_FILE_PATH_PATTERN = /(?:src|scripts|engineering)\/[A-Za-z0-9_\-./]+\.(?:ts|tsx|md|json)/g;
// Real incident (BRAIN-002): with this cap at 10, discoverLikelyExistingPaths's own matches
// (a whole module directory) filled the entire budget before scripts/atlas-runtime.ts — a
// path the mission text explicitly referenced — ever got a slot, even though the combined
// real size of every relevant file here was ~50k chars, well under MAX_TOTAL_CONTEXT_CHARS.
// The file-count cap was never meant to be the binding constraint; the char budget is.
const MAX_CONTEXT_FILES = 24;
// Generous caps: this only bounds the INPUT side of the call (Claude's context window is
// ~1M tokens per the model profile), not the output budget — so real files up to a few
// thousand lines fit comfortably. A first version capped this at 6000 chars, which
// silently truncated mid-file for anything non-trivial; Claude correctly refused to guess
// at the missing tail rather than fabricate it, but that meant it couldn't do the one
// thing it was asked to do. Better to give it the whole file.
const MAX_FILE_CHARS = 20_000;
const MAX_TOTAL_CONTEXT_CHARS = 80_000;

export type ExistingFileContext = { path: string; content: string; truncated: boolean };

/** Finds real-looking file paths mentioned anywhere in the mission's own text (goal, focus,
 * constraints, architecture brief, validation plan) — this is how mission cards already
 * reference concrete modules (e.g. "ExecutionEngine module (scripts/atlas/executionEngine.ts)"). */
function extractReferencedPaths(text: string): string[] {
  const matches = text.match(EXISTING_FILE_PATH_PATTERN) ?? [];
  return [...new Set(matches)];
}

const TITLE_STOPWORDS = new Set([
  "engine",
  "engines",
  "system",
  "systems",
  "module",
  "modules",
  "framework",
  "layer",
  "component",
  "components",
  "manager",
  "service",
  "services",
  "the",
  "and",
  "for",
  "atlas",
]);

function titleKeywords(title: string): string[] {
  return [
    ...new Set(
      title
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2 && !TITLE_STOPWORDS.has(word)),
    ),
  ];
}

const DISCOVERY_ROOTS = ["src/atlas", "scripts/atlas"];
const MAX_DISCOVERED_DIRS = 3;
const MAX_FILES_PER_DISCOVERED_DIR = 8;
const MAX_DISCOVERY_DEPTH = 5;
// EXEC-004 · The original heuristic only matched DIRECTORY names against title keywords —
// real gap, found by re-reading this codebase's own layout: most Atlas modules live as flat
// files directly under src/atlas/**/ or scripts/atlas/ (postApplyValidation.ts,
// replanOnFailure.ts, tipsGenerationEngine.ts, ...), not in their own named subdirectory, so
// a mission whose title matches one of those would never have been discovered at all — the
// walk only ever looked at subdirectories, never at files sitting directly inside them.
const MAX_DISCOVERED_FILES = 8;
// Caps the total number of files this function will ever open to peek at their header, no
// matter how large DISCOVERY_ROOTS' tree grows — this is a fallback signal, weaker than a
// name match, so it must stay cheap and bounded rather than scanning everything.
const MAX_CONTENT_SCAN_FILES = 200;
const CONTENT_HEADER_PEEK_CHARS = 400;

/** BRAIN-003 dogfooding · Best-effort directory-name search for an existing implementation
 * matching the mission's own title — e.g. title "Context Engine" -> keyword "context" ->
 * finds src/atlas/brain/context/. Exists because a mission card's Focus text doesn't always
 * spell out a module's real path; without this, Claude previously (safely, but wastefully)
 * recreated an already-complete, already-wired Context Engine from scratch under a wrong
 * path, because nothing in the mission text pointed at the real one. Capped and defensive:
 * never throws, never descends into node_modules or dotfiles.
 *
 * EXEC-004 · Extended with two more signals, both still name/content of what's ON DISK, never
 * inferred: (1) a FILE whose own name matches a keyword, even outside any matching directory
 * — closes the flat-file gap above; (2) as a last-resort fallback for files that match
 * neither a directory nor their own filename, a cheap peek at just the first ~400 chars
 * (where every real module in this codebase already carries a one-line doc comment naming
 * what it is, e.g. "BRAIN-011 · Re-plan on validation failure") checked for a whole-word
 * keyword mention. Content-matched files are real signal too, but weaker than a name match,
 * so they only fill remaining budget after name-based matches are exhausted. */
function safeListNames(fullDir: string): string[] {
  try {
    return readdirSync(fullDir);
  } catch {
    return [];
  }
}

function safeIsDirectory(fullPath: string): boolean {
  try {
    return statSync(fullPath).isDirectory();
  } catch {
    return false;
  }
}

/** Splits a filename into lowercase word tokens — strips the extension, then breaks on
 * camelCase boundaries as well as kebab-case/snake_case/dot separators, so
 * "postApplyValidation.ts" yields ["post", "apply", "validation"] and matches a "validatie"
 * mission just as readily as a directory literally named "validation" would have. */
function fileNameWords(fileName: string): string[] {
  const withoutExt = fileName.replace(/\.(ts|tsx)$/, "");
  const spaced = withoutExt.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !TITLE_STOPWORDS.has(word));
}

function matchesAnyKeyword(words: string[], keywords: string[]): boolean {
  return words.some((word) => keywords.some((keyword) => word === keyword || word === `${keyword}s` || `${word}s` === keyword));
}

/** Cheap header peek — only the first CONTENT_HEADER_PEEK_CHARS, never a full-file read, and
 * only ever called for files that already survived the two cheaper name-based checks first. */
function fileHeaderMentionsKeyword(fullPath: string, keywords: string[]): boolean {
  try {
    const fd = readFileSync(fullPath, "utf8").slice(0, CONTENT_HEADER_PEEK_CHARS).toLowerCase();
    return keywords.some((keyword) => new RegExp(`\\b${keyword}`, "i").test(fd));
  } catch {
    return false;
  }
}

function discoverLikelyExistingPaths(title: string): string[] {
  const keywords = titleKeywords(title);
  if (keywords.length === 0) return [];

  const matchedDirs: string[] = [];
  const matchedFilesByName: string[] = [];
  const contentScanCandidates: string[] = [];
  let contentScanned = 0;

  const walk = (relDir: string, depth: number): void => {
    if (depth > MAX_DISCOVERY_DEPTH) return;

    for (const name of safeListNames(join(ROOT_DIR, relDir))) {
      if (name === "node_modules" || name.startsWith(".")) continue;

      const childRelPath = `${relDir}/${name}`;
      const fullChildPath = join(ROOT_DIR, childRelPath);

      if (safeIsDirectory(fullChildPath)) {
        const nameLower = name.toLowerCase();
        if (matchedDirs.length < MAX_DISCOVERED_DIRS && keywords.some((keyword) => nameLower === keyword || nameLower === `${keyword}s`)) {
          matchedDirs.push(childRelPath);
          continue; // a matched directory is the target itself — no need to also search inside it
        }
        walk(childRelPath, depth + 1);
        continue;
      }

      if (!/\.(ts|tsx)$/.test(name)) continue;

      if (matchedFilesByName.length < MAX_DISCOVERED_FILES && matchesAnyKeyword(fileNameWords(name), keywords)) {
        matchedFilesByName.push(childRelPath);
        continue;
      }

      // Not matched by name — a candidate for the weaker content-header fallback, bounded
      // separately so a large tree can't turn this into an unbounded scan.
      if (contentScanCandidates.length < MAX_CONTENT_SCAN_FILES) {
        contentScanCandidates.push(childRelPath);
      }
    }
  };

  for (const root of DISCOVERY_ROOTS) {
    walk(root, 0);
  }

  const paths: string[] = [];
  for (const dir of matchedDirs) {
    const fullDir = join(ROOT_DIR, dir);
    const files = safeListNames(fullDir)
      .filter((name) => /\.(ts|tsx)$/.test(name) && !safeIsDirectory(join(fullDir, name)))
      .slice(0, MAX_FILES_PER_DISCOVERED_DIR)
      .map((name) => `${dir}/${name}`);
    paths.push(...files);
  }

  paths.push(...matchedFilesByName);

  // Content-header fallback only runs if name-based matching came up short — it's the
  // weakest, most expensive signal, so it never runs unnecessarily.
  if (paths.length === 0) {
    for (const relPath of contentScanCandidates) {
      if (contentScanned >= MAX_CONTENT_SCAN_FILES) break;
      contentScanned += 1;
      if (fileHeaderMentionsKeyword(join(ROOT_DIR, relPath), keywords)) {
        paths.push(relPath);
        if (paths.length >= MAX_DISCOVERED_FILES) break;
      }
    }
  }

  return paths;
}

/** Reads up to MAX_CONTEXT_FILES real files referenced by the mission, capped in size so a
 * large file never blows the token budget. Paths that don't exist are reported as
 * "missing" — for Claude, that's a real signal ("this is genuinely new, not existing"),
 * not silence. */
function gatherExistingFileContext(candidatePaths: string[]): {
  files: ExistingFileContext[];
  missing: string[];
} {
  const files: ExistingFileContext[] = [];
  const missing: string[] = [];
  let totalChars = 0;

  for (const path of candidatePaths) {
    if (files.length >= MAX_CONTEXT_FILES) break;
    if (!isSafePath(path)) continue;

    const fullPath = join(ROOT_DIR, path);
    if (!existsSync(fullPath)) {
      missing.push(path);
      continue;
    }

    try {
      const raw = readFileSync(fullPath, "utf8");
      const truncated = raw.length > MAX_FILE_CHARS;
      const content = truncated ? `${raw.slice(0, MAX_FILE_CHARS)}\n… (truncated for context budget)` : raw;
      if (totalChars + content.length > MAX_TOTAL_CONTEXT_CHARS) break;
      totalChars += content.length;
      files.push({ path, content, truncated });
    } catch {
      missing.push(path);
    }
  }

  return { files, missing };
}

/** Registers every .mission file on disk — mirrors atlas-runtime.ts so this script also
 * works standalone (e.g. run right after adding a new mission card). */
function loadMissionFilesFromDisk(): void {
  const missionsDir = join(ROOT_DIR, "engineering/missions");
  if (!existsSync(missionsDir)) return;

  for (const filename of readdirSync(missionsDir)) {
    if (!filename.endsWith(".mission")) continue;
    const missionId = filename.replace(/\.mission$/, "").toUpperCase();
    const sourcePath = `engineering/missions/${filename}`;
    const source = readFileSync(join(ROOT_DIR, sourcePath), "utf8");
    registerMissionFromSource(missionId, sourcePath, source);
  }
}

type RawImplementationOutput = {
  summary?: unknown;
  files?: unknown;
  risks?: unknown;
  followUp?: unknown;
};

function parseImplementationOutput(output: unknown): {
  summary: string;
  files: ProposedFileChange[];
  risks: string[];
  followUp: string;
} {
  const data = (output ?? {}) as RawImplementationOutput;

  const summary =
    typeof data.summary === "string" && data.summary.trim() ? data.summary.trim() : "Geen samenvatting ontvangen.";
  const followUp =
    typeof data.followUp === "string" && data.followUp.trim()
      ? data.followUp.trim()
      : "Controleer de voorgestelde bestanden handmatig voordat je ze toepast.";
  const risks = Array.isArray(data.risks) ? data.risks.filter((item): item is string => typeof item === "string") : [];

  const rawFiles = Array.isArray(data.files) ? data.files : [];
  const files: ProposedFileChange[] = rawFiles
    .map((item): ProposedFileChange | null => {
      if (!item || typeof item !== "object") return null;
      const entry = item as Record<string, unknown>;
      const path = typeof entry.path === "string" ? entry.path.trim() : "";
      const content = typeof entry.content === "string" ? entry.content : "";
      const action: ProposedFileChange["action"] = entry.action === "modify" ? "modify" : "create";
      const reason =
        typeof entry.reason === "string" && entry.reason.trim() ? entry.reason.trim() : "Geen reden opgegeven.";
      if (!path || !content) return null;
      return { path, action, content, reason };
    })
    .filter((item): item is ProposedFileChange => item !== null);

  return { summary, files, risks, followUp };
}

export function buildChangesMarkdown(input: {
  missionId: string;
  title: string;
  summary: string;
  files: ProposedFileChange[];
  skipped: SkippedFileChange[];
  risks: string[];
  followUp: string;
  contextFiles: string[];
  missingContextPaths: string[];
}): string {
  const lines: string[] = [
    `# Voorgestelde implementatie — ${input.missionId} · ${input.title}`,
    "",
    "**⚠️ Dit is een voorstel, geen toegepaste wijziging.** Niets in de working tree is aangepast. " +
      "Bekijk elk bestand hieronder, kopieer het handmatig naar de echte locatie (het pad staat in de titel), " +
      "en verwijder deze proposed-changes/ map daarna.",
    "",
    "## Echte context meegegeven aan Claude",
    input.contextFiles.length > 0
      ? input.contextFiles.map((path) => `- \`${path}\` (echte inhoud gelezen van disk)`).join("\n")
      : "_Geen bestaande bestanden gevonden om als context mee te geven._",
  ];

  if (input.missingContextPaths.length > 0) {
    lines.push(
      "",
      "Genoemd in de missie maar bestaat nog niet op disk (dus genuine nieuw, niet gegokt):",
      ...input.missingContextPaths.map((path) => `- \`${path}\``),
    );
  }

  lines.push(
    "",
    "## Samenvatting",
    input.summary,
    "",
    `## Voorgestelde bestanden (${input.files.length})`,
  );

  if (input.files.length === 0) {
    lines.push("_Geen bestanden voorgesteld._");
  } else {
    for (const file of input.files) {
      lines.push(`- **${file.action}** \`${file.path}\` — ${file.reason}`);
    }
  }

  if (input.skipped.length > 0) {
    lines.push("", `## Geweigerd door veiligheidscontrole (${input.skipped.length})`);
    for (const file of input.skipped) {
      lines.push(`- \`${file.path}\` — ${file.reason}`);
    }
  }

  lines.push(
    "",
    "## Risico's",
    input.risks.length > 0 ? input.risks.map((risk) => `- ${risk}`).join("\n") : "_Geen risico's opgegeven._",
    "",
    "## Vervolgstap",
    input.followUp,
  );

  return lines.join("\n");
}

/** Runs the Execution Engine for one already-registered mission. Always resolves; never
 * throws — callers (CLI, future runtime hooks) get a structured ok/false result instead. */
export async function runExecutionEngine(missionIdInput: string): Promise<ExecutionEngineResult> {
  const missionId = missionIdInput.trim().toUpperCase();

  loadMissionFilesFromDisk();

  if (!missionRegistry.has(missionId)) {
    return {
      ok: false,
      missionId,
      message: `Mission "${missionId}" is niet geregistreerd. Voeg eerst engineering/missions/${missionId}.mission toe.`,
    };
  }

  if (!isAnthropicConfigured()) {
    return {
      ok: false,
      missionId,
      message: "ANTHROPIC_API_KEY is niet geconfigureerd — Execution Engine vereist een echte Claude-call en heeft geen mock-modus.",
    };
  }

  const orchestrated = orchestrateMission(missionId);
  if (!orchestrated.ok) {
    return { ok: false, missionId, message: orchestrated.message };
  }

  const pkg = orchestrated.package;
  const architectureBrief = pkg.artifacts.find((artifact) => artifact.filename === "architecture-brief.md")?.markdown ?? "";
  const validationPlan = pkg.artifacts.find((artifact) => artifact.filename === "validation-plan.md")?.markdown ?? "";

  const referencedText = [
    pkg.context.card.goal,
    ...pkg.context.card.focus,
    ...pkg.context.card.constraints,
    architectureBrief,
    validationPlan,
  ].join("\n");
  // Discovered-by-name paths go first: they're specifically how we now avoid recreating an
  // already-existing, already-wired module under a new path (see discoverLikelyExistingPaths).
  const candidatePaths = [...new Set([...discoverLikelyExistingPaths(pkg.title), ...extractReferencedPaths(referencedText)])];
  const { files: existingFiles, missing: missingContextPaths } = gatherExistingFileContext(candidatePaths);

  try {
    bootstrapAiProviders();

    const payload = {
      missionId: pkg.missionId,
      title: pkg.title,
      goal: pkg.context.card.goal,
      focus: pkg.context.card.focus,
      constraints: pkg.context.card.constraints,
      architectureBrief,
      validationPlan,
      existingFiles: existingFiles.map((file) => ({ path: file.path, content: file.content })),
      missingContextPaths,
    };

    const execution = await executeTask<RawImplementationOutput>({
      task: "mission.implement",
      payload,
      moduleId: "atlas-execution",
      skipCache: true,
    });

    const metadata = execution.metadata ?? {};
    const fellBackToMock = metadata.transport === "mock" || Boolean(metadata.fallbackUsed || metadata.liveError);
    if (fellBackToMock) {
      const liveError = typeof metadata.liveError === "string" ? metadata.liveError : undefined;
      return {
        ok: false,
        missionId,
        message: liveError ?? "Claude transport viel terug op mock-data — geen live codevoorstel ontvangen.",
      };
    }

    const parsed = parseImplementationOutput(execution.output);

    const reviewDir = join(ROOT_DIR, "engineering", "packages", missionId, "proposed-changes");
    if (existsSync(reviewDir)) {
      rmSync(reviewDir, { recursive: true, force: true });
    }
    mkdirSync(reviewDir, { recursive: true });

    const written: ProposedFileChange[] = [];
    const skipped: SkippedFileChange[] = [];

    for (const file of parsed.files) {
      if (!isSafePath(file.path)) {
        skipped.push({
          path: file.path,
          reason: "Pad geweigerd: moet binnen src/, scripts/ of engineering/ vallen, geen '..', geen gevoelig bestand.",
        });
        continue;
      }
      const destination = join(reviewDir, file.path);
      mkdirSync(dirname(destination), { recursive: true });
      writeFileSync(destination, file.content, "utf8");
      written.push(file);
    }

    const changesLog = buildChangesMarkdown({
      missionId,
      title: pkg.title,
      summary: parsed.summary,
      files: written,
      skipped,
      risks: parsed.risks,
      followUp: parsed.followUp,
      contextFiles: existingFiles.map((file) => file.path),
      missingContextPaths,
    });
    writeFileSync(join(reviewDir, "CHANGES.md"), changesLog, "utf8");

    // Machine-readable twin of CHANGES.md — the Apply Engine reads this to know exactly
    // which paths to apply and what action was intended, instead of re-deriving it from a
    // directory walk (which could accidentally include CHANGES.md itself or misjudge
    // create-vs-modify).
    writeFileSync(
      join(reviewDir, PROPOSAL_MANIFEST_FILENAME),
      JSON.stringify(
        {
          missionId,
          title: pkg.title,
          generatedAt: new Date().toISOString(),
          summary: parsed.summary,
          files: written.map((file) => ({ path: file.path, action: file.action, reason: file.reason })),
          risks: parsed.risks,
          followUp: parsed.followUp,
        },
        null,
        2,
      ),
      "utf8",
    );

    return {
      ok: true,
      missionId,
      title: pkg.title,
      summary: parsed.summary,
      files: written,
      skippedFiles: skipped,
      risks: parsed.risks,
      followUp: parsed.followUp,
      reviewDir: `engineering/packages/${missionId}/proposed-changes`,
      contextFiles: existingFiles.map((file) => file.path),
      missingContextPaths,
    };
  } catch (error) {
    return {
      ok: false,
      missionId,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

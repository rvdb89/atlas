import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import { bootstrapAtlas } from "@/atlas/bootstrap";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { runPublishingPipeline } from "@/atlas/publishing/pipeline/PublishingPipeline";
import type { ContentType, PublicationDraft } from "@/atlas/publishing/types";
import type {
  KnowledgeBiteCategoryId,
  KnowledgeBiteSection,
  KnowledgeBiteSectionId,
} from "@/modules/doughbert/types/knowledgeBite";

import {
  buildChangesMarkdown,
  getExecutionProposalState,
  isSafePath,
  PROPOSAL_MANIFEST_FILENAME,
  type ExecutionEngineResult,
  type ProposedFileChange,
  type SkippedFileChange,
} from "./executionEngine";
import { ROOT_DIR } from "./shared";

/**
 * CONTENT-REAL-001 · Content Generation Engine
 *
 * Root cause found in a CEO conversation: the real, specialized agent team the CEO built
 * (copywriter, fact-checker, link-engine, domain-validator, ...) already makes genuine AI
 * calls via the same Orchestrator every other Atlas task uses — but two things kept it from
 * ever reaching the app: (1) its copywriter prompt only ever asked for title/subtitle/SEO,
 * never real article content, so every draft was structurally empty, and (2) the review
 * pipeline's "publish" step only flipped an in-memory status flag and never wrote anything
 * to disk. Both are now fixed (see knowledge/index.ts prompt + PublishingPipeline.ts).
 *
 * This module is the missing last mile: it drives the REAL pipeline (runPublishingPipeline
 * — copywriter, visual-designer, fact-checker, link-engine, domain-validator, all real AI
 * calls) once per article, then DETERMINISTICALLY (no LLM involved) serializes the results
 * into a small, focused TypeScript file. That split matters: earlier content missions asked
 * an LLM to hand-write escaped TypeScript source for 6 rich articles in one JSON response,
 * which repeatedly hit the output-token ceiling and got cut off mid-file. Here the AI only
 * ever writes plain article content (one article at a time, its own small budget) — turning
 * that into valid source code is a mechanical step with zero truncation risk.
 *
 * Output contract deliberately mirrors runExecutionEngine()'s ExecutionEngineResult exactly,
 * so the CEO Inbox, Apply Engine and approval flow need no changes at all — a content
 * mission just drafts differently, everything downstream of "proposed-changes/" is identical.
 */

// BRAIN-010 · Pause between sequential per-article Claude calls within one mission run — see
// the pacing comment at the call site for why.
const CONTENT_ARTICLE_PACING_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type ContentMissionArticle = {
  slug: string;
  title: string;
  libraryOrder: number;
};

export type ContentMissionConfig = {
  missionId: string;
  categoryId: KnowledgeBiteCategoryId;
  contentType: ContentType;
  articles: ContentMissionArticle[];
  /** Where the generated registration file lands — mirrors flour/index.ts's own pattern. */
  targetFile: string;
  exportName: string;
};

// Hand-curated on purpose: these are CEO-triggered, reviewed-before-apply missions, not a
// mass-automation path yet. Add one entry per content mission here as new ones are queued.
export const CONTENT_MISSIONS: Record<string, ContentMissionConfig> = {
  "CONTENT-002": {
    missionId: "CONTENT-002",
    categoryId: "hydratatie",
    contentType: "technique",
    articles: [
      { slug: "hydratatie", title: "Hydratatie", libraryOrder: 1 },
      { slug: "bakers-percentage", title: "Baker's Percentage", libraryOrder: 2 },
      { slug: "waterabsorptie", title: "Waterabsorptie", libraryOrder: 3 },
      { slug: "hoge-hydratatie", title: "Hoge hydratatie", libraryOrder: 4 },
      { slug: "lage-hydratatie", title: "Lage hydratatie", libraryOrder: 5 },
      { slug: "hydratatie-berekenen", title: "Hydratatie berekenen", libraryOrder: 6 },
    ],
    targetFile: "src/modules/doughbert/knowledge/hydratatie/index.ts",
    exportName: "hydratatieArticles",
  },
  // Remaining 5 catalog categories — same pattern as CONTENT-002, smallest/best-grounded
  // first. Article slugs/titles/order copied verbatim from bulk/catalogArticles.ts so the
  // stub-removal step (removeStubEntries) matches exactly.
  "CONTENT-003": {
    missionId: "CONTENT-003",
    categoryId: "temperaturen",
    contentType: "technique",
    articles: [
      { slug: "deegtemperatuur", title: "Deegtemperatuur (DDT)", libraryOrder: 1 },
      { slug: "watertemperatuur-berekenen", title: "Watertemperatuur berekenen", libraryOrder: 2 },
      { slug: "oventemperaturen", title: "Oventemperaturen", libraryOrder: 3 },
      { slug: "temperatuur-fermentatie", title: "Fermentatietemperaturen", libraryOrder: 4 },
      { slug: "kamertemperatuur", title: "Kamertemperatuur", libraryOrder: 5 },
      { slug: "koelkast-fermentatie-temperatuur", title: "Koelkast fermentatie", libraryOrder: 6 },
    ],
    targetFile: "src/modules/doughbert/knowledge/temperaturen/index.ts",
    exportName: "temperaturenArticles",
  },
  "CONTENT-004": {
    missionId: "CONTENT-004",
    categoryId: "fermentatie",
    contentType: "technique",
    articles: [
      { slug: "bulkfermentatie", title: "Bulkfermentatie", libraryOrder: 1 },
      { slug: "narijs", title: "Narijs", libraryOrder: 2 },
      { slug: "cold-proof", title: "Cold Proof", libraryOrder: 3 },
      { slug: "warm-fermenteren", title: "Warm fermenteren", libraryOrder: 4 },
      { slug: "overproof", title: "Overproof", libraryOrder: 5 },
      { slug: "underproof", title: "Underproof", libraryOrder: 6 },
      { slug: "fermentatieschemas", title: "Fermentatieschema's", libraryOrder: 7 },
    ],
    targetFile: "src/modules/doughbert/knowledge/fermentatie/index.ts",
    exportName: "fermentatieArticles",
  },
  "CONTENT-005": {
    missionId: "CONTENT-005",
    categoryId: "starter",
    contentType: "technique",
    articles: [
      { slug: "wat-is-een-starter", title: "Wat is een starter?", libraryOrder: 1 },
      { slug: "starter-voeden", title: "Starter voeden", libraryOrder: 2 },
      { slug: "starter-activeren", title: "Starter activeren", libraryOrder: 3 },
      { slug: "starter-bewaren", title: "Starter bewaren", libraryOrder: 4 },
      { slug: "starter-op-piek-herkennen", title: "Starter op piek herkennen", libraryOrder: 5 },
      { slug: "starterhydratie", title: "Starterhydratie", libraryOrder: 6 },
      { slug: "slappe-starter", title: "Slappe starter", libraryOrder: 7 },
      { slug: "zure-starter", title: "Zure starter", libraryOrder: 8 },
      { slug: "starter-redden", title: "Starter redden", libraryOrder: 9 },
    ],
    targetFile: "src/modules/doughbert/knowledge/starter/index.ts",
    exportName: "starterArticles",
  },
  "CONTENT-006": {
    missionId: "CONTENT-006",
    categoryId: "bakwetenschap",
    contentType: "science",
    articles: [
      { slug: "gluten", title: "Gluten", libraryOrder: 1 },
      { slug: "glutenontwikkeling", title: "Glutenontwikkeling", libraryOrder: 2 },
      { slug: "eiwitten", title: "Eiwitten", libraryOrder: 3 },
      { slug: "enzymen", title: "Enzymen", libraryOrder: 4 },
      { slug: "ash-content", title: "Ash-content", libraryOrder: 5 },
      { slug: "w-waarde", title: "W-waarde", libraryOrder: 6 },
      { slug: "falling-number", title: "Falling Number", libraryOrder: 7 },
      { slug: "osmose", title: "Osmose", libraryOrder: 8 },
      { slug: "gist", title: "Gist", libraryOrder: 9 },
      { slug: "melkzuurbacterien", title: "Melkzuurbacteriën", libraryOrder: 10 },
      { slug: "maillardreactie", title: "Maillardreactie", libraryOrder: 11 },
      { slug: "karamellisatie", title: "Karamellisatie", libraryOrder: 12 },
    ],
    targetFile: "src/modules/doughbert/knowledge/science/index.ts",
    exportName: "bakwetenschapArticles",
  },
  "CONTENT-007": {
    missionId: "CONTENT-007",
    categoryId: "technieken",
    contentType: "technique",
    articles: [
      { slug: "handmatig-mengen", title: "Handmatig mengen", libraryOrder: 1 },
      { slug: "machinaal-kneden", title: "Machinaal kneden", libraryOrder: 2 },
      { slug: "autolyse", title: "Autolyse", libraryOrder: 3 },
      { slug: "fermentolyse", title: "Fermentolyse", libraryOrder: 4 },
      { slug: "stretch-and-fold", title: "Stretch & Fold", libraryOrder: 5 },
      { slug: "coil-fold", title: "Coil Fold", libraryOrder: 6 },
      { slug: "slap-and-fold", title: "Slap & Fold", libraryOrder: 7 },
      { slug: "lamineren", title: "Lamineren", libraryOrder: 8 },
      { slug: "bassinage", title: "Bassinage", libraryOrder: 9 },
      { slug: "preshape", title: "Preshape", libraryOrder: 10 },
      { slug: "final-shape", title: "Final Shape", libraryOrder: 11 },
      { slug: "boule-vormen", title: "Boule vormen", libraryOrder: 12 },
      { slug: "batard-vormen", title: "Batard vormen", libraryOrder: 13 },
      { slug: "banneton-gebruiken", title: "Banneton gebruiken", libraryOrder: 14 },
      { slug: "scoren", title: "Scoren", libraryOrder: 15 },
      { slug: "ovenspring-creeren", title: "Ovenspring creëren", libraryOrder: 16 },
      { slug: "dutch-oven-bakken", title: "Dutch Oven bakken", libraryOrder: 17 },
      { slug: "pizza-uitrekken", title: "Pizza uitrekken", libraryOrder: 18 },
      { slug: "pizza-lanceren", title: "Pizza lanceren", libraryOrder: 19 },
      { slug: "pizza-draaien", title: "Pizza draaien", libraryOrder: 20 },
      { slug: "pizza-bakken-op-staal", title: "Pizza bakken op staal", libraryOrder: 21 },
      { slug: "pizza-bakken-op-steen", title: "Pizza bakken op steen", libraryOrder: 22 },
    ],
    // categoryId stays Dutch ("technieken", matches KnowledgeBiteCategoryId), but the folder
    // on disk is the pre-scaffolded English "techniques" directory (already existed, empty).
    targetFile: "src/modules/doughbert/knowledge/techniques/index.ts",
    exportName: "techniekenArticles",
  },
  // Retry for the one CONTENT-003 article that got skipped (too thin to publish) while the
  // other 5 temperaturen articles were already applied. Deliberately its own folder/export —
  // NOT temperaturen/index.ts + temperaturenArticles — because buildRegistrationFile always
  // writes a fresh file from just this mission's own `articles` list; reusing the same
  // target would overwrite (destroy) the 5 already-applied temperaturen articles instead of
  // adding to them. categoryId stays "temperaturen" so the article still shows up in the
  // right category in the app; only the source file/export are separate.
  "CONTENT-008": {
    missionId: "CONTENT-008",
    categoryId: "temperaturen",
    contentType: "technique",
    articles: [{ slug: "kamertemperatuur", title: "Kamertemperatuur", libraryOrder: 5 }],
    targetFile: "src/modules/doughbert/knowledge/temperaturen-kamertemperatuur/index.ts",
    exportName: "kamertemperatuurArticles",
  },
  // Same pattern as CONTENT-008: retry for the one CONTENT-005 article ("zure starter") that
  // got skipped while the other 8 starter articles were already applied. Own folder/export,
  // never starter/index.ts + starterArticles, to avoid overwriting the 8 already-applied
  // starter articles.
  "CONTENT-009": {
    missionId: "CONTENT-009",
    categoryId: "starter",
    contentType: "technique",
    articles: [{ slug: "zure-starter", title: "Zure starter", libraryOrder: 8 }],
    targetFile: "src/modules/doughbert/knowledge/starter-zure-starter/index.ts",
    exportName: "zureStarterArticles",
  },
  // BRAIN-010 · Retry for the 17 (of 22) CONTENT-007 technieken articles that hit the
  // silent-Claude-fallback bug (see CurrentStateRegistry.ts's content evidence) — now fixed
  // with retry-with-backoff + pacing, so a rerun has a real chance to succeed this time.
  // Own folder/export, never techniques/index.ts + techniekenArticles, to avoid overwriting
  // the 5 articles (machinaal-kneden, autolyse, fermentolyse, stretch-and-fold, coil-fold)
  // that genuinely succeeded the first time.
  "CONTENT-010": {
    missionId: "CONTENT-010",
    categoryId: "technieken",
    contentType: "technique",
    articles: [
      { slug: "handmatig-mengen", title: "Handmatig mengen", libraryOrder: 1 },
      { slug: "slap-and-fold", title: "Slap & Fold", libraryOrder: 7 },
      { slug: "lamineren", title: "Lamineren", libraryOrder: 8 },
      { slug: "bassinage", title: "Bassinage", libraryOrder: 9 },
      { slug: "preshape", title: "Preshape", libraryOrder: 10 },
      { slug: "final-shape", title: "Final Shape", libraryOrder: 11 },
      { slug: "boule-vormen", title: "Boule vormen", libraryOrder: 12 },
      { slug: "batard-vormen", title: "Batard vormen", libraryOrder: 13 },
      { slug: "banneton-gebruiken", title: "Banneton gebruiken", libraryOrder: 14 },
      { slug: "scoren", title: "Scoren", libraryOrder: 15 },
      { slug: "ovenspring-creeren", title: "Ovenspring creëren", libraryOrder: 16 },
      { slug: "dutch-oven-bakken", title: "Dutch Oven bakken", libraryOrder: 17 },
      { slug: "pizza-uitrekken", title: "Pizza uitrekken", libraryOrder: 18 },
      { slug: "pizza-lanceren", title: "Pizza lanceren", libraryOrder: 19 },
      { slug: "pizza-draaien", title: "Pizza draaien", libraryOrder: 20 },
      { slug: "pizza-bakken-op-staal", title: "Pizza bakken op staal", libraryOrder: 21 },
      { slug: "pizza-bakken-op-steen", title: "Pizza bakken op steen", libraryOrder: 22 },
    ],
    targetFile: "src/modules/doughbert/knowledge/technieken-retry/index.ts",
    exportName: "techniekenRetryArticles",
  },
};

export function isContentMission(missionId: string): boolean {
  return missionId.toUpperCase() in CONTENT_MISSIONS;
}

/** Walks CONTENT_MISSIONS in declared order and returns the first one that hasn't actually
 * been applied yet (checked against real disk state via getExecutionProposalState — the same
 * ground truth the CEO Inbox itself reconciles against, not a separately-tracked pointer that
 * can go stale). Lets the runtime auto-chain through the whole remaining content backlog
 * (CONTENT-005 -> 006 -> 007, ...) without a human having to hand-edit
 * CurrentStateRegistry.ts's evolutionMissionId after every single completed category. */
export function getNextUnappliedContentMissionId(): string | null {
  for (const missionId of Object.keys(CONTENT_MISSIONS)) {
    if (getExecutionProposalState(missionId) !== "applied") {
      return missionId;
    }
  }
  return null;
}

// --- Runtime validation of AI output -----------------------------------------------------
// The copywriter's JSON output is never trusted blindly — a malformed or thin response is
// skipped with a clear reason instead of silently writing bad content into the app.

const VALID_SECTION_IDS = new Set<KnowledgeBiteSectionId>([
  "what-is-it",
  "properties",
  "comparison",
  "science",
  "when-to-use",
  "when-not-to-use",
  "common-mistakes",
  "doughbert-tip",
  "faq",
  "did-you-know",
]);

function isValidSection(value: unknown): value is KnowledgeBiteSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Record<string, unknown>;
  return typeof section.title === "string" && typeof section.body === "string";
}

/** Only lets through an id that's actually one of the fixed KnowledgeBiteSectionId values —
 * anything else (the AI inventing a freeform id) is dropped rather than risking a generated
 * file that fails to compile because a plain string doesn't match the narrow union type. */
function sanitizeSectionId(value: unknown): KnowledgeBiteSectionId | undefined {
  return typeof value === "string" && VALID_SECTION_IDS.has(value as KnowledgeBiteSectionId)
    ? (value as KnowledgeBiteSectionId)
    : undefined;
}

function sanitizeSection(raw: Record<string, unknown>): KnowledgeBiteSection {
  return {
    id: sanitizeSectionId(raw.id),
    title: String(raw.title ?? ""),
    body: String(raw.body ?? ""),
    keyPoints: Array.isArray(raw.keyPoints) ? raw.keyPoints.filter((v) => typeof v === "string") : [],
    relatedKnowledge: Array.isArray(raw.relatedKnowledge)
      ? raw.relatedKnowledge.filter((v) => typeof v === "string")
      : [],
    doughbertTip: typeof raw.doughbertTip === "string" ? raw.doughbertTip : undefined,
    table: raw.table && typeof raw.table === "object" ? (raw.table as KnowledgeBiteSection["table"]) : undefined,
    comparisonTable:
      raw.comparisonTable && typeof raw.comparisonTable === "object"
        ? (raw.comparisonTable as KnowledgeBiteSection["comparisonTable"])
        : undefined,
    quote: raw.quote && typeof raw.quote === "object" ? (raw.quote as KnowledgeBiteSection["quote"]) : undefined,
    faq: Array.isArray(raw.faq) ? (raw.faq as KnowledgeBiteSection["faq"]) : undefined,
    mistakes: Array.isArray(raw.mistakes) ? (raw.mistakes as KnowledgeBiteSection["mistakes"]) : undefined,
    didYouKnow: Array.isArray(raw.didYouKnow) ? (raw.didYouKnow as KnowledgeBiteSection["didYouKnow"]) : undefined,
  };
}

const MIN_REAL_SECTIONS = 3;

/** BRAIN-010 · When the copywriter call's transport silently fell back to a mock response
 * (see createClaudeTransport.ts + formatTaskExecutionLog's "STILLE FALLBACK" marker), the
 * real reason is buried in the draft's pipelineLog — surfaced here so a skipped article's
 * risk/reason text tells the CEO what actually went wrong (e.g. a rate limit) instead of
 * the generic, un-actionable "no contentPayload received". */
function describeSilentFallback(draft: PublicationDraft): string {
  const line = draft.pipelineLog?.find((entry) => entry.includes("STILLE FALLBACK"));
  if (!line) return "";
  const detail = line.split("STILLE FALLBACK —")[1]?.trim();
  return detail ? ` Echte oorzaak: de AI-aanroep mislukte stil en viel terug op een placeholder (${detail}).` : "";
}

/** Extracts and validates the article body the copywriter produced. Returns null (with a
 * reason) for anything too thin to be worth publishing — never writes a half-empty article. */
function extractArticleBody(
  draft: PublicationDraft,
): { summary: string; sections: KnowledgeBiteSection[] } | { error: string } {
  const payload = draft.contentPayload as { content?: { summary?: unknown; sections?: unknown } } | undefined;
  const body = payload?.content;
  if (!body) {
    return { error: `Geen contentPayload ontvangen van de copywriter.${describeSilentFallback(draft)}` };
  }

  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const rawSections = Array.isArray(body.sections) ? body.sections : [];
  const validSections = rawSections
    .filter((item): item is Record<string, unknown> => isValidSection(item))
    .map(sanitizeSection);

  if (summary.length === 0 || validSections.length < MIN_REAL_SECTIONS) {
    return {
      error: `Te dun om te publiceren (summary: ${summary.length} tekens, ${validSections.length} geldige secties, minimaal ${MIN_REAL_SECTIONS} nodig).`,
    };
  }

  return { summary, sections: validSections };
}

function estimateReadingTime(summary: string, sections: KnowledgeBiteSection[]): number {
  const words =
    summary.split(/\s+/).length + sections.reduce((sum, section) => sum + section.body.split(/\s+/).length, 0);
  return Math.max(3, Math.round(words / 180));
}

// --- Deterministic TS serialization -------------------------------------------------------
// No LLM involved past this point — this is why the token-budget failures that plagued the
// raw code-generation approach structurally cannot happen here.

function serializeArticle(input: {
  article: ContentMissionArticle;
  categoryId: KnowledgeBiteCategoryId;
  draft: PublicationDraft;
  body: { summary: string; sections: KnowledgeBiteSection[] };
}): string {
  const { article, categoryId, draft, body } = input;
  const relatedKnowledge = draft.linkGraph?.nodes.map((node) => node.slug) ?? [];
  const tags = draft.seo.tags.length > 0 ? draft.seo.tags : [article.title];

  const definition = {
    slug: article.slug,
    categoryId,
    title: article.title,
    libraryOrder: article.libraryOrder,
    status: "published" as const,
    metadata: {
      subtitle: draft.subtitle || draft.title,
      difficulty: "beginner" as const,
      readingTimeMinutes: estimateReadingTime(body.summary, body.sections),
      tags,
      relatedRecipes: [],
      relatedKnowledge,
      relatedTips: [],
    },
    content: {
      summary: body.summary,
      sections: body.sections,
    },
  };

  const varName = `${toCamelCase(article.slug)}KnowledgeBite`;
  return (
    `export const ${varName} = defineKnowledgeBite(${JSON.stringify(definition, null, 2)});\n`
  );
}

function toCamelCase(slug: string): string {
  return slug
    .split("-")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

function buildRegistrationFile(config: ContentMissionConfig, articles: string[], varNames: string[]): string {
  const lines = [
    'import { defineKnowledgeBite } from "../helpers";',
    'import { definitionToArticleInput } from "../import/articleNormalizer";',
    'import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";',
    "",
    ...articles,
    `/** All ${config.categoryId} articles — generated by Atlas' real content pipeline (see`,
    " * scripts/atlas/contentGenerationEngine.ts), reviewed and approved via the CEO Inbox.",
    " * Add new articles in this category here, not in bulk/catalogArticles.ts. */",
    `export const ${config.exportName}: KnowledgeArticleInput[] = [`,
    ...varNames.map((name) => `  definitionToArticleInput(${name}),`),
    "];",
    "",
  ];
  return lines.join("\n");
}

/** Deterministic, targeted patch — inserts one import + one array-spread entry into
 * collectSources.ts. Never rewrites the file wholesale; if the expected anchors aren't
 * found (file changed shape since this was written), it reports that as a risk instead of
 * guessing.
 *
 * The spread anchor is regex-based (matches the whole `const raw = [...]` array literal)
 * rather than an exact string, because after the first content mission is applied the array
 * already contains one or more `...xArticles` entries beyond `...catalogArticles` — an exact
 * string anchor would only ever match the very first mission and silently break every
 * mission after it. */
function patchCollectSources(config: ContentMissionConfig): { content: string } | { error: string } {
  const path = join(ROOT_DIR, "src/modules/doughbert/knowledge/collectSources.ts");
  if (!existsSync(path)) return { error: `collectSources.ts niet gevonden op ${path}` };

  const original = readFileSync(path, "utf8");
  // Import path is derived from the target file's own folder, not categoryId — categoryId
  // is a data value (e.g. Dutch "technieken") that doesn't always match the folder name on
  // disk (e.g. the pre-scaffolded English "techniques" directory).
  const folderName = basename(dirname(config.targetFile));
  const importLine = `import { ${config.exportName} } from "./${folderName}";`;
  if (original.includes(importLine)) {
    return { error: `collectSources.ts bevat al een import voor ${config.exportName} — mission lijkt al toegepast.` };
  }

  const importAnchor = 'import { catalogArticles } from "./bulk/catalogArticles";';
  if (!original.includes(importAnchor)) {
    return { error: `Verwachte import-regel niet gevonden in collectSources.ts: ${importAnchor}` };
  }

  const rawArrayPattern = /const raw = \[([^\]]*)\];/;
  const match = original.match(rawArrayPattern);
  if (!match) {
    return { error: "Verwachte 'const raw = [...]' array niet gevonden in collectSources.ts." };
  }

  const withImport = original.replace(importAnchor, `${importAnchor}\n${importLine}`);
  const withSpread = withImport.replace(
    rawArrayPattern,
    (_full, inner: string) => `const raw = [${inner.trim()}, ...${config.exportName}];`,
  );

  return { content: withSpread };
}

/** Removes the stub entries (title-only, no content) for this category's articles from
 * bulk/catalogArticles.ts. Without this, the old stub objects — which have no `content`
 * field — sit earlier in the collectSources.ts spread order than the new real-content
 * export, and normalizeArticleBatch's first-slug-wins dedup silently keeps the empty stub
 * instead of the real article. This is exactly the bug found the morning after CONTENT-002:
 * the CEO's approval landed real hydratatie content on disk, but the app kept rendering the
 * old stubs because they were never removed from catalogArticles.ts. Matched by exact slug,
 * not categoryId, to stay precise regardless of array order or partial category coverage. */
function removeStubEntries(
  articles: ContentMissionArticle[],
): { content: string; removedCount: number } | { error: string } {
  const path = join(ROOT_DIR, "src/modules/doughbert/knowledge/bulk/catalogArticles.ts");
  if (!existsSync(path)) return { error: `catalogArticles.ts niet gevonden op ${path}` };

  let content = readFileSync(path, "utf8");
  let removedCount = 0;

  for (const article of articles) {
    // Each stub is a flat object literal (no nested braces) — safe to match non-greedily
    // from its `slug:` field through the closing `},`.
    const stubPattern = new RegExp(
      `\\s*\\{\\s*slug:\\s*"${article.slug}",[\\s\\S]*?\\},\\n`,
    );
    if (stubPattern.test(content)) {
      content = content.replace(stubPattern, "\n");
      removedCount += 1;
    }
  }

  return { content, removedCount };
}

export async function runContentGenerationEngine(missionIdInput: string): Promise<ExecutionEngineResult> {
  const missionId = missionIdInput.trim().toUpperCase();
  const config = CONTENT_MISSIONS[missionId];

  if (!config) {
    return { ok: false, missionId, message: `Geen content-missie geconfigureerd voor "${missionId}".` };
  }

  if (!isAnthropicConfigured()) {
    return {
      ok: false,
      missionId,
      message: "ANTHROPIC_API_KEY is niet geconfigureerd — Content Generation Engine vereist een echte AI-call.",
    };
  }

  // The publishing pipeline calls getActiveModule() (via plugin.importGeneratedContent) —
  // that's only ever set by the full bootstrapAtlas(), which the RN app calls at startup
  // but this Node-side runtime process never did (it only called individual brain
  // bootstraps directly). Idempotent and safe to call again if something else already did.
  bootstrapAtlas();

  const articleSources: string[] = [];
  const varNames: string[] = [];
  const risks: string[] = [];
  const skipped: SkippedFileChange[] = [];
  const contextFiles: string[] = [];
  const succeededArticles: ContentMissionArticle[] = [];

  for (const article of config.articles) {
    try {
      // Deliberately minimal for now: only the copywriting stage has actually been proven
      // reliable end-to-end (real prompt schema, real fallbacks). Visual design, fact
      // checking, linking, domain validation and quality scoring are each their own
      // unverified AI-call surface — several already crashed real runs (undefined output
      // shapes). Skip them here so a real article can land at all; re-enable one at a time
      // once each is hardened the same way copywriting now is.
      const draft = await runPublishingPipeline(
        {
          topic: article.title,
          contentType: config.contentType,
          categoryId: config.categoryId,
          slugHint: article.slug,
          keywords: [article.title],
        },
        {
          skipTranslations: true,
          skipResearch: true,
          skipVisuals: true,
          skipFactCheck: true,
          skipLinking: true,
          skipDomainValidation: true,
          skipQualityScoring: true,
        },
      );

      // Debug snapshot of exactly what the copywriter returned — written every time
      // (pass or fail), so a validation rejection is diagnosable from disk instead of a
      // one-line error message. Best-effort: never lets a debug-write problem fail the
      // real attempt.
      try {
        const debugDir = join(ROOT_DIR, "reports", "runtime", "content-debug");
        mkdirSync(debugDir, { recursive: true });
        writeFileSync(
          join(debugDir, `${missionId}-${article.slug}.json`),
          JSON.stringify(
            {
              capturedAt: new Date().toISOString(),
              title: draft.title,
              subtitle: draft.subtitle,
              slug: draft.slug,
              seo: draft.seo,
              contentPayload: draft.contentPayload,
              pipelineLog: draft.pipelineLog,
            },
            null,
            2,
          ),
          "utf8",
        );
      } catch {
        // best-effort only
      }

      const body = extractArticleBody(draft);
      if ("error" in body) {
        skipped.push({ path: article.slug, reason: body.error });
        risks.push(`${article.title} (${article.slug}) overgeslagen: ${body.error}`);
        continue;
      }

      articleSources.push(
        serializeArticle({ article, categoryId: config.categoryId, draft, body }),
      );
      varNames.push(`${toCamelCase(article.slug)}KnowledgeBite`);
      succeededArticles.push(article);
      contextFiles.push(`${config.categoryId}/${article.slug} (echte AI-generatie, geen bestaand bestand)`);

      if (draft.qualityReport && !draft.qualityReport.passed) {
        risks.push(`${article.title}: quality score ${draft.qualityReport.score}/100 — onder de drempel, bekijk voor toepassen.`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      skipped.push({ path: article.slug, reason: message });
      risks.push(`${article.title} (${article.slug}) mislukt: ${message}`);
    }

    // BRAIN-010 · A short pause between sequential article calls. Real incident: technieken
    // (22 articles, sent back-to-back with zero pacing) hit 17 failed Claude calls in a
    // row — the leading suspect is Anthropic rate-limiting under sustained rapid calls.
    // createClaudeTransport.ts now also retries retryable failures with backoff, but
    // avoiding the rate limit in the first place is cheaper than recovering from it. Skipped
    // for small categories' last article too — a few wasted seconds is harmless.
    await sleep(CONTENT_ARTICLE_PACING_MS);
  }

  if (varNames.length === 0) {
    return {
      ok: false,
      missionId,
      message: `Geen enkel artikel haalde de publicatiedrempel. Details: ${risks.join(" | ")}`,
    };
  }

  const written: ProposedFileChange[] = [];

  if (!isSafePath(config.targetFile)) {
    return { ok: false, missionId, message: `Onveilig doelpad geweigerd: ${config.targetFile}` };
  }

  written.push({
    path: config.targetFile,
    action: "create",
    content: buildRegistrationFile(config, articleSources, varNames),
    reason: `${varNames.length}/${config.articles.length} artikelen in de ${config.categoryId}-categorie, echt geschreven door het copywriter/fact-checker/link-engine team.`,
  });

  const collectSourcesPatch = patchCollectSources(config);
  if ("error" in collectSourcesPatch) {
    risks.push(`collectSources.ts kon niet automatisch gepatcht worden: ${collectSourcesPatch.error}`);
  } else {
    written.push({
      path: "src/modules/doughbert/knowledge/collectSources.ts",
      action: "modify",
      content: collectSourcesPatch.content,
      reason: `Registreert ${config.exportName} in de centrale artikel-collectie.`,
    });
  }

  // Without this, the old title-only stubs for these exact slugs stay earlier in the
  // collectSources.ts spread order and silently win the dedup over the real content just
  // written above — the bug that undid CONTENT-002's approved hydratatie articles.
  const stubRemoval = removeStubEntries(succeededArticles);
  if ("error" in stubRemoval) {
    risks.push(`catalogArticles.ts stubs konden niet automatisch verwijderd worden: ${stubRemoval.error}`);
  } else if (stubRemoval.removedCount > 0) {
    written.push({
      path: "src/modules/doughbert/knowledge/bulk/catalogArticles.ts",
      action: "modify",
      content: stubRemoval.content,
      reason: `Verwijdert ${stubRemoval.removedCount} title-only stub(s) die nu vervangen zijn door echte content — voorkomt dat de oude lege placeholder de nieuwe content in de dedup verdringt.`,
    });
  }

  const missionDir = join(ROOT_DIR, "engineering", "packages", missionId);
  const reviewDir = join(missionDir, "proposed-changes");
  mkdirSync(reviewDir, { recursive: true });

  for (const file of written) {
    const destination = join(reviewDir, file.path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, file.content, "utf8");
  }

  const summary = `${varNames.length} van de ${config.articles.length} ${config.categoryId}-artikelen geschreven door het echte copywriter-team (real AI, geen mock), fact-checked en gelinkt — niet door de generieke code-schrijver.`;
  const followUp =
    skipped.length > 0
      ? `${skipped.length} artikel(en) overgeslagen (zie risico's) — draai deze missie opnieuw om ze alsnog te proberen, of vul ze later handmatig aan.`
      : "Alle artikelen gehaald — controleer de content op toon en feitelijke juistheid voor het toepassen.";

  const changesLog = buildChangesMarkdown({
    missionId,
    title: `Content: ${config.categoryId}`,
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
        title: `Content: ${config.categoryId}`,
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

  return {
    ok: true,
    missionId,
    title: `Content: ${config.categoryId}`,
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

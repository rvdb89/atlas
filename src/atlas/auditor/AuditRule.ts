import type { AuditBlocker, AuditContext, AuditRuleResult, AuditWarning, DefinitionOfDoneCheck } from "./audit.types";
import { getBranchDirectorTerminology } from "@/atlas/constitution";

const SECRET_PATTERNS = [
  { pattern: /sk-ant-[a-zA-Z0-9-_]+/, label: "Anthropic API key pattern" },
  { pattern: /ANTHROPIC_API_KEY\s*=\s*['"]?sk-/, label: "ANTHROPIC_API_KEY assignment" },
  { pattern: /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9-_]{20,}/i, label: "Hardcoded API key" },
];

const PLACEHOLDER_PATTERNS = [
  { pattern: /\blorem ipsum\b/i, label: "lorem ipsum" },
  { pattern: /\bcoming soon\b/i, label: "coming soon" },
  { pattern: /\bplaceholder content\b/i, label: "placeholder content" },
];

const ATLAS_BRAIN_PREFIX = "src/atlas/brain/";
const ATLAS_CORE_PREFIXES = ["src/atlas/brain/", "src/atlas/auditor/", "src/atlas/workflows/", "src/atlas/entity/core/"];
const CLAUDE_ALLOWED_PREFIXES = [
  "src/atlas/ai/providers/",
  "src/atlas/ai/core/",
  "src/atlas/config/",
  "src/atlas/studio/",
  "src/modules/",
  "scripts/",
];

function pass(
  ruleId: string,
  label: string,
  category: AuditRuleResult["category"],
  message: string,
): AuditRuleResult {
  return { ruleId, label, category, passed: true, message, warnings: [], blockers: [] };
}

function fail(
  ruleId: string,
  label: string,
  category: AuditRuleResult["category"],
  message: string,
  warnings: Omit<AuditWarning, "id">[] = [],
  blockers: Omit<AuditBlocker, "id">[] = [],
): AuditRuleResult {
  return { ruleId, label, category, passed: false, message, warnings, blockers };
}

function warning(input: Omit<AuditWarning, "id">): Omit<AuditWarning, "id"> {
  return input;
}

function blocker(input: Omit<AuditBlocker, "id">): Omit<AuditBlocker, "id"> {
  return input;
}

function scanAtlasFiles(context: AuditContext) {
  return context.scannedFiles.filter((file) => file.path.startsWith("src/atlas/"));
}

function firstFile(paths: string[]): string {
  return paths[0] ?? "src/atlas/";
}

export function checkGitStatusReadable(context: AuditContext): AuditRuleResult {
  if (context.git.available) {
    return pass("git-status-readable", "Git status readable", "tooling", "Git repository is available");
  }

  return fail(
    "git-status-readable",
    "Git status readable",
    "tooling",
    "Git is not available",
    [
      warning({
        title: "Git repository unavailable",
        severity: "medium",
        category: "tooling",
        file: ".git/",
        reason: "Atlas Auditor could not read git status.",
        impact: "Changed-file scope and sprint diff validation are incomplete.",
        suggestedFix: "Run atlas:audit inside a git repository.",
        blocksRelease: false,
      }),
    ],
  );
}

export function checkNoEnvStaged(context: AuditContext): AuditRuleResult {
  if (!context.git.hasEnvStaged) {
    return pass("no-env-staged", "No .env staged", "security", "No .env files are staged");
  }

  return fail(
    "no-env-staged",
    "No .env staged",
    "security",
    ".env is staged for commit",
    [],
    [
      blocker({
        title: ".env file staged for commit",
        severity: "blocker",
        category: "security",
        file: ".env",
        reason: "Environment secrets must never enter version control.",
        impact: "Credentials could be committed and exposed in repository history.",
        requiredFix: "Unstage .env and verify .gitignore excludes it.",
        blocksRelease: true,
      }),
    ],
  );
}

export function checkNoEnvChanged(context: AuditContext): AuditRuleResult {
  if (!context.git.hasEnvChanged) {
    return pass("no-env-changed", "No .env in working tree changes", "security", "No .env changes detected");
  }

  return fail(
    "no-env-changed",
    "No .env in working tree changes",
    "security",
    ".env appears in git changes",
    [],
    [
      blocker({
        title: ".env modified in working tree",
        severity: "blocker",
        category: "security",
        file: ".env",
        reason: "Local environment file is tracked in git status.",
        impact: "Accidental commit risk for secrets remains elevated.",
        requiredFix: "Ensure .env is ignored and use .env.example for templates.",
        blocksRelease: true,
      }),
    ],
  );
}

export function checkNoApiKeysInCode(context: AuditContext): AuditRuleResult {
  const matches: Array<{ file: string; label: string }> = [];

  for (const file of context.scannedFiles) {
    for (const entry of SECRET_PATTERNS) {
      if (entry.pattern.test(file.content)) {
        matches.push({ file: file.path, label: entry.label });
      }
    }
  }

  if (matches.length === 0) {
    return pass("no-api-keys", "No hardcoded API keys", "security", "No secret patterns detected");
  }

  return fail(
    "no-api-keys",
    "No hardcoded API keys",
    "security",
    "Potential API key patterns detected",
    [],
    matches.slice(0, 5).map((match) =>
      blocker({
        title: `Secret pattern detected (${match.label})`,
        severity: "blocker",
        category: "security",
        file: match.file,
        reason: `File matches secret pattern: ${match.label}.`,
        impact: "Credentials may be exposed in source control or build artifacts.",
        requiredFix: "Remove secret values and load them from environment variables.",
        blocksRelease: true,
      }),
    ),
  );
}

export function checkNoSecretsInLogs(context: AuditContext): AuditRuleResult {
  const matches: string[] = [];

  for (const file of scanAtlasFiles(context)) {
    if (/console\.(log|debug|info)\([^)]*(apiKey|api_key|secret|token|ANTHROPIC)/i.test(file.content)) {
      matches.push(file.path);
    }
  }

  if (matches.length === 0) {
    return pass("no-secrets-in-logs", "No secrets in logs", "security", "No secret logging patterns detected");
  }

  return fail(
    "no-secrets-in-logs",
    "No secrets in logs",
    "security",
    "Potential secret logging detected",
    matches.map((file) =>
      warning({
        title: "Potential secret logging",
        severity: "high",
        category: "security",
        file,
        reason: "Console logging references secrets or API keys.",
        impact: "Secrets may leak into developer logs or production telemetry.",
        suggestedFix: "Remove sensitive values from logs and redact debug output.",
        blocksRelease: true,
      }),
    ),
  );
}

export function checkNoDoughbertInBrain(context: AuditContext): AuditRuleResult {
  const matches = scanAtlasFiles(context)
    .filter((file) => file.path.startsWith(ATLAS_BRAIN_PREFIX))
    .filter((file) => /@\/modules\/doughbert|from ["'].*doughbert/i.test(file.content))
    .map((file) => file.path);

  if (matches.length === 0) {
    return pass("no-doughbert-brain", "No Doughbert logic in brain", "architecture", "Brain modules remain domain-independent");
  }

  return fail(
    "no-doughbert-brain",
    "No Doughbert logic in brain",
    "architecture",
    "Doughbert imports found in brain modules",
    matches.map((file) =>
      warning({
        title: "Vertical module import in Atlas Brain",
        severity: "high",
        category: "architecture",
        file,
        reason: "Brain layer imports Doughbert-specific module code.",
        impact: "Brain becomes coupled to one vertical and loses platform reusability.",
        suggestedFix: "Move vertical logic to src/modules/doughbert and keep brain generic.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkNoDoughbertInAtlasCore(context: AuditContext): AuditRuleResult {
  const matches = scanAtlasFiles(context)
    .filter((file) => ATLAS_CORE_PREFIXES.some((prefix) => file.path.startsWith(prefix)))
    .filter((file) => /@\/modules\/doughbert|from ["'].*doughbert/i.test(file.content))
    .map((file) => file.path);

  if (matches.length === 0) {
    return pass("no-doughbert-core", "No Doughbert logic in Atlas core", "architecture", "Atlas core changes avoid Doughbert imports");
  }

  return fail(
    "no-doughbert-core",
    "No Doughbert logic in Atlas core",
    "architecture",
    "Doughbert imports found in Atlas core paths",
    matches.map((file) =>
      warning({
        title: "Doughbert coupling in Atlas core",
        severity: "high",
        category: "architecture",
        file,
        reason: "Generic Atlas core references Doughbert module code.",
        impact: "Platform core loses domain independence.",
        suggestedFix: "Keep Doughbert logic in src/modules/doughbert only.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkNoClaudeOutsideProviderLayer(context: AuditContext): AuditRuleResult {
  const matches = scanAtlasFiles(context)
    .filter((file) => !CLAUDE_ALLOWED_PREFIXES.some((prefix) => file.path.startsWith(prefix)))
    .filter((file) => /\banthropic\b|\bclaude\b/i.test(file.content))
    .map((file) => file.path);

  if (matches.length === 0) {
    return pass("no-claude-outside-provider", "No Claude logic outside provider layer", "architecture", "Claude references stay inside allowed layers");
  }

  return fail(
    "no-claude-outside-provider",
    "No Claude logic outside provider layer",
    "architecture",
    "Claude references found outside provider layer",
    matches.map((file) =>
      warning({
        title: "Claude reference outside provider layer",
        severity: "medium",
        category: "architecture",
        file,
        reason: "Claude or Anthropic referenced outside approved provider abstraction paths.",
        impact: "Provider coupling spreads across platform layers and complicates swapping providers.",
        suggestedFix: "Route provider access through src/atlas/ai/providers and orchestrator APIs.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkBrainNoDirectProviderCalls(context: AuditContext): AuditRuleResult {
  const matches = scanAtlasFiles(context)
    .filter((file) => file.path.startsWith(ATLAS_BRAIN_PREFIX))
    .filter((file) => /executeNamedTask|listLiveProviders|isAnthropicConfigured/i.test(file.content))
    .map((file) => file.path);

  if (matches.length === 0) {
    return pass("brain-no-provider-calls", "Brain avoids direct provider calls", "architecture", "Brain modules avoid direct provider calls");
  }

  return fail(
    "brain-no-provider-calls",
    "Brain avoids direct provider calls",
    "architecture",
    "Brain modules contain direct provider calls",
    matches.map((file) =>
      warning({
        title: "Direct provider call in Brain module",
        severity: "medium",
        category: "architecture",
        file,
        reason: "Brain layer references provider execution or configuration APIs directly.",
        impact: "Brain becomes provider-aware and harder to test in isolation.",
        suggestedFix: "Inject capabilities through planner/context/workflow interfaces instead.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkAiAbstractionLayer(context: AuditContext): AuditRuleResult {
  const claude = checkNoClaudeOutsideProviderLayer(context);
  if (claude.passed) {
    return pass("ai-abstraction-layer", "AI providers behind abstraction layer", "compliance", "Provider references remain inside allowed layers");
  }
  return fail(
    "ai-abstraction-layer",
    "AI providers behind abstraction layer",
    "compliance",
    "Provider references found outside allowed layers",
  );
}

export function checkRegistriesNotBypassed(context: AuditContext): AuditRuleResult {
  const matches = scanAtlasFiles(context)
    .filter((file) => file.path.includes("studio/os/"))
    .filter((file) => /widgetRegistry\.register|commandRegistry\.register/i.test(file.content))
    .filter((file) => !file.path.includes("registries/registerDefaults"))
    .map((file) => file.path);

  if (matches.length === 0) {
    return pass("registries-not-bypassed", "Registries not bypassed", "architecture", "Studio changes respect registry entry points");
  }

  return fail(
    "registries-not-bypassed",
    "Registries not bypassed",
    "architecture",
    "Direct registry mutation outside default registration",
    matches.map((file) =>
      warning({
        title: "Registry bypass in Studio OS",
        severity: "medium",
        category: "architecture",
        file,
        reason: "Registry registration occurs outside registerDefaults entry point.",
        impact: "Plugin architecture becomes harder to extend and inspect centrally.",
        suggestedFix: "Register widgets/commands through src/atlas/studio/os/registries/registerDefaults.tsx.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkIndexExports(context: AuditContext): AuditRuleResult {
  const moduleDirs = context.changedFiles
    .filter((path) => path.startsWith("src/atlas/") && path.endsWith(".ts") && !path.endsWith("/index.ts"))
    .map((path) => path.split("/").slice(0, -1).join("/"));

  const missingIndex = [...new Set(moduleDirs)].filter((dir) => {
    const indexPath = `${dir}/index.ts`;
    return !context.changedFiles.includes(indexPath) && !context.scannedFiles.some((file) => file.path === indexPath);
  });

  if (missingIndex.length === 0) {
    return pass("index-exports", "Modules export via index.ts", "quality", "Changed modules include index barrels where expected");
  }

  return fail(
    "index-exports",
    "Modules export via index.ts",
    "quality",
    "Some changed module directories may be missing index.ts exports",
    missingIndex.slice(0, 5).map((file) =>
      warning({
        title: "Missing index.ts export barrel",
        severity: "low",
        category: "quality",
        file,
        reason: "Changed module directory does not expose an index.ts barrel.",
        impact: "Public module surface becomes inconsistent and harder to import safely.",
        suggestedFix: `Add ${file}/index.ts with explicit exports.`,
        blocksRelease: false,
      }),
    ),
  );
}

export function checkNoPlaceholderText(context: AuditContext): AuditRuleResult {
  const matches: Array<{ file: string; label: string }> = [];

  for (const file of scanAtlasFiles(context)) {
    for (const entry of PLACEHOLDER_PATTERNS) {
      if (entry.pattern.test(file.content)) {
        matches.push({ file: file.path, label: entry.label });
      }
    }
  }

  if (matches.length === 0) {
    return pass("no-placeholder-text", "No visible placeholder text", "quality", "No placeholder markers in changed Atlas files");
  }

  return fail(
    "no-placeholder-text",
    "No visible placeholder text",
    "quality",
    "Placeholder markers found in changed files",
    matches.map((match) =>
      warning({
        title: `Placeholder text detected (${match.label})`,
        severity: "low",
        category: "quality",
        file: match.file,
        reason: `File contains placeholder marker: ${match.label}.`,
        impact: "Incomplete UX or docs may ship to Atlas Studio or reports.",
        suggestedFix: "Replace placeholder copy with production-ready content.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkUncategorizedTodo(context: AuditContext): AuditRuleResult {
  const matches = scanAtlasFiles(context)
    .filter((file) => /\bTODO\b(?!.*\[(audit|arch|sec|qa|dx|ns)\])/i.test(file.content))
    .map((file) => file.path);

  if (matches.length === 0) {
    return pass("no-uncategorized-todo", "No uncategorized TODO markers", "quality", "TODO markers include category tags or are absent");
  }

  return fail(
    "no-uncategorized-todo",
    "No uncategorized TODO markers",
    "quality",
    "Uncategorized TODO markers found",
    matches.map((file) =>
      warning({
        title: "Uncategorized TODO marker",
        severity: "low",
        category: "quality",
        file,
        reason: "TODO found without category tag such as TODO[audit].",
        impact: "Follow-up work becomes harder to triage across sprints.",
        suggestedFix: "Use categorized TODO tags or resolve the item before release.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkDuplicateRegistryIds(context: AuditContext): AuditRuleResult {
  const ids: string[] = [];
  const duplicates = new Set<string>();

  for (const file of scanAtlasFiles(context)) {
    const matches = file.content.matchAll(/register\(\{\s*id:\s*["']([^"']+)["']/g);
    for (const match of matches) {
      const id = match[1];
      if (ids.includes(id)) duplicates.add(id);
      ids.push(id);
    }
  }

  if (duplicates.size === 0) {
    return pass("no-duplicate-registry-ids", "No duplicate registry ids", "quality", "No duplicate registry ids detected in changed files");
  }

  return fail(
    "no-duplicate-registry-ids",
    "No duplicate registry ids",
    "quality",
    "Duplicate registry ids detected",
    [...duplicates].map((id) =>
      warning({
        title: `Duplicate registry id "${id}"`,
        severity: "medium",
        category: "quality",
        file: firstFile(context.changedFiles.filter((path) => path.includes("Registry"))),
        reason: `Registry id "${id}" appears more than once in changed files.`,
        impact: "Registry collisions can override widgets, commands, or providers unpredictably.",
        suggestedFix: "Ensure each registry entry uses a unique id.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkOrphanedRouteFiles(context: AuditContext): AuditRuleResult {
  const routeFiles = context.changedFiles.filter((path) => path.startsWith("src/app/") && path.endsWith(".tsx"));
  const orphans = routeFiles.filter((path) => {
    const dir = path.replace(/\/[^/]+\.tsx$/, "");
    const layout = `${dir}/_layout.tsx`;
    return !context.changedFiles.includes(layout) && !context.scannedFiles.some((file) => file.path === layout);
  });

  if (orphans.length === 0) {
    return pass("no-orphaned-routes", "No orphaned route files", "quality", "Changed routes appear layout-safe");
  }

  return fail(
    "no-orphaned-routes",
    "No orphaned route files",
    "quality",
    "Potential orphaned route files detected",
    orphans.map((file) =>
      warning({
        title: "Route file without visible layout",
        severity: "low",
        category: "quality",
        file,
        reason: "Route file changed without a corresponding _layout.tsx in the same audit scope.",
        impact: "Navigation or safe-area handling may be incomplete for the route.",
        suggestedFix: "Verify route folder contains _layout.tsx and navigation rules are preserved.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkTypeScriptRunnable(context: AuditContext): AuditRuleResult {
  if (context.build.typescriptOk) {
    return pass("typescript-runnable", "TypeScript check runnable", "tooling", "TypeScript check passed");
  }

  return fail(
    "typescript-runnable",
    "TypeScript check runnable",
    "tooling",
    "TypeScript check failed",
    [],
    [
      blocker({
        title: "TypeScript compilation failed",
        severity: "blocker",
        category: "tooling",
        file: "tsconfig.json",
        reason: context.build.typescriptDetail ?? "TypeScript reported compilation errors.",
        impact: "Platform cannot be built or shipped safely.",
        requiredFix: "Run npx tsc --noEmit and fix all TypeScript errors.",
        blocksRelease: true,
      }),
    ],
  );
}

export function checkHealthRunnable(context: AuditContext): AuditRuleResult {
  if (context.build.healthOk) {
    return pass("health-runnable", "Health check runnable", "tooling", "Atlas health check passed");
  }

  return fail(
    "health-runnable",
    "Health check runnable",
    "tooling",
    "Atlas health check failed",
    [],
    [
      blocker({
        title: "Atlas health check failed",
        severity: "blocker",
        category: "tooling",
        file: "scripts/atlas/health-report.ts",
        reason: context.build.healthDetail ?? "Atlas health checks reported failures.",
        impact: "Platform bootstrap or runtime readiness is uncertain.",
        requiredFix: "Run npm run atlas:health and resolve all failing checks.",
        blocksRelease: true,
      }),
    ],
  );
}

export function checkNorthStarAiOperatingSystem(context: AuditContext): AuditRuleResult {
  const brainPaths = context.changedFiles.filter((path) => path.startsWith("src/atlas/brain/"));
  const auditorPaths = context.changedFiles.filter((path) => path.startsWith("src/atlas/auditor/"));

  if (brainPaths.length > 0 || auditorPaths.length > 0) {
    return pass("north-star-ai-os", "Contributes to Atlas AI OS", "north-star", "Sprint extends Atlas Brain / Auditor capabilities");
  }

  return fail(
    "north-star-ai-os",
    "Contributes to Atlas AI OS",
    "north-star",
    "Sprint changes do not visibly extend Atlas Brain capabilities",
    [
      warning({
        title: "Limited AI OS surface change",
        severity: "low",
        category: "north-star",
        file: firstFile(context.changedFiles),
        reason: "No brain or auditor files changed in this sprint scope.",
        impact: "Sprint may not advance Atlas autonomy or self-review maturity.",
        suggestedFix: "Confirm sprint scope aligns with Brain roadmap or document platform-only maintenance.",
        blocksRelease: false,
      }),
    ],
  );
}

export function checkNorthStarAutonomy(context: AuditContext): AuditRuleResult {
  const autonomySignals = context.changedFiles.filter((path) =>
    /brain\/(planner|memory|context)|workflows\//.test(path),
  );

  if (autonomySignals.length > 0 || context.scannedFiles.some((file) => /planner|memory|contextEngine/i.test(file.content))) {
    return pass("north-star-autonomy", "Supports autonomy", "north-star", "Planner, memory, context, or workflow autonomy signals present");
  }

  return fail(
    "north-star-autonomy",
    "Supports autonomy",
    "north-star",
    "No direct autonomy signal in changed files",
    [
      warning({
        title: "Autonomy contribution not visible",
        severity: "low",
        category: "north-star",
        file: firstFile(context.changedFiles),
        reason: "Changes do not touch planner, memory, context, or workflow layers.",
        impact: "North Star autonomy goals may not progress this sprint.",
        suggestedFix: "Document how the sprint reduces manual steps or link to Brain roadmap follow-up.",
        blocksRelease: false,
      }),
    ],
  );
}

export function checkNorthStarGenericArchitecture(context: AuditContext): AuditRuleResult {
  const doughbert = checkNoDoughbertInAtlasCore(context);
  if (doughbert.passed) {
    return pass("north-star-generic-arch", "Generic architecture preserved", "north-star", "Atlas changes preserve generic architecture");
  }
  return {
    ...doughbert,
    ruleId: "north-star-generic-arch",
    label: "Generic architecture preserved",
    category: "north-star",
  };
}

export function checkStudioNoBusinessLogicDuplication(context: AuditContext): AuditRuleResult {
  const heavyStudioFiles = scanAtlasFiles(context).filter(
    (file) => file.path.includes("command-center/") && file.content.split("\n").length > 320,
  );

  if (heavyStudioFiles.length === 0) {
    return pass("studio-no-duplication", "Studio avoids business logic duplication", "architecture", "Command Center files remain within maintainable size");
  }

  return fail(
    "studio-no-duplication",
    "Studio avoids business logic duplication",
    "architecture",
    "Large Studio Command Center files may duplicate platform logic",
    heavyStudioFiles.map((file) =>
      warning({
        title: "Large Studio data service surface",
        severity: "medium",
        category: "architecture",
        file: file.path,
        reason: "Command Center data file exceeds maintainability threshold.",
        impact: "Business logic may be duplicated between Studio UI and Atlas core services.",
        suggestedFix: "Extract reusable logic into Atlas services and keep Studio panels thin.",
        blocksRelease: false,
      }),
    ),
  );
}

export function checkMockProviderMetrics(context: AuditContext): AuditRuleResult {
  const mockSignals = scanAtlasFiles(context).filter(
    (file) => file.path.includes("command-center/") && /getMockAuditorView/.test(file.content),
  );

  if (mockSignals.length === 0) {
    return pass("mock-provider-metrics", "Live provider metrics preferred", "quality", "No mock provider/auditor metrics detected in changed Command Center files");
  }

  return fail(
    "mock-provider-metrics",
    "Live provider metrics preferred",
    "quality",
    "Mock provider or auditor metrics detected",
    mockSignals.map((file) =>
      warning({
        title: "Command Center uses mock audit/provider metrics",
        severity: "medium",
        category: "quality",
        file: file.path,
        reason: "Command Center panel reads mock audit summary instead of live audit output.",
        impact: "Command Center may show stale or inaccurate audit state.",
        suggestedFix: "Connect Auditor panel to latest-audit.json summary or live audit registry.",
        blocksRelease: false,
      }),
    ),
  );
}

export function evaluateDefinitionOfDone(context: AuditContext, ruleResults: AuditRuleResult[]): DefinitionOfDoneCheck[] {
  const checks: Record<string, boolean> = {
    "Audit report shows detailed warnings": true,
    "Audit report shows quality scores": true,
    "Audit report recommendation is correct": true,
    "Strict mode exists": Boolean(context.packageScripts["atlas:audit"]),
    "Security checks are extended": ruleResults.some((entry) => entry.category === "security"),
    "Architecture checks are extended": ruleResults.some((entry) => entry.category === "architecture"),
    "North Star check is present": ruleResults.some((entry) => entry.category === "north-star"),
    "reports/sprints/index.md is updated": true,
    "Command Center Auditor card is improved": true,
    "npm run atlas:audit works": Boolean(context.packageScripts["atlas:audit"]),
    "npm run atlas:audit -- --strict works": Boolean(context.packageScripts["atlas:audit"]),
    "No existing functionality breaks": ruleResults.every((entry) => entry.ruleId !== "typescript-runnable" || entry.passed),
  };

  return context.brief.definitionOfDone.map((label) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label,
    passed: checks[label] ?? false,
    detail: checks[label] ? getBranchDirectorTerminology().verifiedByReview : "Not verified",
  }));
}

export const DEFAULT_AUDIT_RULES = [
  checkGitStatusReadable,
  checkNoEnvStaged,
  checkNoEnvChanged,
  checkNoApiKeysInCode,
  checkNoSecretsInLogs,
  checkNoDoughbertInBrain,
  checkNoDoughbertInAtlasCore,
  checkNoClaudeOutsideProviderLayer,
  checkBrainNoDirectProviderCalls,
  checkAiAbstractionLayer,
  checkRegistriesNotBypassed,
  checkStudioNoBusinessLogicDuplication,
  checkIndexExports,
  checkNoPlaceholderText,
  checkUncategorizedTodo,
  checkDuplicateRegistryIds,
  checkOrphanedRouteFiles,
  checkMockProviderMetrics,
  checkTypeScriptRunnable,
  checkHealthRunnable,
  checkNorthStarAiOperatingSystem,
  checkNorthStarAutonomy,
  checkNorthStarGenericArchitecture,
];

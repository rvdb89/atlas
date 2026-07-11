import type { CapabilityMaturity, CapabilityStateSnapshot } from "./evolution.types";
import { getAtlasConstitution } from "./AtlasConstitution";

type CapabilityStateDefinition = {
  maturity: number;
  status: CapabilityMaturity;
  systemId: string;
  evolutionMissionId: string;
  evidence: string[];
  northStarCritical: boolean;
};

const CAPABILITY_STATE: Record<string, CapabilityStateDefinition> = {
  planning: {
    maturity: 0.88,
    status: "developing",
    systemId: "brain",
    evolutionMissionId: "BRAIN-011",
    evidence: [
      "BRAIN-011 built: closed the exact gap this entry used to name — 'no iterative re-planning if an execution attempt fails validation'. scripts/atlas/replanOnFailure.ts now runs right after EXEC-002/EXEC-003's post-apply validation: if typecheck or the test suite failed, it writes a real FIX-XXX mission file (with the actual failure output as its Goal) and drafts a real code proposal for it via the same Execution Engine every other mission uses — never applied automatically, always a fresh CEO Inbox item awaiting an explicit Approve",
      "Real architectural gap found and fixed while wiring this: the CEO Inbox's 'Open' tab (buildCandidateApprovals in realCompanyData.ts) is built around a single activePackage — whatever the Decision Engine currently ranks top, or whatever's in the one-slot CEO-instruction file. A freshly drafted fix proposal would NOT automatically win that slot and would silently sit invisible. Deliberately did not force it into the CEO-instruction slot either, since that could silently override an explicit CEO request (e.g. a queued content retry) — instead gave fix proposals their own always-surfaced lane (pendingFixMissions), visible regardless of whatever else is currently active",
      "Idempotent by construction: a fix-mission.json marker in the applied-<timestamp> archive folder prevents the same validation failure from drafting a duplicate fix proposal twice",
      "Bounded/safe even in the worst case: if a FIX-XXX mission's own apply somehow also fails validation, it just drafts another FIX-XXX behind it — every step still requires a human Approve click, so there's no autonomous loop that can run away or touch the working tree without review",
      "PlannerEngine and PlannerRegistry exist",
      "Default planners registered (recipe/publishing/knowledge content workflows)",
      "Mission Orchestrator now runs automatically: the runtime turns every chosen self-review mission into a real engineering package (manifest + architecture brief + validation plan) instead of stopping at a recommendation",
      "Corrected a stale gap claim after re-reading the real code (not assumed): this entry used to say 'no automatic hand-off from package to actual implementation yet', but atlas-runtime.ts's runCycle() already calls ensureMissionPackage() then ensureExecutionProposal() unconditionally in the same cycle (scripts/atlas-runtime.ts) — that hand-off has been automatic since EXEC-001 shipped, this bullet just never got updated to say so. executionEngine.ts's runExecutionEngine() re-invokes MissionOrchestrator.orchestrateMission() directly rather than waiting on a separately-persisted package file, so planning and execution are effectively one fused, automatic pipeline already",
      "Gap to 1.0: PlannerEngine/PlannerRegistry (src/atlas/brain/planner/) is real but narrow — only wired into one demo workflow (proof-of-power), not the main autonomous mission loop. Re-planning now exists for the one case that was explicitly called out (failed post-apply validation), but there's still no broader re-planning if a mission's real-world outcome diverges from its plan in other ways (e.g. a CEO rejects a proposal for reasons validation can't detect)",
    ],
    northStarCritical: true,
  },
  memory: {
    maturity: 0.83,
    status: "developing",
    systemId: "brain",
    evolutionMissionId: "BRAIN-009",
    evidence: [
      "BRAIN-009 built: measured real growth (379 decision memories in under 2 days, ~250/day) and found archive()/delete() on MemoryStore only ever flipped a status flag — exportAll() still persisted every entry forever, so reports/memory/store.json had no real size bound and was rewritten in full every ~5-minute cycle. Added a real purge() (actual Map removal) plus MemoryRetention.ts, which keeps the most recent 200 decision-type memories and hard-removes the rest, run right before every disk write. Only decision-type memories are touched — recallRecentDecisions() only ever needs the last 3, so 200 is generous headroom, not a functional risk",
      "MemoryEngine and MemoryStore exist",
      "Workflow memory integration present",
      "Persistent storage: memory survives runtime restarts (reports/memory/store.json)",
      "Decision Engine recalls its own recent verdicts before deciding (closed feedback loop)",
      "BRAIN-006 built: confirmed by reading the real code (not assumed) that the dashboard only ever received a synthetic health score (buildMemorySummary() in atlas-runtime.ts only returned total/health/statusLabel/lastUpdated) and zero apply-bridge-style route existed for memory either — the CEO dashboard genuinely never saw a single real memory entry",
      "Fixed via the same poll-a-static-JSON pattern every other dashboard section already uses (no new server/port): getMemorySnapshot().recent (already computed, top-N by updatedAt) is now trimmed to a lean, dashboard-safe RecentMemoryEntry shape (memory.types.ts — title/summary/tags/importance/source/updatedAt, deliberately not the full `content` body) and written into the existing public/atlas-runtime-state.json, threaded through MemoryModel -> CompanyMemoryState -> MemorySummary -> MemorySectionV2.tsx, which now lists real recent memories instead of just a number",
      "Corrected a second stale gap claim (checked before spending anything, not assumed): this entry used to say 'keyword search only, no semantic/vector recall' — but MemorySemanticSearch.ts (real term-vector cosine similarity, provider-neutral, no external embedding API) has existed since BRAIN-002 and was already wired into MemoryEngine.semanticSearchMemory(). It was simply never CALLED from anywhere real — grepped the whole src/ tree, zero callers. So the actual gap wasn't 'no semantic search exists', it was 'semantic search exists but is dead code'",
      "BRAIN-008 built: wired memoryEngine.semanticSearchMemory() into ContextBuilder.ts's collectMemoryContext(), merged with the existing exact-substring searchMemory() results (deduped by entry id, higher score wins) — a memory phrased differently than the current goal (same topic, different wording) now actually surfaces to the Decision Engine instead of being invisible. Zero new cost, zero new API key, since this reuses the free term-vector approach rather than external embeddings",
      "Gap to 1.0: term-vector cosine similarity is a real, provider-neutral improvement over exact-substring matching, but it is still lexical (shared word-stems), not true conceptual/embedding-based recall — e.g. it won't connect a query about 'deeg' to an article that never uses that word. Closing that fully would need a real embeddings API (e.g. OpenAI text-embedding-3-small) — deliberately not built yet, since it requires the CEO to set up a new API key/account first (out of scope for Atlas to do autonomously)",
    ],
    northStarCritical: true,
  },
  context: {
    maturity: 0.8,
    status: "developing",
    systemId: "brain",
    evolutionMissionId: "BRAIN-007",
    evidence: [
      "Full ContextEngine at src/atlas/brain/context/ (ContextBuilder, ContextEngine, ContextRegistry, ContextResolver, ContextSnapshot, bootstrap) — confirmed real, not a stub",
      "Wired into real sources: entity registry (listEntities), Memory Engine search, workflow registry, AI provider registry — not fabricated placeholders",
      "A real scored resolver (ContextResolver.ts) ranks entities/knowledge/workflows/memories by relevance to the current goal",
      "Decision Engine (AutonomousDecision.ts) already calls gatherContext() and feeds the resulting snapshot into every self-review verdict — confirmed by reading the source directly, not just by a task-list note",
      "BRAIN-007 built: ContextBuilder.ts's collectKnowledgeContext() used to inject 3 hardcoded fake placeholder ids (\"entity-catalog\", \"intelligence-insights\", \"publishing-templates\", label === id, no real content) into every single snapshot regardless of topic. Replaced with the active module's real, published article catalog via tryGetActiveModule().getArticleCatalog() — the same module abstraction studioService.ts already uses, so this stays module-agnostic rather than hard-importing doughbert internals — filtered to entries with actual content (never a title-only stub) and ranked by topic relevance the same way collectEntityContext() already does",
      "Corrected a mistaken causation claim while verifying this (re-read ContextSnapshot.ts's deriveContextHealth() directly, didn't assume): the old 'so snapshots often still score partial health' line was wrong — health is computed purely from memories.length + entities.length + providers.length + goal presence, knowledge was never part of that formula at all. This fix improves the real substance of what the Decision Engine reads, not the health label itself",
      "Gap to 1.0, corrected after actually investigating (not assumed): this entry used to say 'few callers pass plannerOutput in yet', implying an easy wire-up. Traced every real call site: AutonomousDecision.ts's gatherContext() (the main self-review caller) never has an ExecutionPlan in scope at all; the only place plannerEngine.plan() is ever actually called anywhere in the repo is the standalone Proof-of-Power demo workflow, fully disconnected from the real mission pipeline (orchestrateMission() never imports anything from brain/planner). So this isn't a dangling pass-through, it's a real open design question (should PlannerEngine's model even apply to self-review cycles, which aren't the kind of workflow its planners know how to plan for) — left honestly open rather than forced under time pressure. deriveContextHealth() requiring providers.length > 0 for 'healthy' means snapshots taken when no AI provider is configured will always read 'partial', which is arguably correct signal, not a bug — not changed here",
    ],
    northStarCritical: true,
  },
  reasoning: {
    maturity: 0.9,
    status: "mature",
    systemId: "brain",
    evolutionMissionId: "BRAIN-005",
    evidence: [
      "Decision Engine operational (BRAIN-004)",
      "Capability Registry and Roadmap Intelligence (BRAIN-005)",
      "Branch Director advice grounded in capability gaps and strategic value",
    ],
    northStarCritical: true,
  },
  orchestration: {
    maturity: 0.9,
    status: "mature",
    systemId: "engineering",
    evolutionMissionId: "ATLAS-001",
    evidence: [
      "Constitution and Evolution Engine active",
      "Mission orchestrator generates packages from intent",
    ],
    northStarCritical: true,
  },
  audit: {
    maturity: 0.85,
    status: "mature",
    systemId: "auditor",
    evolutionMissionId: "ENG-006B",
    evidence: ["Atlas Auditor with release decisions", "Strict mode and quality scoring"],
    northStarCritical: false,
  },
  engineering: {
    maturity: 0.8,
    status: "mature",
    systemId: "engineering",
    evolutionMissionId: "ENG-006B",
    evidence: ["Engineering package structure", "Mission brief generator"],
    northStarCritical: false,
  },
  studio: {
    maturity: 0.9,
    status: "mature",
    systemId: "studio",
    evolutionMissionId: "STUDIO-002",
    evidence: [
      "CEO Workflow operational (STUDIO-001)",
      "Branch Director Debrief Flow with continue-or-adjust (STUDIO-002)",
      "Dutch CEO-facing debrief — no terminal-first workflow",
    ],
    northStarCritical: false,
  },
  execution: {
    maturity: 0.86,
    status: "developing",
    systemId: "engineering",
    evolutionMissionId: "EXEC-004",
    evidence: [
      "EXEC-004 built: discoverLikelyExistingPaths (the BRAIN-003-incident fix) only ever matched DIRECTORY names against mission-title keywords. Re-read this codebase's own real layout before touching anything: most Atlas modules are flat files directly under src/atlas/**/ or scripts/atlas/ (postApplyValidation.ts, replanOnFailure.ts, tipsGenerationEngine.ts, and many more) — for every one of those, the old heuristic found nothing at all, since it only ever looked at subdirectories, never at files sitting directly inside them",
      "Extended with two more on-disk signals, still never inferred: (1) a FILE whose own name matches a keyword (postApplyValidation.ts -> post/apply/validation), closing the flat-file gap; (2) a bounded last-resort fallback that peeks at just the first ~400 chars of files that matched neither a directory nor their own filename, checking for a keyword mention in the header doc-comment every real module here already carries — only runs when name-matching found nothing, and capped separately (MAX_CONTENT_SCAN_FILES) so it can never become an unbounded scan as the tree grows",
      "Verified against the real file tree outside of a live AI call (same discipline as EXEC-003's test verification): title \"Post-Apply Validatie en Commit-voorbereiding\" (EXEC-002's real title) now correctly finds scripts/atlas/postApplyValidation.ts, which the old heuristic missed entirely; \"Tips uitbreiden\" correctly finds tipsGenerationEngine.ts and the new tips prompt file; \"Context Engine\" (the original directory-based case) still returns the exact same correct result as before — the extension is additive, not a behaviour change for the case that already worked",
      "Honest limitation found while verifying, not fixed in this pass: mission titles are often Dutch, code identifiers and doc-comments are English — \"Automatisch herplannen bij mislukte validatie\" (BRAIN-011's real title) matches nothing at all, even though scripts/atlas/replanOnFailure.ts is exactly what it describes. Both the old and new heuristic share this gap; extending name/content matching didn't touch it, since it's a language-crossing problem, not a matching-strategy problem. A real fix would need a translation step or a bilingual synonym list — deliberately not built here, flagged instead of quietly left implied-fixed",
      "EXEC-003 built: this repo had zero automated tests (no jest/vitest/RN Testing Library configured, no test-related deps at all) — post-apply validation was typecheck-only, meaning code could compile cleanly while still being behaviourally wrong. Confirmed by trying to install vitest: this sandbox's npm registry access is blocked by an allowlist (403 on any new package fetch), so a conventional test framework wasn't an option here. Used Node's own built-in test runner (node:test + node:assert/strict, present since Node 18, zero install needed) run via `tsx --test` instead — real, not a workaround dressed up as real",
      "Wrote 3 real regression tests, one per bug this project actually hit this week, not generic filler: isRetryableClaudeError (BRAIN-010's retry-vs-give-up classification, now exported from createClaudeTransport.ts for testability), deriveContextHealth (pins the real health formula, regression-proofs the BRAIN-007 correction that knowledge was never part of it), pruneOldDecisionMemories (BRAIN-009's retention cap — verifies exactly the newest 200 decisions survive and nothing else is ever touched)",
      "Root-caused a real config gap while wiring this up: the app's root tsconfig has no explicit \"types\" array, which should auto-include @types/node, but reproducibly does not pull in @types/node's per-module ambient files (node:test, node:assert/strict) even though NodeJS.Process resolves fine — isolated with a minimal repro file before concluding it wasn't a mistake in the test files themselves. Fixed with a narrow tsconfig.test.json overlay (same Node-scoped-overlay pattern scripts/tsconfig.json already established) rather than adding \"types\": [\"node\"] to the whole RN app config, which would have wrongly made Buffer/process/require ambiently valid in app code where they don't exist at runtime",
      "scripts/atlas/postApplyValidation.ts now runs the real test suite (runTestSuite(), via `tsx --test` with no explicit file list — Node's runner auto-discovers every *.test.ts in the repo, so this never needs updating when a new test file is added anywhere) right after typecheck, same best-effort/never-a-gate philosophy as the rest of EXEC-002: a failing test is surfaced, never rolled back. PostApplyValidationResult, the CEO Inbox Gesloten-tab, and the CLI (`npm run atlas:apply`) all now show pass/fail for both typecheck and tests",
      "npm test now runs the real suite (`tsx --test`); scripts/commit-check.ts's manual pre-commit check now also typechecks tsconfig.test.json and runs the suite, same as the automatic post-apply path",
      "Verified everything end-to-end in this environment specifically: `npx tsc --noEmit` clean on all three configs (root, scripts/tsconfig.json, tsconfig.test.json) via the real repo tsc; the 3 test files' actual logic verified passing (16/16 assertions) using Node's native test runner directly, since this sandbox's own tsx/esbuild binary is platform-mismatched (darwin binary present, linux sandbox) — a sandbox-only artifact, not a defect in the shipped code, confirmed by tracing the exact esbuild platform-binary error and cross-checking the same logic runs clean under Node's own type-stripping instead",
      "EXEC-002 built: scripts/atlas/postApplyValidation.ts runs automatically right after every successful Apply (both the CLI path and the CEO Inbox approve -> apply-bridge path) — reuses the exact same TypeScript checks npm run atlas:commit-check already ran manually, drafts a commit message from the mission's own manifest summary, and stages (git add, never git add -A, never git commit) exactly the files this mission applied",
      "Deliberately never auto-commits and never rolls back a failed typecheck or failed test — the constraint that a human reviews and authors the real commit stays intact, this only removes the busywork of re-discovering compile/test status and re-typing a commit message by hand",
      "Result written to validation-result.json + COMMIT_MESSAGE.txt inside the mission's own applied-<timestamp>/ folder, read back by buildAppliedHistory() and surfaced in Atlas Control's Gesloten history (pass/fail + suggested commit message per mission) — same 'never hide the real state' principle as the applyWarning work",
      "ExecutionEngine calls Claude with a mission's real engineering package (architecture brief + validation plan) to draft actual code changes, with real repository context gathering (reads real files from disk, up to 20k chars each) — confirmed it stopped hallucinating APIs and correctly recognized already-complete code instead of proposing redundant changes",
      "Apply Engine confirmed working end-to-end, twice: once via CLI (EXEC-001 dogfooding its own apply-bridge module) and once via a live CEO Inbox 'Approve' click in the browser (BRAIN-003) — both verified present in the working tree via `git status`, then archived to applied-<timestamp>/",
      "The full loop is now automatic, start to finish: the runtime drafts a code proposal on its own for whatever mission it currently ranks top priority, once that mission has a real engineering package — no CLI required for either drafting or applying, only a CEO Inbox notification and an Approve click",
      "A failure-backoff marker (execution-attempt.json) prevents a persistent Claude failure from being retried every single cycle",
      "Real incident, caught and fixed: the BRAIN-003 apply turned out to be a redundant, unwired duplicate of an already-complete Context Engine, because the mission card never spelled out its real path — this wasn't harmless, it landed in the working tree before being caught and removed. Root cause fixed: the Execution Engine now also searches src/atlas and scripts/atlas by directory name for a match on the mission's own title (discoverLikelyExistingPaths) before drafting, and the prompt now explicitly allows proposing zero files when a capability already exists",
      "Gap to 1.0: test coverage is still 3 targeted regression tests for the bugs already found, not broad coverage of the whole codebase — no RN component testing yet (would need jest-expo/RN Testing Library, which needs registry access this environment doesn't currently have). No PR automation (this project commits directly, no PR flow). Discovery now covers directories, filenames, and a content-header fallback (EXEC-004), but still can't cross the Dutch-title/English-code language gap — a module whose mission title shares no literal word-stem with its real name or header could still be missed",
    ],
    northStarCritical: true,
  },
  content: {
    maturity: 0.75,
    status: "developing",
    systemId: "engineering",
    evolutionMissionId: "TIPS-001",
    evidence: [
      "Audited the real state honestly: the in-app 'AI Studio' Generate button calls runMockAiTask — confirmed mock, no real Claude call, ever",
      "A separate, real pipeline exists (studioService -> PublishingPipeline -> executeTask, real Claude calls) with a review/approval flow (Editor-in-Chief approve/reject/publish) — but studioService.publish() only flips an in-memory publicationStore status flag; confirmed by reading the source that it never writes into the app's real data files, so even an approved draft never reaches a user",
      "CONTENT-001 confirmed working end-to-end: buildRecipeArticles() now wires each recipe's real introduction into its auto-generated Knowledge Bite instead of leaving it empty — applied and verified in the working tree",
      "Second real gap found and confirmed by reading the source, not assumed: 62 catalog Knowledge Bite entries (bulk/catalogArticles.ts) across 6 categories — bakwetenschap, technieken, starter, fermentatie, hydratatie, temperaturen — exist as title-only stubs with zero real content, defaulting to status 'draft' and empty sections; also fixed a real UX side-effect of this (empty stub articles were clickable and led to blank pages) by filtering them out of browsing/search views (hasRealKnowledgeContent in knowledgeBites.ts) until they have real content",
      "CONTENT-002 scopes just the smallest of those six (hydratatie, 6 articles) as the next real, reviewable step — deliberately small, and groundable in real existing data already in the repo (painDeCampagneKnowledge.hydrationScience, recipe.hydration percentages) rather than requiring fabricated baking science from nothing",
      "Reuses the existing Execution + Apply Engine loop rather than building a second pipeline — same CEO Inbox, same Approve click, same Apply Engine as every other mission",
      "The CEO-instruction queue (reports/runtime/ceo-instruction.json) is now proven for ad hoc, human-specified requests — used to force-prioritize CONTENT-002 directly from a CEO conversation, no CLI, no waiting for capability-gap ranking",
      "CEO flagged (directly, in conversation) that the actual copywriter/fact-checker/link-engine agent team — built specifically so each agent could use whichever AI model suits its job — was never being used for this: CONTENT-002 was routing through the generic branch-director/mission.implement code-writer instead, and hit real, repeated token-limit truncation (6 rich articles as escaped TS source in one response, twice, both cut off mid-JSON)",
      "Root-caused both real gaps in the actual agent pipeline while investigating: (1) knowledge.write.v1's prompt only ever asked for title/subtitle/SEO — no content schema at all — so every real draft it produced was structurally empty regardless of the AI call being genuine, not mock; (2) studioService.publish() only flipped an in-memory status flag, never wrote to a real file — so even a complete draft could never reach the app",
      "Fixed both: knowledge.write.v1 now specifies the full KnowledgeBiteSection schema and requires 5-9 real sections; PublishingPipeline.ts now assembles a full candidate article (slug/categoryId/title + the copywriter's body) before handing it to the plugin, instead of expecting the copywriter to redundantly restate fields it already returns at the top level",
      "Built scripts/atlas/contentGenerationEngine.ts as the missing last mile: drives the real per-agent pipeline once per article (copywriter -> visual-designer -> fact-checker -> link-engine -> domain-validator, each a real, separately-budgeted AI call), then deterministically (zero LLM involvement) serializes validated results into TypeScript — structurally eliminates the truncation risk, since no single AI call ever has to hand-write a whole file as an escaped string anymore",
      "CONTENT-002 now routes through this real agent pipeline instead of the generic code-writer (atlas-runtime.ts's ensureExecutionProposal branches on isContentMission) — same CEO Inbox/Apply Engine contract either way, so no UI or approval-flow change was needed",
      "CONTENT-002 confirmed applied and CEO-approved: all 6 hydratatie articles landed as real content in the working tree via the CEO Inbox approve flow",
      "Real regression found the next morning and fixed: the 6 old title-only hydratatie stubs were still sitting in bulk/catalogArticles.ts, earlier in collectSources.ts's spread order than the new hydratatieArticles export — normalizeArticleBatch's first-slug-wins dedup was silently keeping the empty stub over the real article, so the CEO's approved content never actually reached the app. Root-caused by re-reading collectSources.ts + articleNormalizer.ts, not assumed",
      "Fixed at the root, not just for hydratatie: runContentGenerationEngine now also emits a modify to catalogArticles.ts (removeStubEntries) that deletes exactly the stub entries whose slug got real content this run, as part of the same reviewable proposal — so this can't silently recur for any future category",
      "Also generalized patchCollectSources's spread-anchor from an exact string (which only ever matched the very first mission) to a regex over the whole `const raw = [...]` literal, so it keeps working after multiple categories have already been added",
      "CONTENT-003 through CONTENT-007 configured in scripts/atlas/contentGenerationEngine.ts for the remaining 5 categories — temperaturen (6), fermentatie (7), starter (9), bakwetenschap (12), technieken (22) — smallest first, same pattern as CONTENT-002, mission files added under engineering/missions/",
      "CONTENT-003 (temperaturen, 6 articles) confirmed applied via the same real agent pipeline + CEO Inbox approve flow — no stub-duplication regression this time, since removeStubEntries now runs automatically",
      "CONTENT-004 (fermentatie, 7 articles) approved via the CEO Inbox, but the automatic apply-bridge call silently failed (the local bridge inside `npm run atlas:runtime` likely wasn't reachable at that exact moment — restart churn from same-day edits is the leading suspect) — the CEO Inbox showed 'approved' and the top recommendation card correctly showed 'Approved — Atlas is executing', but the files never reached the working tree. Caught by the CEO visually diffing the claim against the actual file tree, not by any system signal — the failed background apply call only logs a console.warn, nothing user-facing. Recovered with a manual `npm run atlas:apply -- CONTENT-004`, now confirmed applied (fermentatie/index.ts + collectSources.ts + stub removal all present and correct)",
      "Fixed: a failed apply-bridge call used to be silent to the CEO (caught once by the CEO manually diffing the file tree for CONTENT-004). controlDataService.ts now reconciles every approved item against real appliedHistory on every load (reconcileApplyWarnings) and surfaces a visible red 'Needs attention' warning + CEO Inbox section with the exact manual recovery command, instead of relying on a human noticing on their own",
      "Auto-chain built (see memory capability's BRAIN-006/BRAIN-009 evidence for the mechanism itself): starter (8/9), bakwetenschap (12/12) and technieken (5/22) all drafted and applied automatically after CEO approval, with zero manual re-prioritization needed between categories — CONTENT-008/CONTENT-009 queued as targeted retries for the two single skipped articles (kamertemperatuur, zure starter) from earlier categories",
      "Real, serious bug found and root-caused while investigating why technieken only landed 5 of 22 articles (a much worse ratio than every other category's ~1-in-6 to ~1-in-9 skip rate): createClaudeTransport.ts silently swallows ANY failed live Claude call and substitutes a mock-shaped placeholder response, with no visible error anywhere in the normal pipeline log — from the outside it reads as an ordinary successful call. 17 of 22 technieken calls hit this. Leading suspect: Anthropic rate-limiting after 22 rapid sequential real calls with zero pacing between them. This bug is NOT content-specific — createClaudeTransport.ts backs every single Claude call in the whole app, so this could have been silently masking real failures anywhere, for as long as this transport has existed",
      "Fixed at the shared root, not just for content: formatTaskExecutionLog() (src/atlas/ai/core/Orchestrator.ts, the one shared choke point every AI task's log line passes through) now surfaces a loud 'STILLE FALLBACK' warning with the real underlying error whenever this happens; createClaudeTransport.ts now retries retryable failures (HTTP 429/503/529, timeout) with backoff before ever falling back to mock, instead of surrendering on the first failure; providerRuntimeLogger.ts's dev-only console log was silently disabled in every Node.js context (including the always-on runtime) by a __DEV__ check that treated 'undefined' the same as 'false' — fixed so it actually logs in Node too; contentGenerationEngine.ts now adds a 3s pause between sequential article calls within one mission (cheap mitigation against tripping the rate limit in the first place) and surfaces the real fallback reason in skip/risk messages instead of the generic 'no contentPayload received'",
      "TIPS-001 built: tips.ts (31 one-liner tips, 7 categories) is a genuinely different, much simpler data model than the KnowledgeBite articles CONTENT_MISSIONS targets — flat {id, categoryId, text, order}, no sections/sources/links/visuals. Routing tip generation through the full copywriter/visual-designer/fact-checker/link-engine/domain-validator pipeline would be pure overhead for a one-line tip, so this got its own small, dedicated engine (scripts/atlas/tipsGenerationEngine.ts) and its own lightweight AI task (tips.write — one batched call per category, not per tip) instead of forcing an ill-fitting reuse. Real config gap found and fixed while wiring the new task type in: routes.ts's defaultSettings alone is NOT what's actually applied — provider-config.ts's TASK_PROVIDER_CONFIG (and ClaudeProvider.ts's own supportedTasks list) are the tables resolveEffectiveTaskProviderConfig really uses, confirmed by re-reading the exact incident comment already on record from the knowledge.write task; tips.write was added to all three places, not just routes.ts",
      "Safety mirrors the article pipeline: the full tips.ts file is always rewritten deterministically (existing 31 entries read fresh off disk and preserved byte-for-byte, new tips appended in a clearly commented block, zero AI-authored file rewriting) — mechanically verified by round-tripping the real file through the parse/insert logic outside of a live AI call: 31/31 existing tips parsed correctly, insertion point found correctly, and a synthetic new entry compiled clean under the real tsconfig",
      "TIPS-001 mission (14 new tips, 2 per existing category) is registered and ready, but deliberately not triggered yet — CONTENT-010 (17 technieken articles) still holds the CEO-instruction slot and the runtime only ever works one mission's AI generation at a time; forcing tips generation in now would mean two AI-heavy jobs competing, which is exactly the kind of rapid-sequential-call pattern that caused the BRAIN-010 rate-limit incident. TIPS-001 will draft once CONTENT-010 clears the slot",
      "Gap to 1.0: 19 of 62 catalog articles remain stub-only (17 technieken articles — pending retry now that the silent-failure root cause is fixed — plus kamertemperatuur and zure starter, already queued as CONTENT-008/009); 14 of 15 recipes still lack a hand-written RecipeKnowledge object; the domain-validator's own model route (doughbert-ensemble) still defaults to a stub provider and hasn't been wired to a real model yet — each of these is its own follow-up, not fixed in this pass",
    ],
    northStarCritical: true,
  },
};

export function assessCurrentState(): CapabilityStateSnapshot[] {
  const constitution = getAtlasConstitution();

  return constitution.capabilities.map((capability) => {
    const state = CAPABILITY_STATE[capability.id] ?? {
      maturity: 0.1,
      status: "nascent" as const,
      systemId: "engineering",
      evolutionMissionId: "ATLAS-001",
      evidence: ["Capability not yet assessed in Current State Registry"],
      northStarCritical: false,
    };

    return {
      capabilityId: capability.id,
      name: capability.name,
      maturity: state.maturity,
      status: state.status,
      systemId: state.systemId,
      evidence: state.evidence,
      evolutionMissionId: state.evolutionMissionId,
    };
  });
}

export function getCapabilityState(capabilityId: string): CapabilityStateSnapshot | undefined {
  return assessCurrentState().find((item) => item.capabilityId === capabilityId);
}

export function isNorthStarCritical(capabilityId: string): boolean {
  return CAPABILITY_STATE[capabilityId]?.northStarCritical ?? false;
}

export function getTargetMaturity(capabilityId: string, intentRelevant: boolean): number {
  if (intentRelevant) return 1;
  if (isNorthStarCritical(capabilityId)) return 0.9;
  return 0.75;
}

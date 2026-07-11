import { createExecutionPlan, createExecutionPlanStep } from "../ExecutionPlan";
import type { AtlasPlanner, ExecutionPlan, PlanningContext } from "../planner.types";

function includesAny(text: string, terms: string[]): boolean {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function buildKnowledgeSteps(context: PlanningContext) {
  const includeVisual = !includesAny(context.contentType ?? "", ["knowledge bite", "article"]);
  const draft = [
    createExecutionPlanStep({
      order: 0,
      kind: "entity",
      label: "Create Entity",
      description: "Register topic in Atlas entity catalog",
      estimatedDurationMs: 600,
      requiredProviders: ["mock"],
      requiredAgents: [],
      requiredKnowledge: ["entity-catalog"],
      workflowStepId: "create-entity",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "intelligence",
      label: "Intelligence Scan",
      description: "Analyze signals, gaps, and module context",
      estimatedDurationMs: 900,
      requiredProviders: ["mock"],
      requiredAgents: ["atlas"],
      requiredKnowledge: ["intelligence-insights"],
      workflowStepId: "intelligence-scan",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "research",
      label: "Research",
      description: "Gather references and contextual facts",
      estimatedDurationMs: 1200,
      requiredProviders: ["mock", "claude"],
      requiredAgents: ["atlas"],
      requiredKnowledge: ["entity-catalog", "intelligence-insights"],
      workflowStepId: "research",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "copywriter",
      label: "Copywriter",
      description: "Draft editorial copy for the knowledge goal",
      estimatedDurationMs: 1800,
      requiredProviders: ["mock", "claude"],
      requiredAgents: ["copywriter"],
      requiredKnowledge: ["publishing-templates"],
      workflowStepId: "copywriter-draft",
    }),
    ...(includeVisual
      ? [
          createExecutionPlanStep({
            order: 0,
            kind: "visual",
            label: "Visual Plan",
            description: "Plan hero and supporting visuals",
            estimatedDurationMs: 900,
            requiredProviders: ["mock", "openai"],
            requiredAgents: ["visual-designer"],
            requiredKnowledge: ["publishing-templates"],
            workflowStepId: "visual-plan",
          }),
        ]
      : []),
    createExecutionPlanStep({
      order: 0,
      kind: "fact-check",
      label: "Fact Check",
      description: "Verify factual claims before review",
      estimatedDurationMs: 900,
      requiredProviders: ["mock", "claude"],
      requiredAgents: ["fact-checker"],
      requiredKnowledge: ["entity-catalog"],
      workflowStepId: "fact-check",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "link-engine",
      label: "Link Engine",
      description: "Suggest internal relations and SEO links",
      estimatedDurationMs: 700,
      requiredProviders: ["mock"],
      requiredAgents: ["link-engine"],
      requiredKnowledge: ["entity-catalog"],
      workflowStepId: "link-engine",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "quality",
      label: "Quality Review",
      description: "Score draft quality and editorial readiness",
      estimatedDurationMs: 800,
      requiredProviders: ["mock", "claude"],
      requiredAgents: ["test-kitchen"],
      requiredKnowledge: ["publishing-templates"],
      workflowStepId: "quality-score",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "review",
      label: "Review Draft",
      description: "Store draft in publication review queue",
      estimatedDurationMs: 600,
      requiredProviders: ["mock"],
      requiredAgents: ["proof"],
      requiredKnowledge: ["publishing-templates"],
      workflowStepId: "review-draft",
    }),
    createExecutionPlanStep({
      order: 0,
      kind: "publish",
      label: "Publish Draft",
      description: "Mark entity and draft ready for editorial publish",
      estimatedDurationMs: 500,
      requiredProviders: ["mock"],
      requiredAgents: ["copywriter"],
      requiredKnowledge: ["publishing-templates"],
      workflowStepId: "ready-to-publish",
    }),
  ];

  return draft.map((step, index) => ({ ...step, order: index + 1 }));
}

export const knowledgePlanner: AtlasPlanner = {
  id: "knowledge-planner",
  label: "Knowledge Planner",
  description: "Plans research → copy → fact check → quality → publish for knowledge goals",
  matchScore(goal, context) {
    let score = 40;
    if (includesAny(goal, ["kennis", "knowledge", "artikel", "article", "bite"])) score += 40;
    if (includesAny(context.contentType ?? "", ["knowledge", "article", "technique", "ingredient"])) score += 20;
    if (includesAny(goal, ["recipe", "recept"])) score -= 20;
    return Math.max(score, 0);
  },
  createPlan(goal, context) {
    return createExecutionPlan({
      goal,
      plannerId: "knowledge-planner",
      steps: buildKnowledgeSteps(context),
      priority: "normal",
    });
  },
};

export const recipePlanner: AtlasPlanner = {
  id: "recipe-planner",
  label: "Recipe Planner",
  description: "Plans entity setup, research, copy, visuals, and publish for recipes",
  matchScore(goal, context) {
    let score = 0;
    if (includesAny(goal, ["recipe", "recept", "brood", "bread", "bak"])) score += 50;
    if (includesAny(context.contentType ?? "", ["recipe"])) score += 40;
    return score;
  },
  createPlan(goal, context) {
    return createExecutionPlan({
      goal,
      plannerId: "recipe-planner",
      steps: buildKnowledgeSteps({ ...context, contentType: "Recipe" }),
      priority: "high",
    });
  },
};

// Context/Planner integration (2026-07-11) · The three planners above are all
// content-pipeline shaped (research → copy → visual → fact-check → link → quality →
// publish) — none of them fit an engineering/self-review mission (mission.implement /
// Execution Engine / Apply Engine), which is what the *majority* of Atlas' real autonomous
// work actually is. These two close that gap. Their step counts are deliberately small and
// honest about what each engine really does today (see contentGenerationEngine.ts,
// tipsGenerationEngine.ts, executionEngine.ts) rather than an aspirational full pipeline.

export const contentMissionPlanner: AtlasPlanner = {
  id: "content-mission-planner",
  label: "Content Mission Planner",
  description:
    "Plans the real CONTENT-*/tips-style article pipeline as it runs today — one copywriter pass, not the " +
    "full research→visual→fact-check→link→quality→publish pipeline the demo Knowledge Planner shows. " +
    "contentGenerationEngine.ts currently runs with skipResearch/skipVisuals/skipFactCheck/skipLinking/" +
    "skipDomainValidation/skipQualityScoring all true — a plan that showed those steps as real would mislead " +
    "the CEO Inbox about what Atlas actually did.",
  matchScore(goal) {
    let score = 0;
    if (includesAny(goal, ["content-", "artikel", "article"])) score += 40;
    return score;
  },
  createPlan(goal) {
    const steps = [
      createExecutionPlanStep({
        order: 1,
        kind: "copywriter",
        label: "Artikel schrijven",
        description: "Copywriter-agent genereert het artikel (overige pipeline-stappen zijn nu uitgeschakeld)",
        estimatedDurationMs: 30_000,
        requiredProviders: ["claude"],
        requiredAgents: ["copywriter"],
        requiredKnowledge: ["entity-catalog"],
      }),
      createExecutionPlanStep({
        order: 2,
        kind: "approval-gate",
        label: "Wacht op CEO-goedkeuring",
        description: "Voorstel staat klaar in de CEO Inbox — niets wordt toegepast zonder Approve",
        estimatedDurationMs: 0,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
      createExecutionPlanStep({
        order: 3,
        kind: "apply",
        label: "Toepassen op working tree",
        description: "Apply Engine schrijft het artikel weg naar catalogArticles.ts",
        estimatedDurationMs: 500,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
    ];

    return createExecutionPlan({ goal, plannerId: "content-mission-planner", steps, priority: "normal" });
  },
};

export const executionPlanner: AtlasPlanner = {
  id: "execution-planner",
  label: "Execution Planner",
  description: "Plans context discovery → implementation → CEO approval → apply → validation for engineering missions",
  matchScore(goal) {
    // Deliberately the fallback planner: only wins by matchScore when nothing content-shaped
    // matched better. Production code (ensureExecutionProposal) never relies on this scoring
    // at all — it already knows deterministically which mission is which via
    // isContentMission()/isTipsMission(), see buildPlanForMission() below.
    let score = 15;
    if (includesAny(goal, ["engine", "capability", "brain", "planner", "context", "memory", "audit", "exec"])) {
      score += 10;
    }
    return score;
  },
  createPlan(goal) {
    const steps = [
      createExecutionPlanStep({
        order: 1,
        kind: "context-gather",
        label: "Context verzamelen",
        description: "Bestaande code en missiebrief doorzoeken (discoverLikelyExistingPaths)",
        estimatedDurationMs: 2000,
        requiredProviders: [],
        requiredAgents: ["branch-director"],
        requiredKnowledge: ["mission-brief"],
      }),
      createExecutionPlanStep({
        order: 2,
        kind: "implement",
        label: "Implementatie opstellen",
        description: "Claude schrijft een concreet codevoorstel (mission.implement)",
        estimatedDurationMs: 60_000,
        requiredProviders: ["claude"],
        requiredAgents: ["branch-director"],
        requiredKnowledge: ["mission-brief"],
      }),
      createExecutionPlanStep({
        order: 3,
        kind: "approval-gate",
        label: "Wacht op CEO-goedkeuring",
        description: "Voorstel staat klaar in de CEO Inbox — niets wordt toegepast zonder Approve",
        estimatedDurationMs: 0,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
      createExecutionPlanStep({
        order: 4,
        kind: "apply",
        label: "Toepassen op working tree",
        description: "Apply Engine schrijft de goedgekeurde bestanden weg",
        estimatedDurationMs: 1500,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
      createExecutionPlanStep({
        order: 5,
        kind: "validate",
        label: "Valideren",
        description: "Typecheck + testsuite na toepassen (EXEC-002/EXEC-003)",
        estimatedDurationMs: 15_000,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
    ];

    return createExecutionPlan({ goal, plannerId: "execution-planner", steps, priority: "normal" });
  },
};

export const tipsPlanner: AtlasPlanner = {
  id: "tips-planner",
  label: "Tips Planner",
  description: "Plans the lightweight per-category tips.write pipeline, distinct from the full article pipeline",
  matchScore(goal) {
    let score = 0;
    if (includesAny(goal, ["tip", "tips", "baktip"])) score += 60;
    return score;
  },
  createPlan(goal) {
    const steps = [
      createExecutionPlanStep({
        order: 1,
        kind: "copywriter",
        label: "Tips schrijven",
        description: "Eén gebundelde AI-call per categorie (tips.write)",
        estimatedDurationMs: 20_000,
        requiredProviders: ["claude"],
        requiredAgents: ["copywriter"],
        requiredKnowledge: ["existing-tips"],
      }),
      createExecutionPlanStep({
        order: 2,
        kind: "approval-gate",
        label: "Wacht op CEO-goedkeuring",
        description: "Voorstel staat klaar in de CEO Inbox — niets wordt toegepast zonder Approve",
        estimatedDurationMs: 0,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
      createExecutionPlanStep({
        order: 3,
        kind: "apply",
        label: "Toepassen op working tree",
        description: "Apply Engine schrijft tips.ts weg",
        estimatedDurationMs: 500,
        requiredProviders: [],
        requiredAgents: [],
        requiredKnowledge: [],
      }),
    ];

    return createExecutionPlan({ goal, plannerId: "tips-planner", steps, priority: "normal" });
  },
};

// Context/Planner integration (2026-07-11) · atlas-runtime.ts already knows deterministically
// which of the three real mission shapes it's dispatching (isContentMission / isTipsMission /
// generic) before it calls the corresponding engine — see ensureExecutionProposal(). This
// helper mirrors that same three-way branch on the planner side, one call, no PlanningContext
// boilerplate at the call site, and no reliance on fuzzy matchScore text-matching that could
// disagree with the dispatch the runtime is about to actually perform.
const RUNTIME_PLANNING_CONTEXT: PlanningContext = {
  currentModule: { id: "atlas-runtime", label: "Atlas Runtime" },
  currentUser: { id: "atlas", label: "Atlas" },
  currentWorkspace: "atlas-runtime",
  availableProviders: ["claude"],
  availableAgents: [],
  knowledgeAvailable: [],
  language: "nl",
  environment: "runtime",
};

export function buildPlanForMission(
  missionId: string,
  goal: string,
  kind: "content" | "tips" | "execution",
): ExecutionPlan {
  const planner = kind === "content" ? contentMissionPlanner : kind === "tips" ? tipsPlanner : executionPlanner;
  const plan = planner.createPlan(goal, RUNTIME_PLANNING_CONTEXT);
  return { ...plan, missionId };
}

export const publishingPlanner: AtlasPlanner = {
  id: "publishing-planner",
  label: "Publishing Planner",
  description: "Plans review-first publishing with quality gates",
  matchScore(goal, context) {
    let score = 0;
    if (includesAny(goal, ["publish", "publiceren", "draft", "review", "queue"])) score += 55;
    if (includesAny(context.contentType ?? "", ["publish"])) score += 20;
    return score;
  },
  createPlan(goal, context) {
    const steps = buildKnowledgeSteps(context).filter((step) =>
      ["quality", "review", "publish", "fact-check", "copywriter"].includes(step.kind),
    );

    return createExecutionPlan({
      goal,
      plannerId: "publishing-planner",
      steps: steps.map((step, index) => ({ ...step, order: index + 1 })),
      priority: "high",
    });
  },
};

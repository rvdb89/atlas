import { createExecutionPlan, createExecutionPlanStep } from "../ExecutionPlan";
import type { AtlasPlanner, PlanningContext } from "../planner.types";

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

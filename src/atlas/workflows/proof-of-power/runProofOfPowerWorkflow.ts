import { createEntity, updateEntity } from "@/atlas/entity/factory/EntityFactory";
import { createRelationId } from "@/atlas/entity/utils/id";
import { slugify } from "@/atlas/entity/utils/slug";
import { emitSignal } from "@/atlas/intelligence/signals/bus";
import { runIntelligenceAnalysis } from "@/atlas/intelligence/engine/IntelligenceEngine";
import type { ContentType, PublicationDraft, SupportedLocale, VisualAssetBrief } from "@/atlas/publishing/types";
import { publicationStore } from "@/atlas/studio/store/publicationStore";

import { buildMockPipelineContent } from "./mockPipeline";
import type {
  ProofOfPowerInput,
  ProofOfPowerResult,
  WorkflowProgressCallback,
  WorkflowStep,
  WorkflowStepDefinition,
  WorkflowStepId,
} from "./types";

const STEP_DELAY_MS = 420;

export const PROOF_OF_POWER_STEPS: WorkflowStepDefinition[] = [
  {
    id: "create-entity",
    label: "Create Entity",
    description: "Register topic as Atlas entity",
    system: "entity",
  },
  {
    id: "intelligence-scan",
    label: "Intelligence Scan",
    description: "Analyze signals and content gaps",
    system: "intelligence",
  },
  {
    id: "research",
    label: "Research",
    description: "Gather context and references",
    system: "orchestrator",
    taskName: "ResearchTopic",
    agentId: "atlas",
  },
  {
    id: "copywriter-draft",
    label: "Copywriter Draft",
    description: "Generate editorial copy",
    system: "orchestrator",
    taskName: "GenerateKnowledgeArticle",
    agentId: "baker",
  },
  {
    id: "visual-plan",
    label: "Visual Plan",
    description: "Plan hero, detail and infographic assets",
    system: "orchestrator",
    taskName: "GenerateVisual",
    agentId: "canvas",
  },
  {
    id: "fact-check",
    label: "Fact Check",
    description: "Verify factual claims",
    system: "orchestrator",
    taskName: "FactCheck",
    agentId: "proof",
  },
  {
    id: "link-engine",
    label: "Link Engine",
    description: "Suggest internal relations",
    system: "orchestrator",
    taskName: "GenerateSEO",
    agentId: "atlas",
  },
  {
    id: "quality-score",
    label: "Quality Score",
    description: "Score draft quality",
    system: "orchestrator",
    taskName: "ScoreQuality",
    agentId: "test-kitchen",
  },
  {
    id: "review-draft",
    label: "Review Draft",
    description: "Prepare for editorial review",
    system: "orchestrator",
    taskName: "ReviewContent",
    agentId: "proof",
  },
  {
    id: "ready-to-publish",
    label: "Ready to Publish",
    description: "Draft queued for review",
    system: "entity",
  },
];

function mapContentType(contentType: ProofOfPowerInput["contentType"]): ContentType {
  if (contentType === "Recipe") return "recipe";
  if (contentType === "Technique") return "technique";
  if (contentType === "Ingredient Guide") return "ingredient";
  return "article";
}

function mapEntityType(contentType: ProofOfPowerInput["contentType"]): string {
  if (contentType === "Recipe") return "recipe";
  if (contentType === "Technique") return "technique";
  if (contentType === "Ingredient Guide") return "ingredient";
  return "knowledge";
}

function mapLocale(language: string): SupportedLocale {
  const normalized = language.trim().toLowerCase();
  if (normalized.startsWith("en") || normalized === "english") return "en";
  if (normalized.startsWith("de") || normalized === "deutsch") return "de";
  if (normalized.startsWith("fr") || normalized === "français" || normalized === "francais") return "fr";
  if (normalized.startsWith("es") || normalized === "español" || normalized === "espanol") return "es";
  if (normalized.startsWith("it") || normalized === "italiano") return "it";
  return "nl";
}

function createInitialSteps(): WorkflowStep[] {
  return PROOF_OF_POWER_STEPS.map((step) => ({ ...step, status: "pending" }));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function patchStep(
  steps: WorkflowStep[],
  stepId: WorkflowStepId,
  patch: Partial<WorkflowStep>,
): WorkflowStep[] {
  return steps.map((step) => (step.id === stepId ? { ...step, ...patch } : step));
}

async function runStep<T>(
  steps: WorkflowStep[],
  stepId: WorkflowStepId,
  execute: () => Promise<T> | T,
  onProgress?: WorkflowProgressCallback,
): Promise<{ steps: WorkflowStep[]; result: T }> {
  const startedAt = new Date().toISOString();
  let next = patchStep(steps, stepId, { status: "running", startedAt, message: undefined, error: undefined });
  onProgress?.(next);
  await sleep(STEP_DELAY_MS);

  try {
    const result = await execute();
    const completedAt = new Date().toISOString();
    next = patchStep(next, stepId, { status: "completed", completedAt });
    onProgress?.(next);
    await sleep(STEP_DELAY_MS);
    return { steps: next, result };
  } catch (error) {
    const completedAt = new Date().toISOString();
    const message = error instanceof Error ? error.message : "Workflow step failed";
    next = patchStep(next, stepId, { status: "failed", completedAt, error: message });
    onProgress?.(next);
    throw error;
  }
}

function buildVisualAssets(items: ReturnType<typeof buildMockPipelineContent>["visualPlan"]): VisualAssetBrief[] {
  return items.map((item) => ({
    id: item.id,
    role: item.role as VisualAssetBrief["role"],
    label: item.label,
    prompt: item.prompt,
    alt: item.label,
    aspectRatio: item.role === "hero" ? "16:9" : "4:3",
    status: "pending",
  }));
}

function buildPublicationDraft(
  input: ProofOfPowerInput,
  mockContent: ReturnType<typeof buildMockPipelineContent>,
  entityId: string,
  runId: string,
  pipelineLog: string[],
): PublicationDraft {
  const now = new Date().toISOString();
  const contentType = mapContentType(input.contentType);
  const locale = mapLocale(input.language);
  const slug = slugify(mockContent.title);

  return {
    id: `pop-draft-${runId}`,
    brief: {
      id: `pop-brief-${runId}`,
      topic: input.topic,
      contentType,
      locale,
    },
    reviewStatus: "draft",
    pipelineStage: "ready_for_review",
    contentType,
    locale,
    title: mockContent.title,
    subtitle: mockContent.summary,
    slug,
    contentPayload: {
      summary: mockContent.summary,
      body: mockContent.body,
      workflowRunId: runId,
      entityId,
    },
    visuals: buildVisualAssets(mockContent.visualPlan),
    qualityReport: {
      score: mockContent.qualityScore,
      passed: mockContent.factCheckPassed,
      issues: [],
      checkedAt: now,
    },
    linkGraph: {
      nodes: mockContent.relations.map((relation, index) => ({
        slug: slugify(relation),
        title: relation,
        score: Math.max(0.55, 0.95 - index * 0.05),
        reason: "Suggested by Link Engine (mock)",
      })),
      generatedAt: now,
    },
    translations: {},
    seo: {
      title: mockContent.title,
      description: mockContent.summary,
      tags: mockContent.relations.slice(0, 4).map((tag) => slugify(tag)),
    },
    editorNotes: `Proof of Power workflow · ${input.moduleLabel} · ${input.contentType}`,
    createdAt: now,
    updatedAt: now,
    pipelineLog,
  };
}

/** End-to-end mock workflow — proves Atlas pipeline without external AI calls. */
export async function runProofOfPowerWorkflow(
  input: ProofOfPowerInput,
  onProgress?: WorkflowProgressCallback,
): Promise<ProofOfPowerResult> {
  const runId = `pop-${Date.now()}`;
  const startedAt = new Date().toISOString();
  const mockContent = buildMockPipelineContent(input);
  const pipelineLog: string[] = [];
  let steps = createInitialSteps();
  onProgress?.(steps);

  const slug = slugify(input.topic);
  const locale = mapLocale(input.language);

  const entityResult = await runStep(
    steps,
    "create-entity",
    () =>
      createEntity(
        {
          title: input.topic.trim(),
          slug,
          description: mockContent.summary,
          entityType: mapEntityType(input.contentType),
          domain: input.moduleId,
          category: input.contentType.toLowerCase().replace(/\s+/g, "-"),
          tags: mockContent.relations.slice(0, 4).map((tag) => slugify(tag)),
          status: "draft",
          visibility: "internal",
          attributes: {
            contentType: input.contentType,
            language: input.language,
            workflowRunId: runId,
          },
          relations: [],
          metadata: { proofOfPower: true, runId },
          media: [],
          seo: { title: mockContent.title, description: mockContent.summary },
        },
        { autoSlug: true },
      ),
    onProgress,
  );
  steps = entityResult.steps;
  let entity = entityResult.result;
  pipelineLog.push(`Entity created: ${entity.id}`);

  const intelligenceResult = await runStep(
    steps,
    "intelligence-scan",
    async () => {
      emitSignal({
        type: "search.query",
        moduleId: input.moduleId,
        locale,
        payload: { query: input.topic, source: "proof-of-power" },
      });
      emitSignal({
        type: "content.update",
        moduleId: input.moduleId,
        locale,
        payload: { topic: input.topic, source: "proof-of-power", action: "workflow-start" },
      });

      const run = await runIntelligenceAnalysis({
        scope: { moduleId: input.moduleId },
        signalLimit: 100,
      });
      return run.results.length;
    },
    onProgress,
  );
  steps = intelligenceResult.steps;
  const intelligenceInsightCount = intelligenceResult.result;
  pipelineLog.push(`Intelligence scan completed (${intelligenceInsightCount} insights)`);

  await runStep(
    steps,
    "research",
    () => {
      pipelineLog.push(`Research compiled for "${input.topic}"`);
      return mockContent.summary;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  await runStep(
    steps,
    "copywriter-draft",
    () => {
      pipelineLog.push(`Copy draft ready: ${mockContent.title}`);
      return mockContent.body;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  await runStep(
    steps,
    "visual-plan",
    () => {
      pipelineLog.push(`${mockContent.visualPlan.length} visual assets planned`);
      return mockContent.visualPlan;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  await runStep(
    steps,
    "fact-check",
    () => {
      pipelineLog.push(`Fact check: ${mockContent.factCheckPassed ? "passed" : "failed"}`);
      return mockContent.factCheckPassed;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  await runStep(
    steps,
    "link-engine",
    () => {
      pipelineLog.push(`${mockContent.relations.length} relations suggested`);
      return mockContent.relations;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  await runStep(
    steps,
    "quality-score",
    () => {
      pipelineLog.push(`Quality score: ${mockContent.qualityScore}/100`);
      return mockContent.qualityScore;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  const draft = buildPublicationDraft(input, mockContent, entity.id, runId, pipelineLog);

  await runStep(
    steps,
    "review-draft",
    () => {
      publicationStore.addDraft(draft);
      pipelineLog.push(`Draft stored: ${draft.id}`);
      return draft.id;
    },
    onProgress,
  ).then((result) => {
    steps = result.steps;
  });

  const readyResult = await runStep(
    steps,
    "ready-to-publish",
    () => {
      entity = updateEntity(entity.id, {
        status: "review",
        description: mockContent.summary,
        relations: mockContent.relations.map((relation) => ({
          id: createRelationId(entity.id, "related", slugify(relation)),
          kind: "related",
          targetId: slugify(relation),
          targetSlug: slugify(relation),
          label: relation,
        })),
        attributes: {
          ...entity.attributes,
          qualityScore: mockContent.qualityScore,
          factCheckPassed: mockContent.factCheckPassed,
          publishingStatus: mockContent.publishingStatus,
        },
        metadata: {
          ...entity.metadata,
          draftId: draft.id,
          readyForReview: true,
        },
      });
      pipelineLog.push("Status: ready_for_review");
      return mockContent.publishingStatus;
    },
    onProgress,
  );
  steps = readyResult.steps;

  const completedAt = new Date().toISOString();

  return {
    runId,
    input,
    steps,
    entity,
    draft,
    mockContent,
    intelligenceInsightCount,
    startedAt,
    completedAt,
  };
}

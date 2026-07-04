import { getActiveModule } from "../plugin/registry";
import { defaultTranslationTargets } from "../agents/coreAgents";
import { executeTask, formatTaskExecutionLog } from "@/atlas/ai/router/executeTask";
import { mapPublishingTask, resolveWriteTask } from "@/atlas/ai/tasks/publishingBridge";
import type { CopywriterOutput } from "../agents/coreAgents";
import type {
  BulkGenerationRequest,
  GenerationBrief,
  LinkGraph,
  PipelineStage,
  PublicationDraft,
  QualityReport,
  ReviewStatus,
  TranslationBundle,
  VisualAssetBrief,
} from "../types";
import { DEFAULT_LOCALE } from "../types";
import type { DomainValidationReport } from "../types";

export type PublishingPipelineOptions = {
  onStageChange?: (draftId: string, stage: PipelineStage) => void;
  skipTranslations?: boolean;
  skipResearch?: boolean;
};

function createDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createBriefId(): string {
  return `brief-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendLog(draft: PublicationDraft, message: string): PublicationDraft {
  return {
    ...draft,
    pipelineLog: [...draft.pipelineLog, `${new Date().toISOString()} — ${message}`],
    updatedAt: new Date().toISOString(),
  };
}

function withStage(
  draft: PublicationDraft,
  stage: PipelineStage,
  options?: PublishingPipelineOptions,
): PublicationDraft {
  options?.onStageChange?.(draft.id, stage);
  return appendLog({ ...draft, pipelineStage: stage }, `Stage: ${stage}`);
}

/**
 * Generic AI publishing workflow — all AI steps route through Atlas AI Orchestrator.
 * Research → Copywriting → Visual → Fact Check → Linking → Translation → Domain Validation → Quality Score → Review
 */
export async function runPublishingPipeline(
  briefInput: Omit<GenerationBrief, "id">,
  options?: PublishingPipelineOptions,
): Promise<PublicationDraft> {
  const plugin = getActiveModule();
  const brief: GenerationBrief = { ...briefInput, id: createBriefId() };
  const now = new Date().toISOString();
  const moduleId = plugin.id;

  let draft: PublicationDraft = {
    id: createDraftId(),
    brief,
    reviewStatus: "draft",
    pipelineStage: "queued",
    contentType: brief.contentType,
    locale: brief.locale ?? DEFAULT_LOCALE,
    title: brief.topic,
    subtitle: "",
    slug: "",
    visuals: [],
    translations: {},
    seo: { title: "", description: "", tags: [] },
    editorNotes: "",
    createdAt: now,
    updatedAt: now,
    pipelineLog: [],
  };

  if (!options?.skipResearch) {
    draft = withStage(draft, "research", options);
    const researchExecution = await executeTask({
      task: mapPublishingTask("research"),
      payload: { topic: brief.topic, keywords: brief.keywords ?? [brief.topic] },
      moduleId,
    });
    draft = appendLog(draft, formatTaskExecutionLog(researchExecution));
  }

  draft = withStage(draft, "copywriting", options);
  const copyExecution = await executeTask<CopywriterOutput>({
    task: resolveWriteTask(brief.contentType),
    payload: { brief },
    agentId: "copywriter",
    moduleId,
  });
  const copyOutput = copyExecution.output;
  draft = {
    ...draft,
    title: copyOutput.title,
    subtitle: copyOutput.subtitle,
    slug: copyOutput.slug,
    contentPayload: copyOutput.contentPayload
      ? plugin.importGeneratedContent(copyOutput.contentPayload)
      : undefined,
    seo: {
      title: copyOutput.seoTitle,
      description: copyOutput.seoDescription,
      tags: copyOutput.tags,
    },
  };
  draft = appendLog(draft, `${formatTaskExecutionLog(copyExecution)} · draft ready`);

  draft = withStage(draft, "visual_design", options);
  const visualExecution = await executeTask<VisualAssetBrief[]>({
    task: mapPublishingTask("visual_design"),
    payload: {
      brief,
      title: draft.title,
      slug: draft.slug,
      contentType: brief.contentType,
    },
    agentId: "visual-designer",
    moduleId,
  });
  draft = { ...draft, visuals: visualExecution.output };
  draft = appendLog(
    draft,
    `${formatTaskExecutionLog(visualExecution)} · ${visualExecution.output.length} visuals`,
  );

  draft = withStage(draft, "fact_checking", options);
  const proofExecution = await executeTask<QualityReport>({
    task: mapPublishingTask("fact_checking"),
    payload: { draft },
    agentId: "fact-checker",
    moduleId,
  });
  draft = { ...draft, qualityReport: proofExecution.output };
  draft = appendLog(
    draft,
    `${formatTaskExecutionLog(proofExecution)} · score ${proofExecution.output.score}/100`,
  );

  await executeTask({
    task: mapPublishingTask("scientific_validation"),
    payload: { draft },
    agentId: "fact-checker",
    moduleId,
  });

  await executeTask({
    task: mapPublishingTask("seo"),
    payload: { draft },
    agentId: "fact-checker",
    moduleId,
  });

  draft = withStage(draft, "linking", options);
  const linkExecution = await executeTask<LinkGraph>({
    task: mapPublishingTask("internal_linking"),
    payload: {
      slug: draft.slug,
      title: draft.title,
      tags: draft.seo.tags,
      categoryId: brief.categoryId,
    },
    agentId: "link-engine",
    moduleId,
  });
  draft = { ...draft, linkGraph: linkExecution.output };

  if (draft.contentPayload) {
    const relatedSlugs = linkExecution.output.nodes.map((node) => node.slug);
    draft.contentPayload = plugin.mergeContentRelations(draft.contentPayload, relatedSlugs);
  }
  draft = appendLog(
    draft,
    `${formatTaskExecutionLog(linkExecution)} · ${linkExecution.output.nodes.length} links`,
  );

  if (!options?.skipTranslations) {
    const lingoExecution = await executeTask<TranslationBundle>({
      task: mapPublishingTask("translation"),
      payload: {
        draft,
        targetLocales: defaultTranslationTargets(),
      },
      agentId: "translator",
      moduleId,
    });
    draft = { ...draft, translations: lingoExecution.output };
    draft = appendLog(draft, `${formatTaskExecutionLog(lingoExecution)} · translations ready`);
  }

  draft = withStage(draft, "domain_validation", options);
  const validationExecution = await executeTask<DomainValidationReport>({
    task: mapPublishingTask("domain_validation"),
    payload: { draft },
    agentId: "domain-validator",
    moduleId,
  });
  draft = { ...draft, validationReport: validationExecution.output };
  draft = appendLog(
    draft,
    `${formatTaskExecutionLog(validationExecution)} · score ${validationExecution.output.overallScore}/100`,
  );

  draft = withStage(draft, "quality_scoring", options);
  const qualityExecution = await executeTask<{ score: number; passed: boolean }>({
    task: "quality.score",
    payload: { draft },
    agentId: "fact-checker",
    moduleId,
  });
  draft = appendLog(
    draft,
    `${formatTaskExecutionLog(qualityExecution)} · score ${qualityExecution.output.score}/100`,
  );

  draft = withStage(draft, "ready_for_review", options);
  draft = { ...draft, reviewStatus: "in_review" as ReviewStatus };

  return draft;
}

export async function runBulkGenerationPipeline(
  request: BulkGenerationRequest,
  options?: PublishingPipelineOptions,
): Promise<PublicationDraft[]> {
  const briefs: GenerationBrief[] = request.topics.map((topic, index) => ({
    id: `${request.id}-topic-${index}`,
    topic,
    contentType: request.contentType,
    categoryId: request.categoryId,
    locale: request.locale ?? DEFAULT_LOCALE,
    slugHint: topic,
  }));

  const drafts: PublicationDraft[] = [];

  for (const brief of briefs) {
    drafts.push(await runPublishingPipeline(brief, options));
  }

  return drafts;
}

export function createBulkRequest(input: {
  label: string;
  contentType: BulkGenerationRequest["contentType"];
  categoryId: string;
  topics: string[];
}): BulkGenerationRequest {
  return {
    id: createBriefId(),
    label: input.label,
    contentType: input.contentType,
    categoryId: input.categoryId,
    topics: input.topics,
    locale: DEFAULT_LOCALE,
  };
}

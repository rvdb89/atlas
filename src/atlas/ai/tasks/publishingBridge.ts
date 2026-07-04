import type { AiTaskType } from "@/atlas/publishing/orchestration/types";
import type { AtlasTaskType } from "../types";
import type { ContentType } from "@/atlas/publishing/types";

/** Bridge legacy publishing pipeline stages to Atlas AI task ids. */
export const PUBLISHING_TASK_MAP: Record<AiTaskType, AtlasTaskType> = {
  research: "research.search",
  copywriting: "knowledge.write",
  visual_design: "visual.generate",
  fact_checking: "fact.check",
  scientific_validation: "knowledge.review",
  seo: "seo.optimize",
  internal_linking: "link.build",
  translation: "translate",
  domain_validation: "recipe.validate",
};

export function mapPublishingTask(taskType: AiTaskType): AtlasTaskType {
  return PUBLISHING_TASK_MAP[taskType];
}

export function resolveWriteTask(contentType: ContentType): AtlasTaskType {
  if (contentType === "recipe") return "recipe.write";
  return "knowledge.write";
}

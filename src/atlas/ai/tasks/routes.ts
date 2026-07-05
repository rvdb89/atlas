import type { AtlasTaskType } from "../types";
import type { CoreAgentId } from "@/atlas/publishing/plugin/types";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";
import { getTaskProviderConfig } from "../providers/provider-config";

export type TaskRouteConfig = {
  task: AtlasTaskType;
  agentId: CoreAgentId;
  label: string;
  promptId: string;
  primaryModelId: string;
  fallbackModelIds: string[];
  defaultSettings?: {
    temperature?: number;
    maxTokens?: number;
    retries?: number;
    timeoutMs?: number;
    providerId?: string;
  };
};

const BASE_ROUTES: TaskRouteConfig[] = [
  {
    task: "research.search",
    agentId: "copywriter",
    label: "Research",
    promptId: "research.search.v1",
    primaryModelId: "perplexity",
    fallbackModelIds: ["gemini-pro", "gpt-4o", "atlas-stub"],
  },
  {
    task: "research.summarize",
    agentId: "copywriter",
    label: "Research summary",
    promptId: "research.summarize.v1",
    primaryModelId: "gemini-pro",
    fallbackModelIds: ["claude-sonnet", "atlas-stub"],
  },
  {
    task: "knowledge.write",
    agentId: "copywriter",
    label: "Knowledge writing",
    promptId: "knowledge.write.v1",
    primaryModelId: "claude-sonnet",
    fallbackModelIds: ["gpt-4o", "gemini-pro", "atlas-stub"],
    defaultSettings: { temperature: 0.7, maxTokens: 4096 },
  },
  {
    task: "recipe.write",
    agentId: "copywriter",
    label: "Recipe writing",
    promptId: "recipe.write.v1",
    primaryModelId: "claude-sonnet",
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  {
    task: "visual.generate",
    agentId: "visual-designer",
    label: "Visual generation",
    promptId: "visual.generate.v1",
    primaryModelId: "openai-dalle",
    fallbackModelIds: ["atlas-stub"],
  },
  {
    task: "visual.diagram",
    agentId: "visual-designer",
    label: "Diagram",
    promptId: "visual.diagram.v1",
    primaryModelId: "openai-dalle",
    fallbackModelIds: ["atlas-stub"],
  },
  {
    task: "visual.infographic",
    agentId: "visual-designer",
    label: "Infographic",
    promptId: "visual.infographic.v1",
    primaryModelId: "openai-dalle",
    fallbackModelIds: ["atlas-stub"],
  },
  {
    task: "fact.check",
    agentId: "fact-checker",
    label: "Fact checking",
    promptId: "factcheck.review.v1",
    primaryModelId: "gemini-pro",
    fallbackModelIds: ["claude-sonnet", "gpt-4o", "atlas-stub"],
  },
  {
    task: "knowledge.review",
    agentId: "fact-checker",
    label: "Knowledge review",
    promptId: "knowledge.review.v1",
    primaryModelId: "gemini-pro",
    fallbackModelIds: ["atlas-stub"],
  },
  {
    task: "seo.optimize",
    agentId: "fact-checker",
    label: "SEO",
    promptId: "seo.optimize.v1",
    primaryModelId: "gpt-4o",
    fallbackModelIds: ["claude-sonnet", "atlas-stub"],
  },
  {
    task: "link.build",
    agentId: "link-engine",
    label: "Internal linking",
    promptId: "link.build.v1",
    primaryModelId: "gemini-pro",
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  {
    task: "translate",
    agentId: "translator",
    label: "Translation",
    promptId: "translation.prepare.v1",
    primaryModelId: "deepl",
    fallbackModelIds: ["gpt-4o", "gemini-pro", "atlas-stub"],
  },
  {
    task: "recipe.validate",
    agentId: "domain-validator",
    label: "Recipe validation",
    promptId: "recipe.validate.v1",
    primaryModelId: "atlas-stub",
    fallbackModelIds: ["gemini-pro", "claude-sonnet", "deepseek-chat"],
  },
  {
    task: "recipe.review",
    agentId: "domain-validator",
    label: "Recipe review",
    promptId: "recipe.review.v1",
    primaryModelId: "gemini-pro",
    fallbackModelIds: ["atlas-stub"],
  },
  {
    task: "quality.score",
    agentId: "fact-checker",
    label: "Quality score",
    promptId: "quality.score.v1",
    primaryModelId: "gpt-4o",
    fallbackModelIds: ["atlas-stub"],
  },
  {
    task: "writing.improve",
    agentId: "copywriter",
    label: "Writing improvement",
    promptId: "writing.improve.v1",
    primaryModelId: "claude-sonnet",
    fallbackModelIds: ["mistral-large", "gpt-4o", "atlas-stub"],
  },
  {
    task: "prompt.generate",
    agentId: "copywriter",
    label: "Prompt generation",
    promptId: "prompt.generate.v1",
    primaryModelId: "gpt-4o",
    fallbackModelIds: ["claude-sonnet", "atlas-stub"],
  },
  {
    task: "quiz.create",
    agentId: "copywriter",
    label: "Quiz creation",
    promptId: "quiz.create.v1",
    primaryModelId: "gemini-pro",
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
];

function applyModuleOverrides(config: TaskRouteConfig): TaskRouteConfig {
  if (config.task !== "recipe.validate") return config;
  const module = tryGetActiveModule();
  if (!module?.domainValidationRoute) return config;
  return {
    ...config,
    primaryModelId: module.domainValidationRoute.primaryModelId,
    fallbackModelIds: module.domainValidationRoute.fallbackModelIds,
  };
}

export function getTaskRouteConfigs(): TaskRouteConfig[] {
  return BASE_ROUTES.map(applyModuleOverrides);
}

export function getTaskRouteConfig(task: AtlasTaskType): TaskRouteConfig {
  const config = getTaskRouteConfigs().find((entry) => entry.task === task);
  if (!config) throw new Error(`No AI route for task: ${task}`);

  const providerConfig = getTaskProviderConfig(task);
  return {
    ...config,
    primaryModelId: providerConfig.modelId,
    fallbackModelIds: providerConfig.fallbackModelIds ?? config.fallbackModelIds,
    defaultSettings: {
      temperature: providerConfig.temperature ?? config.defaultSettings?.temperature,
      maxTokens: providerConfig.maxTokens ?? config.defaultSettings?.maxTokens,
      retries: providerConfig.retries,
      timeoutMs: providerConfig.timeoutMs,
      providerId: providerConfig.providerId,
    },
  };
}

export function getTasksForAgent(agentId: CoreAgentId): TaskRouteConfig[] {
  return getTaskRouteConfigs().filter((entry) => entry.agentId === agentId);
}

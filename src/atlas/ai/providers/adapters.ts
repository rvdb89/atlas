import type { AtlasTaskType } from "../types";
import { getModelsForProvider } from "../models/profiles";
import { getTaskHandler } from "../tasks/handlerRegistry";
import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse } from "./types";
import { ProviderUnavailableError } from "./types";

const forcedDown = new Set<string>();

export function simulateProviderFailure(providerId: string) {
  forcedDown.add(providerId);
}

export function clearSimulatedFailures() {
  forcedDown.clear();
}

export function createStubCapableProvider(config: {
  id: string;
  supportedTasks: AtlasTaskType[];
  useHandlers?: boolean;
}): AiProviderAdapter {
  const models = getModelsForProvider(config.id);

  return {
    id: config.id,
    models: models.length > 0 ? models : getModelsForProvider("stub"),
    supports(task: AtlasTaskType, modelId: string) {
      if (!config.supportedTasks.includes(task)) return false;
      return Boolean(getModelsForProvider(config.id).find((m) => m.id === modelId) ?? modelId === "atlas-stub");
    },
    async healthCheck() {
      if (forcedDown.has(config.id)) {
        return { available: false, message: "Simulated outage" };
      }
      return { available: true };
    },
    async execute<T>(request: AiProviderRequest): Promise<AiProviderResponse<T>> {
      if (forcedDown.has(config.id)) {
        throw new ProviderUnavailableError(config.id, request.modelId);
      }

      if (config.useHandlers || request.modelId === "atlas-stub") {
        const handler = getTaskHandler(request.task);
        if (!handler) {
          throw new Error(`No task handler registered for ${request.task}`);
        }
        return handler(request) as Promise<AiProviderResponse<T>>;
      }

      throw new ProviderUnavailableError(
        config.id,
        request.modelId,
        `${config.id} live API not configured — use atlas-stub or register handlers`,
      );
    },
  };
}

export const claudeProvider = createStubCapableProvider({
  id: "claude",
  supportedTasks: ["knowledge.write", "knowledge.review", "recipe.write", "recipe.review", "fact.check", "seo.optimize"],
});

export const openaiProvider = createStubCapableProvider({
  id: "openai",
  supportedTasks: [
    "knowledge.write",
    "recipe.write",
    "visual.generate",
    "visual.diagram",
    "visual.infographic",
    "fact.check",
    "seo.optimize",
    "translate",
    "quality.score",
  ],
});

export const geminiProvider = createStubCapableProvider({
  id: "gemini",
  supportedTasks: [
    "knowledge.write",
    "knowledge.review",
    "recipe.review",
    "recipe.validate",
    "fact.check",
    "link.build",
    "research.summarize",
    "translate",
  ],
});

export const perplexityProvider = createStubCapableProvider({
  id: "perplexity",
  supportedTasks: ["research.search", "fact.check", "knowledge.review"],
});

export const deepseekProvider = createStubCapableProvider({
  id: "deepseek",
  supportedTasks: ["knowledge.write", "recipe.validate", "fact.check"],
});

export const deeplProvider = createStubCapableProvider({
  id: "deepl",
  supportedTasks: ["translate"],
});

export const stubProvider = createStubCapableProvider({
  id: "stub",
  supportedTasks: [
    "knowledge.write",
    "knowledge.review",
    "recipe.write",
    "recipe.review",
    "recipe.validate",
    "visual.generate",
    "visual.diagram",
    "visual.infographic",
    "research.search",
    "research.summarize",
    "fact.check",
    "translate",
    "seo.optimize",
    "link.build",
    "quality.score",
  ],
  useHandlers: true,
});

export const ALL_PROVIDERS = [
  claudeProvider,
  openaiProvider,
  geminiProvider,
  perplexityProvider,
  deepseekProvider,
  deeplProvider,
  stubProvider,
];

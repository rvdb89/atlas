import type { AtlasTaskType } from "../types";
import { getModelsForProvider } from "../models/profiles";
import { getTaskHandler } from "../tasks/handlerRegistry";
import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse } from "../interfaces/provider";
import { ProviderUnavailableError } from "../interfaces/provider";

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
  return {
    id: config.id,
    supports(task: AtlasTaskType, modelId: string) {
      if (!config.supportedTasks.includes(task)) return false;
      return Boolean(getModelsForProvider(config.id).find((m) => m.id === modelId) ?? modelId.startsWith("atlas-"));
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

      if (config.useHandlers || request.modelId.startsWith("atlas-")) {
        const handler = getTaskHandler(request.task);
        if (!handler) {
          throw new Error(`No task handler registered for ${request.task}`);
        }
        return handler(request) as Promise<AiProviderResponse<T>>;
      }

      throw new ProviderUnavailableError(
        config.id,
        request.modelId,
        `${config.id} live API not configured — use atlas-stub/atlas-mock or register handlers`,
      );
    },
  };
}

const ALL_TASKS: AtlasTaskType[] = [
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
  "writing.improve",
  "prompt.generate",
  "quiz.create",
];

export const claudeProvider = createStubCapableProvider({
  id: "claude",
  supportedTasks: ["knowledge.write", "knowledge.review", "recipe.write", "recipe.review", "fact.check", "seo.optimize", "writing.improve"],
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
    "writing.improve",
    "prompt.generate",
    "quiz.create",
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
    "quiz.create",
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

export const mistralProvider = createStubCapableProvider({
  id: "mistral",
  supportedTasks: ["knowledge.write", "recipe.write", "fact.check", "writing.improve", "research.summarize"],
});

export const grokProvider = createStubCapableProvider({
  id: "grok",
  supportedTasks: ["knowledge.write", "research.search", "research.summarize", "fact.check"],
});

export const openrouterProvider = createStubCapableProvider({
  id: "openrouter",
  supportedTasks: ALL_TASKS,
});

export const mockProvider = createStubCapableProvider({
  id: "mock",
  supportedTasks: ALL_TASKS,
  useHandlers: true,
});

export const stubProvider = createStubCapableProvider({
  id: "stub",
  supportedTasks: ALL_TASKS,
  useHandlers: true,
});

export const ALL_PROVIDERS = [
  claudeProvider,
  openaiProvider,
  geminiProvider,
  perplexityProvider,
  deepseekProvider,
  deeplProvider,
  mistralProvider,
  grokProvider,
  openrouterProvider,
  mockProvider,
  stubProvider,
];

import type { ModelProfile } from "./types";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";

/** Model metadata — names only live here, never in agents or modules. */
export const MODEL_PROFILES: Record<string, ModelProfile> = {
  "claude-sonnet": {
    id: "claude-sonnet",
    providerId: "claude",
    name: "Claude Sonnet",
    vendor: "Anthropic",
    strengths: ["Copywriting", "Long context", "Editorial quality", "Nuance"],
    costTier: "medium",
    speedTier: "balanced",
    qualityTier: "best",
    latencyMs: 2200,
    contextWindow: 200_000,
    supportedLanguages: ["nl", "en", "de", "fr", "es", "it"],
    supportedOutputs: ["text", "markdown", "json", "validation"],
    supportedMedia: ["text"],
    available: true,
  },
  "gpt-4o": {
    id: "gpt-4o",
    providerId: "openai",
    name: "GPT-4o",
    vendor: "OpenAI",
    strengths: ["SEO", "Structured output", "Translation", "All-round text"],
    costTier: "medium",
    speedTier: "fast",
    qualityTier: "excellent",
    latencyMs: 1800,
    contextWindow: 128_000,
    supportedLanguages: ["nl", "en", "de", "fr", "es", "it"],
    supportedOutputs: ["text", "markdown", "json", "translation", "validation", "score"],
    supportedMedia: ["text", "image"],
    available: true,
  },
  "gemini-pro": {
    id: "gemini-pro",
    providerId: "gemini",
    name: "Gemini Pro",
    vendor: "Google",
    strengths: ["Science", "Fact checking", "Multilingual", "Research"],
    costTier: "medium",
    speedTier: "balanced",
    qualityTier: "excellent",
    latencyMs: 2000,
    contextWindow: 1_000_000,
    supportedLanguages: ["nl", "en", "de", "fr", "es", "it"],
    supportedOutputs: ["text", "markdown", "json", "research", "validation", "translation"],
    supportedMedia: ["text", "image"],
    available: true,
  },
  perplexity: {
    id: "perplexity",
    providerId: "perplexity",
    name: "Perplexity Sonar",
    vendor: "Perplexity",
    strengths: ["Research", "Current sources", "Fact checking"],
    costTier: "medium",
    speedTier: "fast",
    qualityTier: "excellent",
    latencyMs: 2500,
    contextWindow: 127_000,
    supportedLanguages: ["nl", "en", "de", "fr"],
    supportedOutputs: ["research", "text", "markdown", "validation"],
    supportedMedia: ["text"],
    available: true,
  },
  "deepseek-chat": {
    id: "deepseek-chat",
    providerId: "deepseek",
    name: "DeepSeek Chat",
    vendor: "DeepSeek",
    strengths: ["Reasoning", "Cost efficiency", "Structured JSON"],
    costTier: "low",
    speedTier: "fast",
    qualityTier: "excellent",
    latencyMs: 1600,
    contextWindow: 64_000,
    supportedLanguages: ["nl", "en", "de", "fr", "es", "it"],
    supportedOutputs: ["text", "markdown", "json", "validation"],
    supportedMedia: ["text"],
    available: true,
  },
  "openai-dalle": {
    id: "openai-dalle",
    providerId: "openai",
    name: "OpenAI Images",
    vendor: "OpenAI",
    strengths: ["Hero visuals", "Product photography", "Consistent style"],
    costTier: "medium",
    speedTier: "balanced",
    qualityTier: "excellent",
    latencyMs: 8000,
    contextWindow: 0,
    supportedLanguages: ["en"],
    supportedOutputs: ["image"],
    supportedMedia: ["image"],
    available: true,
  },
  deepl: {
    id: "deepl",
    providerId: "deepl",
    name: "DeepL",
    vendor: "DeepL",
    strengths: ["Translation", "Natural Dutch", "EU languages"],
    costTier: "low",
    speedTier: "fast",
    qualityTier: "best",
    latencyMs: 900,
    contextWindow: 0,
    supportedLanguages: ["nl", "en", "de", "fr", "es", "it"],
    supportedOutputs: ["translation"],
    supportedMedia: ["text"],
    available: true,
  },
  "atlas-stub": {
    id: "atlas-stub",
    providerId: "stub",
    name: "Atlas Stub",
    vendor: "Atlas",
    strengths: ["Offline development", "Pipeline testing", "Deterministic output"],
    costTier: "low",
    speedTier: "fast",
    qualityTier: "good",
    latencyMs: 10,
    contextWindow: 0,
    supportedLanguages: ["nl", "en", "de", "fr", "es", "it"],
    supportedOutputs: ["text", "markdown", "json", "image", "research", "translation", "validation", "score"],
    supportedMedia: ["text", "image"],
    available: true,
  },
};

function getAllModelProfiles(): Record<string, ModelProfile> {
  const module = tryGetActiveModule();
  return {
    ...MODEL_PROFILES,
    ...(module?.additionalModelProfiles ?? {}),
  };
}

export function getModelProfile(modelId: string): ModelProfile | undefined {
  return getAllModelProfiles()[modelId];
}

export function listModelProfiles(): ModelProfile[] {
  return Object.values(getAllModelProfiles());
}

export function listAvailableModels(): ModelProfile[] {
  return listModelProfiles().filter((profile) => profile.available);
}

export function getModelsForProvider(providerId: string): ModelProfile[] {
  return listModelProfiles().filter((profile) => profile.providerId === providerId);
}

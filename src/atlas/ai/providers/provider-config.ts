import type { AtlasTaskType } from "../types";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { DEFAULT_CLAUDE_MODEL } from "./claudeConfig";

export type TaskProviderConfig = {
  task: AtlasTaskType;
  providerId: string;
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  retries?: number;
  timeoutMs?: number;
  fallbackProviderIds?: string[];
  fallbackModelIds?: string[];
};

const DEFAULTS = {
  retries: 2,
  timeoutMs: 30_000,
  temperature: 0.7,
  maxTokens: 4096,
};

/** Tasks routed live to Claude when ANTHROPIC_API_KEY is configured. */
export const CLAUDE_LIVE_TASKS: AtlasTaskType[] = [
  "knowledge.write",
  "fact.check",
  "quality.score",
  "writing.improve",
  "research.summarize",
  "mission.decide",
  "mission.implement",
  "tips.write",
];

/** Fully configurable task → provider routing table. */
export const TASK_PROVIDER_CONFIG: Record<AtlasTaskType, TaskProviderConfig> = {
  "knowledge.write": {
    task: "knowledge.write",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.7,
    // This table — not routes.ts's defaultSettings — is what getTaskRouteConfig() actually
    // applies (resolveEffectiveTaskProviderConfig always wins). Found the hard way: routes.ts
    // was bumped to 8000/120s for real article generation, but every real run kept coming
    // back at exactly ~30s with a mock-shaped response ("Atlas topic", tags including
    // "mock") — this entry's old 4096/30s was silently the one actually in effect, timing
    // out before a 5-9 section article could finish and falling through to the atlas-stub
    // fallback. Kept in sync with routes.ts's knowledge.write entry now.
    maxTokens: 8000,
    retries: 2,
    timeoutMs: 120_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "recipe.write": {
    task: "recipe.write",
    providerId: "claude",
    modelId: "claude-sonnet",
    temperature: 0.65,
    maxTokens: 4096,
    retries: 2,
    timeoutMs: 30_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "writing.improve": {
    task: "writing.improve",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.5,
    maxTokens: 3000,
    retries: 2,
    timeoutMs: 25_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "visual.generate": {
    task: "visual.generate",
    providerId: "openai",
    modelId: "openai-dalle",
    temperature: 0.8,
    maxTokens: 1024,
    retries: 1,
    timeoutMs: 45_000,
    fallbackModelIds: ["atlas-stub"],
  },
  "visual.diagram": {
    task: "visual.diagram",
    providerId: "openai",
    modelId: "openai-dalle",
    temperature: 0.7,
    maxTokens: 1024,
    retries: 1,
    timeoutMs: 45_000,
    fallbackModelIds: ["atlas-stub"],
  },
  "visual.infographic": {
    task: "visual.infographic",
    providerId: "openai",
    modelId: "openai-dalle",
    temperature: 0.7,
    maxTokens: 1024,
    retries: 1,
    timeoutMs: 45_000,
    fallbackModelIds: ["atlas-stub"],
  },
  "fact.check": {
    task: "fact.check",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.2,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gemini-pro", "gpt-4o", "atlas-stub"],
  },
  "seo.optimize": {
    task: "seo.optimize",
    providerId: "claude",
    modelId: "claude-sonnet",
    temperature: 0.4,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "translate": {
    task: "translate",
    providerId: "gemini",
    modelId: "gemini-pro",
    temperature: 0.3,
    maxTokens: 4096,
    retries: 2,
    timeoutMs: 25_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "research.search": {
    task: "research.search",
    providerId: "mock",
    modelId: "atlas-mock",
    temperature: 0.4,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gemini-pro", "atlas-stub"],
  },
  "research.summarize": {
    task: "research.summarize",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.5,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["atlas-mock", "atlas-stub"],
  },
  "knowledge.review": {
    task: "knowledge.review",
    providerId: "claude",
    modelId: "claude-sonnet",
    temperature: 0.3,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gemini-pro", "atlas-stub"],
  },
  "recipe.review": {
    task: "recipe.review",
    providerId: "gemini",
    modelId: "gemini-pro",
    temperature: 0.3,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["atlas-stub"],
  },
  "recipe.validate": {
    task: "recipe.validate",
    providerId: "mock",
    modelId: "atlas-stub",
    temperature: 0.2,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gemini-pro", "claude-sonnet"],
  },
  "link.build": {
    task: "link.build",
    providerId: "gemini",
    modelId: "gemini-pro",
    temperature: 0.4,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "quality.score": {
    task: "quality.score",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.2,
    maxTokens: 1024,
    retries: 2,
    timeoutMs: 15_000,
    fallbackModelIds: ["atlas-mock", "atlas-stub"],
  },
  "prompt.generate": {
    task: "prompt.generate",
    providerId: "openai",
    modelId: "gpt-4o",
    temperature: 0.8,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["claude-sonnet", "atlas-stub"],
  },
  "quiz.create": {
    task: "quiz.create",
    providerId: "gemini",
    modelId: "gemini-pro",
    temperature: 0.6,
    maxTokens: 2048,
    retries: 2,
    timeoutMs: 20_000,
    fallbackModelIds: ["gpt-4o", "atlas-stub"],
  },
  "mission.decide": {
    task: "mission.decide",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.3,
    // Was 1200 — too small once adaptive thinking is engaged (current-gen models
    // draw thinking tokens from the same max_tokens pool, with no separate budget).
    // Found in production: a real cycle spent its entire 1200-token budget thinking
    // and hit stop_reason "max_tokens" before writing a single character of the
    // verdict, leaving content empty. Bumped with headroom for thinking + the actual
    // JSON verdict text.
    maxTokens: 4000,
    retries: 2,
    timeoutMs: 30_000,
    fallbackModelIds: ["atlas-mock", "atlas-stub"],
  },
  "mission.implement": {
    task: "mission.implement",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.2,
    maxTokens: 16_000,
    retries: 1,
    timeoutMs: 180_000,
    fallbackModelIds: ["atlas-mock", "atlas-stub"],
  },
  // This table (not routes.ts's defaultSettings) is what resolveEffectiveTaskProviderConfig
  // actually applies — see the knowledge.write entry's comment above for the real incident
  // that proved it. Kept in sync with routes.ts's tips.write entry.
  "tips.write": {
    task: "tips.write",
    providerId: "claude",
    modelId: DEFAULT_CLAUDE_MODEL,
    temperature: 0.7,
    maxTokens: 2000,
    retries: 2,
    timeoutMs: 60_000,
    fallbackModelIds: ["gpt-4o", "gemini-pro", "atlas-stub"],
  },
};

export function resolveEffectiveTaskProviderConfig(task: AtlasTaskType): TaskProviderConfig {
  const config = getTaskProviderConfig(task);

  if (config.providerId === "claude" && !isAnthropicConfigured()) {
    return {
      ...config,
      providerId: "mock",
      modelId: "atlas-mock",
      fallbackModelIds: ["atlas-stub", ...(config.fallbackModelIds ?? [])],
    };
  }

  return config;
}

export function getTaskProviderConfig(task: AtlasTaskType): TaskProviderConfig {
  const config = TASK_PROVIDER_CONFIG[task];
  if (!config) {
    throw new Error(`No provider config for task: ${task}`);
  }

  return {
    ...DEFAULTS,
    ...config,
  };
}

export function listTaskProviderConfigs(): TaskProviderConfig[] {
  return Object.values(TASK_PROVIDER_CONFIG);
}

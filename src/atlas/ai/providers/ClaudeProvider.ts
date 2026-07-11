import { DEFAULT_CLAUDE_MODEL } from "./claudeConfig";
import { createClaudeTransport } from "./transport/createClaudeTransport";
import { LiveProviderBase } from "./LiveProviderBase";
import type { AiTransport } from "./transport/types";

const CLAUDE_LIVE_TASKS = [
  "knowledge.write",
  "fact.check",
  "quality.score",
  "writing.improve",
  "research.summarize",
  "knowledge.review",
  "recipe.write",
  "seo.optimize",
  "tips.write",
] as const;

export class ClaudeProvider extends LiveProviderBase {
  constructor(transport?: AiTransport) {
    super({
      id: "claude",
      label: "Claude",
      transport: transport ?? createClaudeTransport(),
      capabilities: {
        textGeneration: true,
        structuredOutput: true,
        imageGeneration: false,
        streaming: false,
        supportedTasks: [...CLAUDE_LIVE_TASKS],
        models: [
          {
            id: DEFAULT_CLAUDE_MODEL,
            label: "Claude Sonnet 5",
            contextWindow: 1_000_000,
            supportedOutputs: ["text", "markdown", "json"],
            default: true,
          },
          {
            id: "claude-haiku-4-5",
            label: "Claude Haiku 4.5",
            contextWindow: 200_000,
            supportedOutputs: ["text", "markdown", "json"],
          },
          {
            id: "claude-sonnet",
            label: "Claude Sonnet (alias)",
            contextWindow: 1_000_000,
            supportedOutputs: ["text", "markdown", "json"],
          },
        ],
      },
    });
  }
}

export function createClaudeProvider(transport?: AiTransport): ClaudeProvider {
  return new ClaudeProvider(transport);
}

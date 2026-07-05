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
            label: "Claude 3.5 Sonnet",
            contextWindow: 200_000,
            supportedOutputs: ["text", "markdown", "json"],
            default: true,
          },
          {
            id: "claude-3-5-haiku-latest",
            label: "Claude 3.5 Haiku",
            contextWindow: 200_000,
            supportedOutputs: ["text", "markdown", "json"],
          },
          {
            id: "claude-sonnet",
            label: "Claude Sonnet (alias)",
            contextWindow: 200_000,
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

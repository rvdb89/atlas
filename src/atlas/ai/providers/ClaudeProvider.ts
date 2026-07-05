import type { AtlasTaskType } from "../types";
import { LiveProviderBase } from "./LiveProviderBase";
import type { AiTransport } from "./transport/types";

const COPY_TASKS: AtlasTaskType[] = [
  "knowledge.write",
  "knowledge.review",
  "recipe.write",
  "recipe.review",
  "fact.check",
  "seo.optimize",
  "writing.improve",
  "quality.score",
];

export class ClaudeProvider extends LiveProviderBase {
  constructor(transport?: AiTransport) {
    super({
      id: "claude",
      label: "Claude",
      transport,
      capabilities: {
        textGeneration: true,
        structuredOutput: true,
        imageGeneration: false,
        streaming: true,
        supportedTasks: COPY_TASKS,
        models: [
          {
            id: "claude-sonnet",
            label: "Claude Sonnet",
            contextWindow: 200_000,
            supportedOutputs: ["text", "markdown", "json"],
            default: true,
          },
          {
            id: "claude-haiku",
            label: "Claude Haiku",
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

import type { AtlasTaskType } from "../types";
import { LiveProviderBase } from "./LiveProviderBase";
import type { AiTransport } from "./transport/types";

const GEMINI_TASKS: AtlasTaskType[] = [
  "translate",
  "fact.check",
  "knowledge.review",
  "recipe.review",
  "recipe.validate",
  "research.summarize",
  "link.build",
  "quiz.create",
];

export class GeminiProvider extends LiveProviderBase {
  constructor(transport?: AiTransport) {
    super({
      id: "gemini",
      label: "Gemini",
      transport,
      capabilities: {
        textGeneration: true,
        structuredOutput: true,
        imageGeneration: false,
        streaming: true,
        supportedTasks: GEMINI_TASKS,
        models: [
          {
            id: "gemini-pro",
            label: "Gemini Pro",
            contextWindow: 1_000_000,
            supportedOutputs: ["text", "json", "markdown"],
            default: true,
          },
        ],
      },
    });
  }
}

export function createGeminiProvider(transport?: AiTransport): GeminiProvider {
  return new GeminiProvider(transport);
}

import type { AtlasTaskType } from "../types";
import { LiveProviderBase } from "./LiveProviderBase";
import type { AiTransport } from "./transport/types";

const OPENAI_TASKS: AtlasTaskType[] = [
  "visual.generate",
  "visual.diagram",
  "visual.infographic",
  "knowledge.write",
  "recipe.write",
  "seo.optimize",
  "translate",
  "quality.score",
  "writing.improve",
  "prompt.generate",
  "quiz.create",
];

export class OpenAIProvider extends LiveProviderBase {
  constructor(transport?: AiTransport) {
    super({
      id: "openai",
      label: "OpenAI",
      transport,
      capabilities: {
        textGeneration: true,
        structuredOutput: true,
        imageGeneration: true,
        streaming: true,
        supportedTasks: OPENAI_TASKS,
        models: [
          {
            id: "gpt-4o",
            label: "GPT-4o",
            contextWindow: 128_000,
            supportedOutputs: ["text", "json", "markdown", "image"],
            default: true,
          },
          {
            id: "openai-dalle",
            label: "DALL·E",
            contextWindow: 0,
            supportedOutputs: ["image"],
          },
        ],
      },
    });
  }
}

export function createOpenAIProvider(transport?: AiTransport): OpenAIProvider {
  return new OpenAIProvider(transport);
}

import type { AtlasTaskType } from "../types";
import { LiveProviderBase } from "./LiveProviderBase";
import type { AiTransport } from "./transport/types";

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

export class AtlasMockProvider extends LiveProviderBase {
  constructor(transport?: AiTransport) {
    super({
      id: "mock",
      label: "Mock",
      transport,
      capabilities: {
        textGeneration: true,
        structuredOutput: true,
        imageGeneration: true,
        streaming: false,
        supportedTasks: ALL_TASKS,
        models: [
          {
            id: "atlas-mock",
            label: "Atlas Mock",
            contextWindow: 32_000,
            supportedOutputs: ["text", "json", "markdown", "image"],
            default: true,
          },
          {
            id: "atlas-stub",
            label: "Atlas Stub",
            contextWindow: 16_000,
            supportedOutputs: ["text", "json"],
          },
        ],
      },
    });
  }
}

export function createAtlasMockProvider(transport?: AiTransport): AtlasMockProvider {
  return new AtlasMockProvider(transport);
}

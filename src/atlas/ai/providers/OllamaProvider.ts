import type { AtlasTaskType } from "../types";
import { LiveProviderBase } from "./LiveProviderBase";
import type { AiTransport } from "./transport/types";

const OLLAMA_TASKS: AtlasTaskType[] = [
  "knowledge.write",
  "recipe.write",
  "research.summarize",
  "writing.improve",
];

export class OllamaProvider extends LiveProviderBase {
  constructor(transport?: AiTransport) {
    super({
      id: "ollama",
      label: "Ollama",
      transport,
      capabilities: {
        textGeneration: true,
        structuredOutput: true,
        imageGeneration: false,
        streaming: true,
        supportedTasks: OLLAMA_TASKS,
        models: [
          {
            id: "llama3",
            label: "Llama 3",
            contextWindow: 8192,
            supportedOutputs: ["text", "markdown"],
            default: true,
          },
          {
            id: "mistral",
            label: "Mistral",
            contextWindow: 8192,
            supportedOutputs: ["text", "markdown"],
          },
        ],
      },
    });
  }
}

export function createOllamaProvider(transport?: AiTransport): OllamaProvider {
  return new OllamaProvider(transport);
}

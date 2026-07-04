import type { PromptDefinition } from "../types";

export type PromptRegistry = {
  register(prompt: PromptDefinition): void;
  get(promptId: string): PromptDefinition | undefined;
  list(category?: string): PromptDefinition[];
};

import type { GenerationBrief } from "@/atlas/publishing/types";

/** Replaceable text generation backend (OpenAI, Anthropic, local model, …). */
export type TextGenerationProvider = {
  id: string;
  generateStructured<T>(input: {
    systemPrompt: string;
    userPrompt: string;
    schemaHint?: string;
  }): Promise<{ data: T; raw?: string }>;
};

/** Replaceable image generation backend (DALL·E, Flux, Midjourney API, …). */
export type ImageGenerationProvider = {
  id: string;
  generateImage(input: {
    prompt: string;
    aspectRatio: string;
  }): Promise<{ uri: string; revisedPrompt?: string }>;
};

export type ProviderRegistry = {
  text: TextGenerationProvider;
  image: ImageGenerationProvider;
};

export type CopywriterPromptContext = {
  brief: GenerationBrief;
  templateId: string;
  styleGuide: string;
};

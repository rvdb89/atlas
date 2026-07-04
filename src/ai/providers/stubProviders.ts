import type {
  ImageGenerationProvider,
  TextGenerationProvider,
} from "./types";

/**
 * Stub text provider — returns structured placeholders until a real LLM is wired in.
 * Swap this module for OpenAI / Anthropic adapters without changing agents.
 */
export const stubTextProvider: TextGenerationProvider = {
  id: "stub-text",

  async generateStructured<T>(input: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<{ data: T; raw?: string }> {
    return {
      data: {
        _stub: true,
        systemPrompt: input.systemPrompt.slice(0, 80),
        userPrompt: input.userPrompt.slice(0, 120),
      } as T,
      raw: "[stub-text-provider]",
    };
  },
};

/** Stub image provider — no real images yet; pipeline stores prompts only. */
export const stubImageProvider: ImageGenerationProvider = {
  id: "stub-image",

  async generateImage(input: {
    prompt: string;
    aspectRatio: string;
  }): Promise<{ uri: string; revisedPrompt?: string }> {
    return {
      uri: `stub://visual/${encodeURIComponent(input.prompt.slice(0, 40))}`,
      revisedPrompt: input.prompt,
    };
  },
};

export const defaultProviders = {
  text: stubTextProvider,
  image: stubImageProvider,
};

import { registerProvider } from "./registry";
import { createAtlasMockProvider } from "./AtlasMockProvider";
import { createClaudeProvider } from "./ClaudeProvider";
import { createGeminiProvider } from "./GeminiProvider";
import { createOllamaProvider } from "./OllamaProvider";
import { createOpenAIProvider } from "./OpenAIProvider";
import { wrapAiProvider } from "./adapterBridge";
import { liveProviderRegistry, registerLiveProvider } from "./ProviderRegistry";
import { refreshLiveProviderHealth } from "./ProviderRegistry";
import {
  deeplProvider,
  deepseekProvider,
  grokProvider,
  mistralProvider,
  openrouterProvider,
  perplexityProvider,
  stubProvider,
} from "./adapters";

let liveInitialized = false;

/** Register live providers + bridge to legacy orchestrator registry. */
export function bootstrapLiveProviders(): void {
  if (liveInitialized) return;

  const liveProviders = [
    createClaudeProvider(),
    createOpenAIProvider(),
    createGeminiProvider(),
    createOllamaProvider(),
    createAtlasMockProvider(),
  ];

  for (const provider of liveProviders) {
    registerLiveProvider(provider);
    registerProvider(wrapAiProvider(provider));
  }

  const legacyOnly = [
    perplexityProvider,
    deepseekProvider,
    deeplProvider,
    mistralProvider,
    grokProvider,
    openrouterProvider,
    stubProvider,
  ];

  for (const adapter of legacyOnly) {
    if (!liveProviderRegistry.has(adapter.id)) {
      registerProvider(adapter);
    }
  }

  void refreshLiveProviderHealth();
  liveInitialized = true;
}

export function isLiveProvidersBootstrapped(): boolean {
  return liveInitialized;
}

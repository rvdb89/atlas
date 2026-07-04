import type { AiProviderAdapter } from "./types";

const adapters = new Map<string, AiProviderAdapter>();

export function registerProvider(adapter: AiProviderAdapter): void {
  adapters.set(adapter.id, adapter);
}

export function getProvider(providerId: string): AiProviderAdapter | undefined {
  return adapters.get(providerId);
}

export function listProviders(): AiProviderAdapter[] {
  return [...adapters.values()];
}

export function clearProviders(): void {
  adapters.clear();
}

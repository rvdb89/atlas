import type { AtlasTaskType } from "../types";
import type { AiProvider, ProviderHealthSnapshot } from "./interfaces";

const providers = new Map<string, AiProvider>();
let cachedHealth: ProviderHealthSnapshot[] = [];

/** Central provider registry — Atlas never instantiates vendor classes directly. */
export class ProviderRegistry {
  register(provider: AiProvider): void {
    providers.set(provider.id, provider);
  }

  unregister(providerId: string): void {
    providers.delete(providerId);
  }

  get(providerId: string): AiProvider | undefined {
    return providers.get(providerId);
  }

  has(providerId: string): boolean {
    return providers.has(providerId);
  }

  list(): AiProvider[] {
    return [...providers.values()];
  }

  listIds(): string[] {
    return [...providers.keys()];
  }

  clear(): void {
    providers.clear();
    cachedHealth = [];
  }

  async refreshHealth(): Promise<ProviderHealthSnapshot[]> {
    const checkedAt = new Date().toISOString();
    const snapshots = await Promise.all(
      this.list().map(async (provider) => {
        const health = await provider.health();
        const models = await provider.listModels();

        return {
          id: provider.id,
          label: provider.label,
          available: health.available,
          latencyMs: health.latencyMs,
          message: health.message,
          transportMode: health.transportMode,
          hasApiKey: health.hasApiKey,
          modelCount: models.length,
          models: models.map((model) => model.id),
          capabilities: provider.capabilities,
          checkedAt,
        } satisfies ProviderHealthSnapshot;
      }),
    );

    cachedHealth = snapshots;
    return snapshots;
  }

  getCachedHealth(): ProviderHealthSnapshot[] {
    return [...cachedHealth];
  }
}

export const liveProviderRegistry = new ProviderRegistry();

export function registerLiveProvider(provider: AiProvider): void {
  liveProviderRegistry.register(provider);
}

export function getLiveProvider(providerId: string): AiProvider | undefined {
  return liveProviderRegistry.get(providerId);
}

export function listLiveProviders(): AiProvider[] {
  return liveProviderRegistry.list();
}

export async function refreshLiveProviderHealth(): Promise<ProviderHealthSnapshot[]> {
  return liveProviderRegistry.refreshHealth();
}

export function getCachedLiveProviderHealth(): ProviderHealthSnapshot[] {
  return liveProviderRegistry.getCachedHealth();
}

export type { AtlasTaskType };

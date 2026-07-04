import type { ModelProfile, ModelRegistry } from "../models/types";
import { getModelProfile, listModelProfiles } from "../models/profiles";

const availability = new Map<string, boolean>();

export const modelRegistry: ModelRegistry = {
  register(profile) {
    // Runtime registration hook — persisted profiles are managed in models/profiles.
    void profile;
  },

  get(modelId) {
    const profile = getModelProfile(modelId);
    if (!profile) return undefined;
    if (availability.has(modelId)) {
      return { ...profile, available: availability.get(modelId)! };
    }
    return profile;
  },

  list(filter) {
    let models = listModelProfiles();
    if (filter?.providerId) models = models.filter((model) => model.providerId === filter.providerId);
    if (filter?.available !== undefined) {
      models = models.filter((model) => (modelRegistry.get(model.id)?.available ?? false) === filter.available);
    }
    return models.sort((left, right) => left.priority - right.priority);
  },

  setAvailability(modelId, available) {
    availability.set(modelId, available);
  },
};

export function registerModelProfile(_profile: ModelProfile): void {
  throw new Error("Dynamic model registration is not enabled — extend MODEL_PROFILES in models/profiles.ts");
}

export function getRegisteredModel(modelId: string): ModelProfile | undefined {
  return modelRegistry.get(modelId);
}

export function listRegisteredModels(filter?: { providerId?: string; available?: boolean }): ModelProfile[] {
  return modelRegistry.list(filter);
}

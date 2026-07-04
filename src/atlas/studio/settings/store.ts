import type { StudioSettings } from "../types";

type Listener = () => void;

const DEFAULT_SETTINGS: StudioSettings = {
  activeModuleId: "doughbert",
  providerStrategy: "balanced",
  language: "nl",
  qualityThreshold: 75,
  offlineMode: false,
};

let settings: StudioSettings = { ...DEFAULT_SETTINGS };
const listeners = new Set<Listener>();

export const studioSettingsStore = {
  get(): StudioSettings {
    return settings;
  },

  update(patch: Partial<StudioSettings>) {
    settings = { ...settings, ...patch };
    listeners.forEach((listener) => listener());
  },

  reset() {
    settings = { ...DEFAULT_SETTINGS };
    listeners.forEach((listener) => listener());
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

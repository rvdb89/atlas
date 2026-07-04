import { useSyncExternalStore } from "react";

import { studioSettingsStore } from "../settings/store";

export function useStudioSettings() {
  const settings = useSyncExternalStore(
    studioSettingsStore.subscribe,
    studioSettingsStore.get,
    studioSettingsStore.get,
  );

  return {
    settings,
    updateSettings: studioSettingsStore.update,
    resetSettings: studioSettingsStore.reset,
  };
}

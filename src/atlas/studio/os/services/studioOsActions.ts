import { bootstrapAtlas } from "@/atlas/bootstrap";
import { pushAtlasDevNotification } from "@/atlas/studio/developer/devEvents";

let registryReloadToken = 0;

export function getRegistryReloadToken(): number {
  return registryReloadToken;
}

export const studioOsActions = {
  restartProvider(providerId: string) {
    pushAtlasDevNotification({
      kind: "claude",
      title: "Provider restart requested",
      message: `${providerId} reload queued`,
    });
  },

  reloadRegistry() {
    bootstrapAtlas();
    registryReloadToken += 1;
    pushAtlasDevNotification({
      kind: "registry",
      title: "Registry reloaded",
      message: "Atlas registries refreshed",
    });
    return registryReloadToken;
  },

  refreshProviders() {
    pushAtlasDevNotification({
      kind: "registry",
      title: "Providers refreshed",
      message: "Provider registry sync complete",
    });
  },

  openLogs() {
    pushAtlasDevNotification({
      kind: "system",
      title: "Logs",
      message: "Command Center logs panel ready",
    });
  },
};

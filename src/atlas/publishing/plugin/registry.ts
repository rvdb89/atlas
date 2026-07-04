import type { AtlasModule } from "./types";

let activeModule: AtlasModule | null = null;
const registeredModules = new Map<string, AtlasModule>();

export function registerModule(module: AtlasModule): void {
  registeredModules.set(module.id, module);
}

export function activateModule(moduleId: string): AtlasModule {
  const module = registeredModules.get(moduleId);
  if (!module) {
    throw new Error(`Atlas module not found: ${moduleId}`);
  }
  activeModule = module;
  return module;
}

export function getActiveModule(): AtlasModule {
  if (!activeModule) {
    throw new Error("No active Atlas module. Call bootstrapAtlas() at app startup.");
  }
  return activeModule;
}

export function tryGetActiveModule(): AtlasModule | null {
  return activeModule;
}

export function listRegisteredModules(): AtlasModule[] {
  return [...registeredModules.values()];
}

/** @deprecated Use registerModule */
export const registerDomainPlugin = registerModule;
/** @deprecated Use activateModule */
export const activateDomainPlugin = activateModule;
/** @deprecated Use getActiveModule */
export const getActiveDomainPlugin = getActiveModule;
/** @deprecated Use tryGetActiveModule */
export const tryGetActiveDomainPlugin = tryGetActiveModule;
/** @deprecated Use listRegisteredModules */
export const listRegisteredPlugins = listRegisteredModules;

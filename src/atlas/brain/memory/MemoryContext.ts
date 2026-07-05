import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";

import { getActiveMemoryProviderId } from "./MemoryRegistry";
import type { MemoryContext } from "./memory.types";

export function createMemoryContext(options?: {
  moduleId?: string;
  moduleLabel?: string;
  workspace?: string;
  userId?: string;
  userLabel?: string;
  environment?: string;
}): MemoryContext {
  const activeModule = tryGetActiveModule();

  return {
    moduleId: options?.moduleId ?? activeModule?.id ?? "atlas",
    moduleLabel: options?.moduleLabel ?? activeModule?.name ?? "Atlas",
    workspace: options?.workspace ?? "Atlas Studio",
    userId: options?.userId ?? "atlas-user",
    userLabel: options?.userLabel ?? "Atlas Developer",
    environment: options?.environment ?? "development",
    activeProviderId: getActiveMemoryProviderId(),
  };
}

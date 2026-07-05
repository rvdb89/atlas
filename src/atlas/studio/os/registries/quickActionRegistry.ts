import type { StudioOsQuickAction } from "../types";
import { createRegistry } from "./createRegistry";

export const quickActionRegistry = createRegistry<StudioOsQuickAction>();

export function listQuickActions(): StudioOsQuickAction[] {
  return quickActionRegistry.list().sort((left, right) => left.label.localeCompare(right.label));
}

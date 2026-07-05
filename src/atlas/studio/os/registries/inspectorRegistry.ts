import type { InspectorPanelDefinition } from "../types";
import { createRegistry } from "./createRegistry";

export const inspectorRegistry = createRegistry<InspectorPanelDefinition>();

export function resolveInspectorPanels(pathname: string): InspectorPanelDefinition[] {
  return inspectorRegistry
    .list()
    .filter((panel) => panel.matchRoute(pathname))
    .sort((left, right) => left.order - right.order);
}

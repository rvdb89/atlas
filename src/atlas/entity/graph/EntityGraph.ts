import { getEntityGraph, rebuildGraphFromStore } from "./builder";
import type { EntityGraph } from "./types";

export type EntityGraphStore = {
  get(): EntityGraph;
  rebuild(domain?: string): EntityGraph;
};

export const entityGraphStore: EntityGraphStore = {
  get: getEntityGraph,
  rebuild: rebuildGraphFromStore,
};

export { getEntityGraph, rebuildGraphFromStore, traverseGraph, findConnectedEdges, findGraphNode } from "./builder";

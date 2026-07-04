import type { EntityRelationEdge } from "../relations/types";

export type EntityGraphNode = {
  id: string;
  entityId: string;
  slug: string;
  title: string;
  entityType: string;
  domain: string;
  category: string;
};

export type EntityGraphEdge = EntityRelationEdge & {
  sourceSlug?: string;
  targetSlug?: string;
  kind: string;
};

export type EntityGraph = {
  domain?: string;
  generatedAt: string;
  nodes: EntityGraphNode[];
  edges: EntityGraphEdge[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    avgDegree: number;
    relationKinds: string[];
  };
};

export type GraphTraversalOptions = {
  maxDepth?: number;
  relationKinds?: string[];
  direction?: "outbound" | "inbound" | "both";
};

export type GraphPath = {
  nodes: EntityGraphNode[];
  edges: EntityGraphEdge[];
  depth: number;
};

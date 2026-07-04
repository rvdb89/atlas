export type KnowledgeNodeType = "topic" | "category" | "content" | "concept" | "technique";

export type KnowledgeNode = {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  moduleId?: string;
  metadata?: Record<string, unknown>;
};

export type KnowledgeEdgeRelation =
  | "related-to"
  | "part-of"
  | "requires"
  | "leads-to"
  | "references"
  | "similar-to";

export type KnowledgeEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  relation: KnowledgeEdgeRelation;
  weight: number;
  moduleId?: string;
};

export type KnowledgeGraph = {
  generatedAt: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    avgDegree: number;
  };
};

export type KnowledgeGraphBuilderInput = {
  moduleId: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
};

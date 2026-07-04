/** Generic relation kinds — Atlas never interprets domain meaning. */
export const CORE_RELATION_KINDS = [
  "uses",
  "requires",
  "related-to",
  "part-of",
  "contains",
  "leads-to",
  "references",
  "similar-to",
  "derived-from",
  "replaces",
  "precedes",
  "follows",
] as const;

export type CoreRelationKind = (typeof CORE_RELATION_KINDS)[number];

export type RelationKindDefinition = {
  kind: string;
  label: string;
  inverseKind?: string;
  description?: string;
  directional?: boolean;
};

export type RelationKindRegistry = {
  register(definition: RelationKindDefinition): void;
  get(kind: string): RelationKindDefinition | undefined;
  list(): RelationKindDefinition[];
  isRegistered(kind: string): boolean;
};

export type EntityRelationEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  kind: string;
  weight: number;
  metadata?: Record<string, unknown>;
};

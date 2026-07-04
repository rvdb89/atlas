import { CORE_RELATION_KINDS, type RelationKindDefinition, type RelationKindRegistry } from "./types";

const kinds = new Map<string, RelationKindDefinition>();

export const relationKindRegistry: RelationKindRegistry = {
  register(definition) {
    kinds.set(definition.kind, definition);
  },

  get(kind) {
    return kinds.get(kind);
  },

  list() {
    return [...kinds.values()];
  },

  isRegistered(kind) {
    return kinds.has(kind);
  },
};

export function registerRelationKind(definition: RelationKindDefinition): void {
  relationKindRegistry.register(definition);
}

export function registerCoreRelationKinds(): void {
  for (const kind of CORE_RELATION_KINDS) {
    registerRelationKind({
      kind,
      label: kind,
      directional: true,
    });
  }
}

export function isRelationKindRegistered(kind: string): boolean {
  return relationKindRegistry.isRegistered(kind);
}

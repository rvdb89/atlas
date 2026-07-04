import type { EntityTypeSchema, SchemaRegistry } from "./types";

const schemas = new Map<string, EntityTypeSchema>();

export const entitySchemaRegistry: SchemaRegistry = {
  register(schema) {
    schemas.set(schema.typeId, schema);
  },

  get(typeId) {
    return schemas.get(typeId);
  },

  list(domain?: string) {
    const all = [...schemas.values()];
    return domain ? all.filter((schema) => !schema.domain || schema.domain === domain) : all;
  },

  has(typeId) {
    return schemas.has(typeId);
  },
};

export function registerEntitySchema(schema: EntityTypeSchema): void {
  entitySchemaRegistry.register(schema);
}

export function getEntitySchema(typeId: string): EntityTypeSchema | undefined {
  return entitySchemaRegistry.get(typeId);
}

export function listEntitySchemas(domain?: string): EntityTypeSchema[] {
  return entitySchemaRegistry.list(domain);
}

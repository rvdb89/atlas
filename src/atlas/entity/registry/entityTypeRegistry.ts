import type { EntityModuleRegistration, EntityTypeRegistration, EntityTypeRegistry } from "./types";
import { registerEntitySchema } from "../schemas/registry";

const types = new Map<string, EntityTypeRegistration>();
const modules = new Map<string, EntityModuleRegistration>();

export const entityTypeRegistry: EntityTypeRegistry = {
  register(registration) {
    types.set(registration.typeId, registration);
    if (registration.schema) {
      registerEntitySchema(registration.schema);
    }
  },

  unregister(typeId) {
    types.delete(typeId);
  },

  get(typeId) {
    return types.get(typeId);
  },

  list(moduleId?: string) {
    const all = [...types.values()];
    return moduleId ? all.filter((entry) => entry.moduleId === moduleId) : all;
  },

  has(typeId) {
    return types.has(typeId);
  },
};

export function registerEntityType(registration: EntityTypeRegistration): void {
  entityTypeRegistry.register(registration);
}

export function registerEntityModule(registration: EntityModuleRegistration): void {
  modules.set(registration.moduleId, registration);

  for (const entityType of registration.entityTypes) {
    registerEntityType({
      ...entityType,
      moduleId: registration.moduleId,
    });
  }
}

export function getEntityModuleRegistration(moduleId: string): EntityModuleRegistration | undefined {
  return modules.get(moduleId);
}

export function listRegisteredEntityTypes(moduleId?: string): EntityTypeRegistration[] {
  return entityTypeRegistry.list(moduleId);
}

export function isEntityTypeRegistered(typeId: string): boolean {
  return entityTypeRegistry.has(typeId);
}

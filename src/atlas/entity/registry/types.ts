import type { EntityTypeSchema } from "../schemas/types";

export type EntityTypeRegistration = {
  typeId: string;
  label: string;
  moduleId?: string;
  schema?: EntityTypeSchema;
  metadata?: Record<string, unknown>;
};

export type EntityTypeRegistry = {
  register(registration: EntityTypeRegistration): void;
  unregister(typeId: string): void;
  get(typeId: string): EntityTypeRegistration | undefined;
  list(moduleId?: string): EntityTypeRegistration[];
  has(typeId: string): boolean;
};

export type EntityModuleRegistration = {
  moduleId: string;
  domain: string;
  entityTypes: EntityTypeRegistration[];
  attributeKeys?: string[];
  relationKinds?: string[];
};

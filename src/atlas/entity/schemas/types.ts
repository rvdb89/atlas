import type { EntityDifficulty, EntityStatus, EntityVisibility } from "../core/types";

export type EntityFieldRequirement = {
  field: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
};

export type EntityTypeSchema = {
  typeId: string;
  label: string;
  description?: string;
  domain?: string;
  allowedStatuses?: EntityStatus[];
  defaultStatus?: EntityStatus;
  defaultVisibility?: EntityVisibility;
  allowedDifficulties?: EntityDifficulty[];
  requiredFields?: EntityFieldRequirement[];
  allowedRelationKinds?: string[];
  allowedAttributeKeys?: string[];
  version: string;
};

export type SchemaRegistry = {
  register(schema: EntityTypeSchema): void;
  get(typeId: string): EntityTypeSchema | undefined;
  list(domain?: string): EntityTypeSchema[];
  has(typeId: string): boolean;
};

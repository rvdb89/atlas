import { registerAttributeDefinition } from "./attributes/registry";
import { registerCoreRelationKinds } from "./relations/registry";
import { registerEntitySchema } from "./schemas/registry";
import { registerEntityType } from "./registry/entityTypeRegistry";
import { CORE_ENTITY_TYPES } from "./types";
import type { EntityTypeSchema } from "./schemas/types";

let bootstrapped = false;

const CORE_ATTRIBUTES = [
  { key: "hydration", label: "Hydration", kind: "percentage" as const, unit: "%" },
  { key: "weight", label: "Weight", kind: "weight" as const },
  { key: "temperature", label: "Temperature", kind: "temperature" as const, unit: "°C" },
  { key: "protein", label: "Protein", kind: "percentage" as const, unit: "%" },
  { key: "time", label: "Time", kind: "duration" as const },
  { key: "origin", label: "Origin", kind: "string" as const },
  { key: "color", label: "Color", kind: "string" as const },
  { key: "texture", label: "Texture", kind: "string" as const },
  { key: "difficulty-level", label: "Difficulty Level", kind: "enum" as const, enumValues: ["beginner", "intermediate", "advanced", "expert"] },
];

function buildCoreSchema(typeId: string): EntityTypeSchema {
  return {
    typeId,
    label: typeId,
    description: `Core Atlas entity type: ${typeId}`,
    defaultStatus: "draft",
    defaultVisibility: "private",
    requiredFields: [
      { field: "title", required: true },
      { field: "slug", required: true },
      { field: "description", required: true },
      { field: "category", required: true },
    ],
    version: "1.0.0",
  };
}

export function bootstrapAtlasEntity(): void {
  if (bootstrapped) return;

  registerCoreRelationKinds();

  for (const attribute of CORE_ATTRIBUTES) {
    registerAttributeDefinition(attribute);
  }

  for (const typeId of CORE_ENTITY_TYPES) {
    const schema = buildCoreSchema(typeId);
    registerEntitySchema(schema);
    registerEntityType({
      typeId,
      label: typeId,
      schema,
    });
  }

  bootstrapped = true;
}

export function isAtlasEntityBootstrapped(): boolean {
  return bootstrapped;
}

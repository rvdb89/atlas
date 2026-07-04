import type {
  AtlasEntity,
  EntityDraft,
  EntityPatch,
  EntityValidationIssue,
  EntityValidationResult,
} from "../core/types";
import { attributeRegistry } from "../attributes/registry";
import { getEntitySchema } from "../schemas/registry";
import { entityExistsBySlug, getEntityById } from "../registry/entityStore";
import { isEntityTypeRegistered } from "../registry/entityTypeRegistry";
import { isRelationKindRegistered } from "../relations/registry";
import { isValidSlug } from "../utils/slug";
import { isVersionDowngrade } from "../utils/version";

function issue(
  code: string,
  message: string,
  severity: EntityValidationIssue["severity"] = "error",
  field?: string,
): EntityValidationIssue {
  return { code, message, severity, field };
}

function validateRequiredFields(entity: AtlasEntity | EntityDraft): EntityValidationIssue[] {
  const issues: EntityValidationIssue[] = [];
  const required: Array<keyof AtlasEntity> = [
    "slug",
    "title",
    "description",
    "entityType",
    "domain",
    "category",
  ];

  for (const field of required) {
    const value = entity[field];
    if (value === undefined || value === null || value === "") {
      issues.push(issue("missing-field", `Missing required field: ${field}`, "error", field));
    }
  }

  return issues;
}

function validateSchema(entity: AtlasEntity | EntityDraft): EntityValidationIssue[] {
  const schema = getEntitySchema(entity.entityType);
  if (!schema) return [];

  const issues: EntityValidationIssue[] = [];

  if (schema.domain && entity.domain !== schema.domain) {
    issues.push(
      issue(
        "domain-mismatch",
        `Entity domain "${entity.domain}" does not match schema domain "${schema.domain}"`,
        "error",
        "domain",
      ),
    );
  }

  if (schema.allowedStatuses && !schema.allowedStatuses.includes(entity.status)) {
    issues.push(issue("invalid-status", `Status "${entity.status}" not allowed for type.`, "error", "status"));
  }

  for (const requirement of schema.requiredFields ?? []) {
    const value = (entity as Record<string, unknown>)[requirement.field];
    if (requirement.required && (value === undefined || value === null || value === "")) {
      issues.push(
        issue("schema-required", `Schema requires field: ${requirement.field}`, "error", requirement.field),
      );
    }
  }

  for (const relation of entity.relations ?? []) {
    if (schema.allowedRelationKinds && !schema.allowedRelationKinds.includes(relation.kind)) {
      issues.push(
        issue(
          "relation-not-allowed",
          `Relation kind "${relation.kind}" not allowed for entity type.`,
          "warning",
          "relations",
        ),
      );
    }
  }

  for (const key of Object.keys(entity.attributes ?? {})) {
    if (schema.allowedAttributeKeys && !schema.allowedAttributeKeys.includes(key)) {
      issues.push(
        issue("attribute-not-allowed", `Attribute "${key}" not allowed for entity type.`, "warning", "attributes"),
      );
    }
    if (!attributeRegistry.validateKey(key, entity.domain)) {
      issues.push(issue("attribute-domain", `Attribute "${key}" invalid for domain.`, "warning", "attributes"));
    }
  }

  return issues;
}

export function validateEntity(
  entity: AtlasEntity | EntityDraft,
  options?: { excludeId?: string; previousVersion?: number },
): EntityValidationResult {
  const issues: EntityValidationIssue[] = [
    ...validateRequiredFields(entity),
    ...validateSchema(entity),
  ];

  if (!isEntityTypeRegistered(entity.entityType)) {
    issues.push(issue("unknown-entity-type", `Entity type "${entity.entityType}" is not registered.`, "error", "entityType"));
  }

  if (!isValidSlug(entity.slug)) {
    issues.push(issue("invalid-slug", "Slug must be lowercase alphanumeric with hyphens.", "error", "slug"));
  }

  if (entityExistsBySlug(entity.domain, entity.slug, options?.excludeId ?? entity.id)) {
    issues.push(issue("duplicate-slug", `Slug "${entity.slug}" already exists in domain "${entity.domain}".`, "error", "slug"));
  }

  for (const relation of entity.relations ?? []) {
    if (!relation.targetId?.trim()) {
      issues.push(issue("relation-target-missing", "Relation targetId is required.", "error", "relations"));
    }
    if (!isRelationKindRegistered(relation.kind)) {
      issues.push(
        issue("unknown-relation-kind", `Relation kind "${relation.kind}" is not registered.`, "warning", "relations"),
      );
    }
    if (relation.targetId && entity.id && relation.targetId === entity.id) {
      issues.push(issue("self-relation", "Entity cannot relate to itself.", "error", "relations"));
    }
    const target = getEntityById(relation.targetId);
    if (relation.targetId && !target && !relation.targetSlug) {
      issues.push(
        issue("relation-target-not-found", `Relation target "${relation.targetId}" not found.`, "warning", "relations"),
      );
    }
  }

  if (entity.version !== undefined && options?.previousVersion !== undefined) {
    if (isVersionDowngrade(options.previousVersion, entity.version)) {
      issues.push(issue("version-downgrade", "Entity version cannot decrease.", "error", "version"));
    }
  }

  if (!entity.tags || entity.tags.length === 0) {
    issues.push(issue("missing-tags", "At least one tag is recommended.", "warning", "tags"));
  }

  return {
    valid: !issues.some((entry) => entry.severity === "error"),
    issues,
  };
}

export function assertValidEntity(entity: AtlasEntity | EntityDraft, options?: { excludeId?: string }): void {
  const result = validateEntity(entity, options);
  if (!result.valid) {
    throw new Error(
      `Entity validation failed: ${result.issues.filter((i) => i.severity === "error").map((i) => i.message).join("; ")}`,
    );
  }
}

/**
 * Platform-level entity type identifiers.
 * Vertical modules register additional types — core never encodes domain semantics.
 */
export const CORE_ENTITY_TYPES = [
  "knowledge",
  "recipe",
  "tip",
  "ingredient",
  "technique",
  "tool",
  "product",
  "video",
  "course",
  "image",
  "faq",
  "visual",
  "learning-path",
  "ai-output",
] as const;

export type CoreEntityTypeId = (typeof CORE_ENTITY_TYPES)[number];

export const CORE_ENTITY_STATUSES = ["draft", "review", "published", "archived", "deprecated"] as const;

export const CORE_ENTITY_VISIBILITIES = ["public", "private", "unlisted", "internal"] as const;

export const CORE_ENTITY_DIFFICULTIES = ["beginner", "intermediate", "advanced", "expert"] as const;

export function createEntityId(prefix = "ent"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createRelationId(sourceId: string, kind: string, targetId: string): string {
  return `rel-${sourceId}-${kind}-${targetId}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

export function createMediaId(entityId: string, role = "media"): string {
  return `${entityId}-${role}-${Math.random().toString(36).slice(2, 6)}`;
}

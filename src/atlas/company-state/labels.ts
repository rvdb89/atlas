import type { DepartmentId, EntityStatus, SprintLifecycle } from "./types";

/** Sprint 2.2a · the four ratified departments — see `@/atlas/team/department.types`'s
 * `RATIFIED_DEPARTMENTS` for the canonical id/label source. Hand-duplicated here as a
 * `Record<DepartmentId, string>` (same pattern this file already uses elsewhere) so that a
 * missing label is a compile error, not a silent gap. */
export const DEPARTMENT_LABELS: Record<DepartmentId, string> = {
  engineering: "Engineering",
  publishing: "Publishing",
  "customer-contact": "Customer Contact",
  "signal-research": "Signal & Research",
};

export function entityStatusLabel(status: EntityStatus): string {
  const labels: Record<EntityStatus, string> = {
    healthy: "Healthy",
    attention: "Attention",
    critical: "Critical",
    idle: "Idle",
    active: "Active",
    pending: "Pending",
    planning: "Planning",
    /** Sprint 2.2a · honest label for an entity (currently: a department) with no real
     * operational signal — never "Healthy", never a fabricated score. */
    "no-signal": "No signal yet",
  };
  return labels[status];
}

export function sprintLifecycleLabel(lifecycle: SprintLifecycle): string {
  const labels: Record<SprintLifecycle, string> = {
    running: "Running",
    completed: "Complete",
    blocked: "Blocked",
    waiting_approval: "Waiting approval",
  };
  return labels[lifecycle];
}

export function sprintLifecycleStatus(lifecycle: SprintLifecycle): EntityStatus {
  const map: Record<SprintLifecycle, EntityStatus> = {
    running: "active",
    completed: "healthy",
    blocked: "critical",
    waiting_approval: "pending",
  };
  return map[lifecycle];
}

export function healthToEntityStatus(health: number): EntityStatus {
  if (health >= 80) return "healthy";
  if (health >= 60) return "attention";
  return "critical";
}

export function platformComponentLabel(score: number): string {
  if (score >= 90) return "Operational";
  if (score >= 75) return "Available";
  return "Needs attention";
}

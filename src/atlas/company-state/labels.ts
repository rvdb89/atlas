import type { DepartmentId, EntityStatus, SprintLifecycle } from "./types";

export const DEPARTMENT_LABELS: Record<DepartmentId, string> = {
  engineering: "Engineering",
  operations: "Operations",
  marketing: "Marketing",
  design: "Design",
  product: "Product",
  intelligence: "Intelligence",
  memory: "Memory",
  quality: "Quality",
  planning: "Planning",
  research: "Research",
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

/**
 * The Room — Prototype 1 object identifiers.
 *
 * Only objects that Sprint 14 ("The Room — Version 1") actually ratified,
 * and only the ones the Atlas Build brief explicitly asks to be navigable:
 * Heart, CEO Inbox (Threshold Stone), AI Tools (Small Hollow), and Company
 * Doorways (Archway Recess). Departments are visible but not individually
 * navigable in Prototype 1 — the brief does not ask for that, so it is not
 * invented here.
 */
export type RoomObjectId =
  | "heart"
  | "inbox"
  | "tools"
  | "doorway-left"
  | "doorway-right";

export type DepartmentId = "engineering" | "sales" | "finance" | "operations";

export type DepartmentState = "calm" | "elevated";

export interface DepartmentSpec {
  id: DepartmentId;
  label: string;
  state: DepartmentState;
}

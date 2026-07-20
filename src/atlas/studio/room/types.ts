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
import type { RatifiedDepartmentId } from "@/atlas/team/department.types";

export type RoomObjectId =
  | "heart"
  | "inbox"
  | "tools"
  | "doorway-left"
  | "doorway-right";

/**
 * The two Company Doorways, narrowed from `RoomObjectId` — Sprint 21
 * ("First Company"). Not a new object type: the same two ids the Archway
 * Recess objects already used, just named so `enteredCompany` state can be
 * typed precisely.
 */
export type DoorwayId = Extract<RoomObjectId, "doorway-left" | "doorway-right">;

/** Sprint 2.2a · alias of the one canonical department model — see
 * `@/atlas/team/department.types`'s `RatifiedDepartmentId`. Sprint 2.2 had widened this to a
 * plain `string` because the department source was still an open-ended, unratified set; now
 * that Sprint 2.2a makes Atlas Control's own `DepartmentOperation[]` always exactly the four
 * ratified departments, The Room can (and should) consume that same closed type directly
 * instead of a permissive `string` — this is a type-only tightening, not a new mapping: The
 * Room still contains no organization logic of its own, it only narrows what it accepts from
 * `src/atlas/studio/control/types.ts`. The Wall's own `space-between` layout already
 * generalizes to any number of departments without further changes. */
export type DepartmentId = RatifiedDepartmentId;

export type DepartmentState = "calm" | "elevated";

export interface DepartmentSpec {
  id: DepartmentId;
  label: string;
  state: DepartmentState;
}

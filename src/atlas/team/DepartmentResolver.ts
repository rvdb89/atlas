import type { TeamIdentityId } from "./team.types";
import { resolveTeamIdentityId } from "./TeamIdentityResolver";
import type { RatifiedDepartmentId } from "./department.types";

/**
 * DepartmentResolver — Sprint 2.2a.
 *
 * Second link in the resolution chain `CoreAgentId → TeamIdentityId → RatifiedDepartmentId`.
 * The first link (existing/operational id → TeamIdentityId) already exists and is untouched —
 * see TeamIdentityResolver.ts's `resolveTeamIdentityId()`, ratified in Sprint 1.1. This file
 * only adds the second link, team identity → department, and a convenience function that
 * walks the full chain in one call.
 *
 * Every one of the five canonical team identities maps to exactly one department — this is a
 * total map, unlike `resolveTeamIdentityId()`, which legitimately returns null for ids that
 * have no team identity at all (e.g. "branch-director").
 */
const TEAM_IDENTITY_TO_DEPARTMENT: Readonly<Record<TeamIdentityId, RatifiedDepartmentId>> = {
  tom: "engineering",
  anna: "publishing",
  yara: "publishing",
  scout: "signal-research",
  jerry: "customer-contact",
};

export function departmentForTeamIdentity(identity: TeamIdentityId): RatifiedDepartmentId {
  return TEAM_IDENTITY_TO_DEPARTMENT[identity];
}

/**
 * Full chain for one operational/existing id: existingId → TeamIdentityId → RatifiedDepartmentId.
 * Returns null when the id has no team identity — this is a correct, honest result, not a gap
 * to silently paper over. `branch-director` is the confirmed example: it is Atlas' own
 * reasoning identity, not a department member (see TeamIdentityResolver.ts's own comment and
 * the Sprint 1.4-correctie's Department Management principle — "Atlas stuurt afdelingen aan",
 * Atlas itself is not a department). Callers must not invent a department for a null result.
 */
export function departmentForOperationalId(existingId: string): RatifiedDepartmentId | null {
  const identity = resolveTeamIdentityId(existingId);
  if (!identity) return null;
  return departmentForTeamIdentity(identity);
}

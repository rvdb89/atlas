import type { TeamIdentity, TeamIdentityId } from "./team.types";

/**
 * TeamIdentityResolver — Sprint 1.1.
 *
 * The static list of the five canonical team identities, plus a pure, additive mapping from
 * ids that already exist elsewhere in the codebase to one of those five. Neither
 * ATLAS_AI_TEAM (src/atlas/agents/team.ts) nor the Organization Model
 * (src/atlas/organization/**) is imported or modified here — this is a plain string-to-string
 * lookup table, so this module stays purely additive. See
 * ATLAS_SPRINT_1.1_IMPLEMENTATION_PLAN.md §2 for the reasoning behind each mapping.
 */

export const TEAM_IDENTITIES: readonly TeamIdentity[] = [
  {
    id: "tom",
    name: "Tom",
    responsibility: "Engineering — voert toegewezen code-uitvoering uit binnen vooraf gestelde grenzen.",
  },
  {
    id: "anna",
    name: "Anna",
    responsibility: "Content & verhaal — schrijft wat naar buiten mag.",
  },
  {
    id: "scout",
    name: "Scout",
    responsibility: "Signalering — brengt vroege signalen over wat er buiten verandert.",
  },
  {
    id: "yara",
    name: "Yara",
    responsibility: "Kwaliteit & review — controleert werk voordat het verder mag.",
  },
  {
    id: "jerry",
    name: "Jerry",
    responsibility: "Klantcontact — handelt afgebakende klantvragen af.",
  },
] as const;

export function listTeamIdentities(): readonly TeamIdentity[] {
  return TEAM_IDENTITIES;
}

export function getTeamIdentity(id: TeamIdentityId): TeamIdentity {
  const identity = TEAM_IDENTITIES.find((item) => item.id === id);
  if (!identity) {
    // Unreachable while TeamIdentityId stays a closed union matching TEAM_IDENTITIES — a
    // thrown error here is a signal that the two have drifted out of sync.
    throw new Error(`Unknown team identity id: ${id}`);
  }
  return identity;
}

/** Additive, read-only mapping from ids that already exist elsewhere in the codebase — Baker's
 * "copywriter", the Organization Model's fictional "claude-engineer", and so on — to one of
 * the five canonical team identities. Returns null when there is no natural match; never a
 * forced guess. `branch-director` is intentionally absent: it is Atlas' own reasoning
 * identity, not a team member. Departments/ids without a clean match (operations,
 * personal-assistance, finance, knowledge) are intentionally absent too. */
const EXISTING_ID_TO_TEAM_IDENTITY: Readonly<Record<string, TeamIdentityId>> = {
  // ATLAS_AI_TEAM (src/atlas/agents/team.ts) — CoreAgentId
  copywriter: "anna",
  "visual-designer": "anna",
  "fact-checker": "yara",
  "domain-validator": "yara",
  translator: "yara",
  "link-engine": "yara",

  // Organization Model (src/atlas/organization/OrganizationalModel.ts) — fictional workerId
  "claude-engineer": "tom",
  "platform-architect": "tom",
  "trend-analyst": "scout",
  "data-researcher": "scout",
  "qa-reviewer": "yara",
  "audit-specialist": "yara",
};

export function resolveTeamIdentityId(existingId: string): TeamIdentityId | null {
  return EXISTING_ID_TO_TEAM_IDENTITY[existingId] ?? null;
}

/**
 * Team Identity Foundation — Sprint 1.1. Public barrel.
 *
 * Exports the shared vocabulary/schema (team.types.ts), the canonical identity list and
 * resolver (TeamIdentityResolver.ts), and the verified-outcome recording functions
 * (TeamAttribution.ts). Does not export any assignment-related functionality — there is none
 * in this sprint; assignments belong to the Organization Model. See
 * ATLAS_SPRINT_1.1_IMPLEMENTATION_PLAN.md for the full architecture.
 *
 * Sprint 2.2a adds the ratified department model and its resolver
 * (department.types.ts, DepartmentResolver.ts) — the canonical
 * CoreAgentId → TeamIdentityId → RatifiedDepartmentId chain.
 */
export * from "./team.types";
export * from "./TeamIdentityResolver";
export * from "./TeamAttribution";
export * from "./department.types";
export * from "./DepartmentResolver";

/**
 * Ratified Department Model — Sprint 2.2a ("Department Source-of-Truth Alignment").
 *
 * The four departments the CEO ratified in the Sprint 1.4-correctie ("Atlas stuurt
 * afdelingen aan. Afdelingen sturen specialisten aan.", see ATLAS_BUILD_ROADMAP.md, Fase 1 §
 * "Aanvulling — Department Management-principe"): Engineering (Tom), Publishing (Anna, Yara),
 * Customer Contact (Jerry), Signal/Research (Scout).
 *
 * This is the one canonical, typed department model every runtime/UI layer must consume —
 * stable machine-readable ids with separate display names, so presentation can change without
 * touching aggregation, and aggregation can change without touching presentation. It lives
 * here, in the shared team/organization layer, not in a UI component, per the sprint brief.
 *
 * Deliberately NOT the same thing as `TeamIdentityId` (five people: tom/anna/scout/yara/jerry)
 * or `CoreAgentId` (seven operational agent ids) — see DepartmentResolver.ts for how those two
 * chain into this one. Multiple team identities can resolve to the same department (anna and
 * yara both → publishing) without losing per-agent observability upstream.
 */

export type RatifiedDepartmentId =
  | "engineering"
  | "publishing"
  | "customer-contact"
  | "signal-research";

export type RatifiedDepartment = {
  id: RatifiedDepartmentId;
  label: string;
};

export const RATIFIED_DEPARTMENTS: Readonly<Record<RatifiedDepartmentId, RatifiedDepartment>> = {
  engineering: { id: "engineering", label: "Engineering" },
  publishing: { id: "publishing", label: "Publishing" },
  "customer-contact": { id: "customer-contact", label: "Customer Contact" },
  "signal-research": { id: "signal-research", label: "Signal & Research" },
};

/** Stable iteration order — every consumer that must always show all four departments (e.g.
 * the real aggregation pipeline, tests) should iterate this array rather than `Object.keys()`,
 * so the order stays deterministic and intentional. */
export const RATIFIED_DEPARTMENT_IDS: readonly RatifiedDepartmentId[] = [
  "engineering",
  "publishing",
  "customer-contact",
  "signal-research",
];

export function listRatifiedDepartments(): readonly RatifiedDepartment[] {
  return RATIFIED_DEPARTMENT_IDS.map((id) => RATIFIED_DEPARTMENTS[id]);
}

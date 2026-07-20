/**
 * ADR-001 — Canonical CEO surface marker.
 *
 * See `ATLAS_ARCHITECTURE_DECISIONS.md` (ADR-001, Sprint 4.1) for the full ratified
 * decision. Summary: The Room is the canonical CEO-facing Atlas surface; Atlas Control
 * is a transitional implementation being migrated into it (Sprint 4.2 and beyond).
 *
 * This is the single source of truth for which route is which, so that decision does
 * not silently drift back into two hardcoded strings living in unrelated files. Any
 * code that needs to navigate to "the CEO surface" — canonical or transitional —
 * should reference this constant instead of writing the path literal again.
 *
 * Do not add new CEO-facing capability exclusively to the transitional route. Build it
 * for the canonical route, or defer it — per ADR-001, point 6.
 */
export const CEO_SURFACE_ROUTES = {
  /** The Room — the single canonical CEO-facing Atlas surface. */
  canonical: "/atlas",
  /** Atlas Control — transitional, being migrated into the canonical surface. */
  transitional: "/studio/control",
} as const;

export type CeoSurfaceRole = keyof typeof CEO_SURFACE_ROUTES;

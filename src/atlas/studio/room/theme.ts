/**
 * The Room — materialization tokens.
 *
 * Translates the ratified Sprint 5 materialization ("Polished Limestone" +
 * "Ember" warmth, `ATLAS_SPRINT_LOG.md`) into concrete values for a React
 * implementation. This does not redesign the materialization — it gives the
 * already-decided qualitative description (neutral-warm stone, borderless
 * ember warmth, no gradients/blend-modes) a literal value so components can
 * use it consistently.
 *
 * Flat, layered opacity is used everywhere instead of gradients — the
 * proven-safe rendering technique established in Sprint 9's correction
 * (`ATLAS_SPRINT_LOG.md`, "Correctie (zelfde dag)").
 */

export const ROOM_COLORS = {
  // The void the Room sits in — not part of the architecture itself.
  void: "#211D18",

  // Polished Limestone — wall.
  wallBase: "#DCD5C6",
  wallMid: "#C9C0AC",
  wallDeep: "#A89C82",

  // Polished Limestone — floor (harder, more definitive than the wall).
  floorBase: "#B7AE9A",
  floorMid: "#A69C86",
  floorDeep: "#8F8770",

  // Stone shadow / recess depth (Archway Recess, Small Hollow aperture).
  stoneShadow: "#4A4438",
  stoneDark: "#332E25",

  // Ember — the one warmth source, never a second one.
  emberCore: "#F4B67A",
  emberWarm: "#EA8C46",
  emberDeep: "#C4661F",

  // Company Health — same ember light, read as ambient field.
  ambientWarm: "rgba(234, 140, 70, 0.14)",
  ambientCore: "rgba(244, 182, 122, 0.10)",

  // Shared overlay backdrop — one value, reused by every overlay in The
  // Room (generic placeholder, Conversation Space) so darkening the room
  // behind an open object never drifts into a second, slightly different
  // shade per component.
  backdrop: "rgba(33, 29, 24, 0.72)",
} as const;

export const ROOM_RADIUS = {
  stage: 28,
  wall: 22,
  object: 14,
} as const;

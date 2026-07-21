/**
 * The Room — materialization tokens.
 *
 * Phase 5.5 ("Jarvis Visual Identity"): this is the explicit revisiting of
 * Sprint 5's materialization gate ("Geen nieuwe materiaalstudies of
 * steensoorten totdat hier expliciet op wordt teruggekomen" —
 * `ATLAS_SPRINT_LOG.md`). The CEO's brief names this sprint as exactly that
 * return visit, scoped to visual identity only: colours, materials, light.
 *
 * "Polished Limestone + Ember" is retired. The Room is re-materialized as a
 * near-black volume lit by a single electric-blue energy source — glass and
 * projected light instead of carved stone and firelight. Every key below is
 * unchanged (nothing that reads `ROOM_COLORS.xxx` had to change its own
 * code) — only what each key resolves to. This is deliberate: every object
 * component in The Room (Heart, Archway Recess, Threshold Stone, Department
 * Wall, Small Hollow) is already 100% token-driven, so redefining the values
 * here — not the keys — cascades the new materialization everywhere at
 * once, exactly the way a change in real lighting would.
 *
 * Flat, layered opacity is still used instead of gradients/blur (no such
 * library is part of this app) — depth and "glass" now come from opacity
 * layering plus a shared subtle border + soft shadow (`glassBorder`,
 * applied per-panel), the same proven-safe technique Sprint 9 established,
 * carried into a much darker, much more luminous register.
 */

export const ROOM_COLORS = {
  // The void the Room sits in — no longer warm dark wood, now near-absolute
  // black. Not part of the architecture itself; still the frame everything
  // else is judged against.
  void: "#03050A",

  // Structural glass — wall. Deep graphite, not stone; reads as material
  // only where light from the Heart or a Department reaches it.
  wallBase: "#0F151D",
  wallMid: "#0B1017",
  wallDeep: "#070B10",

  // Structural glass — floor (denser, slightly darker than the wall).
  floorBase: "#0A0F16",
  floorMid: "#070B10",
  floorDeep: "#04070B",

  // Recess / depth shadow (Archway Recess, Small Hollow aperture) — where
  // the light does not reach at all.
  stoneShadow: "#04070B",
  stoneDark: "#010305",

  // Energy — the one light source in the Room, never a second one. Electric
  // blue replaces ember warmth as the single channel every judgment-driven
  // property (Heart vitality, Department warmth, Doorway presence, Focus
  // urgency) still expresses through — same relationship, new register.
  emberCore: "#CFF3FF",
  emberWarm: "#2FB8FF",
  emberDeep: "#1690D9",

  // Company Health — same energy, read as ambient field.
  ambientWarm: "rgba(47, 184, 255, 0.10)",
  ambientCore: "rgba(207, 243, 255, 0.06)",

  // Shared overlay backdrop — one value, reused by every overlay in The
  // Room so darkening the room behind an open object never drifts into a
  // second, slightly different shade per component.
  backdrop: "rgba(2, 4, 8, 0.88)",

  // New (Phase 5.5) — the dark materialization needs its own text and glass
  // edge tokens; the previous design never did, because ink-on-limestone
  // read correctly without one. Still exactly one value per purpose, reused
  // everywhere, the same discipline as every token above.
  textPrimary: "#EAF6FC",
  textSecondary: "#7C93A8",
  textMuted: "#4A5A6A",
  glassBorder: "rgba(143, 227, 255, 0.14)",
} as const;

export const ROOM_RADIUS = {
  stage: 28,
  wall: 22,
  object: 14,
} as const;

import { Easing } from "react-native";

/**
 * The Room — Sprint 15 "Living Room" motion language.
 *
 * One shared rhythm, not five separately tuned animations. Two constant
 * sets, each internally 100% uniform:
 *
 * - `TRANSITION` governs every Soft State Transition (first entrance,
 *   opening/closing a placeholder). Every one of those moments uses the
 *   exact same duration and easing — never faster or slower depending on
 *   which object or what Atlas has judged.
 *
 * - `TOUCH` governs the Uniform Object Touch Response only. It is
 *   deliberately faster than `TRANSITION`: touch feedback that took 420ms
 *   would read as laggy, which would undermine the sprint's own goal
 *   (software should feel immediately responsive to touch). It is still a
 *   single, uniform constant — every interactive object in The Room uses
 *   it identically. Two separate numbers, not two different standards.
 *
 * Neither constant is ever selected conditionally on department state,
 * warmth, or any judgment value — that is what keeps both firmly outside
 * the Rendering Law's jurisdiction (see the Sprint 15 verification note in
 * `ATLAS_SPRINT_LOG.md`).
 *
 * - `APPROACH` governs the state change when the CEO approaches the
 *   Heart (Sprint 18, "The Awakening"). This is the v2 correction values:
 *   a subtle whole-stage scale (`scale`), a mild recession of everything
 *   that isn't the Heart (`peripheryOpacity`), and three bounded glow
 *   circles around the Heart (`glow`), reusing the Heart's own proven
 *   layered-circle technique at room scale rather than a gradient or a
 *   flat-rectangle vignette (the v1 attempt, which produced visible
 *   rectangular bands — see the Sprint 18 v2 note in `ATLAS_SPRINT_LOG.md`).
 *   `approached` uses the same `useRoomTransition`/`ROOM_MOTION.TRANSITION`
 *   timing every other state change in The Room uses — deliberately not a
 *   separate stopwatch.
 *
 *   Sprint 19 ("Spatial Presence") and Sprint 20 ("The Room Receives
 *   Light") each tried a different mechanism here — depth-parallax on the
 *   Heart itself, then a uniform room-wide light wash. Manual review found
 *   both less legible than this v2 result. Neither was ratified; both have
 *   been reverted. This is the version review confirmed clearly worked,
 *   restored deliberately in place of further parameter tuning.
 *
 * - `REVEAL` governs Sprint 23's correction ("The Room unfolds"). Before
 *   the CEO activates the Heart, everything that represents actual company
 *   state — departments, their warmth, the floor objects, Ambient Company
 *   Health — sits at this one, single, barely-there opacity, never at 0
 *   (nothing is unmounted or deleted, so nothing needs a separate entrance
 *   later). The Heart and the Room's own architecture are exempt and never
 *   reference this constant. `dormant` is the only number; everything it
 *   gates shares the same `approachProgress` interpolation
 *   (`dormant → 1`), so there is exactly one reveal, not one per object.
 */
export const ROOM_MOTION = {
  TRANSITION: {
    duration: 420,
    easing: Easing.out(Easing.cubic),
  },
  TOUCH: {
    duration: 140,
    easing: Easing.out(Easing.quad),
    scale: 1.015,
  },
  APPROACH: {
    scale: 1.02,
    peripheryOpacity: 0.82,
    glow: {
      outer: 0.05,
      mid: 0.08,
      inner: 0.12,
    },
  },
  REVEAL: {
    dormant: 0.06,
  },
} as const;

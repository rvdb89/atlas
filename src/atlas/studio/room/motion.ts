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
 *
 * Phase 5.5 ("Jarvis Visual Identity") correction: `TRANSITION` is slowed
 * and re-eased — 420ms `out(cubic)` read correctly for stone settling into
 * place, but the brief calls for materialization: "appear, glow, stabilize,
 * fade, dissolve... nothing should simply pop in." A cinematic ease-out
 * (steep at first, a long soft settle at the tail) reads as light arriving,
 * not a mechanical animation curve completing. Every consumer of
 * `ROOM_MOTION.TRANSITION` (all Soft State Transitions, the Executive
 * Briefing's own appear/disappear beat) inherits this from the one shared
 * constant, unchanged in every other respect — still never a second timing
 * system. `TOUCH` is untouched: touch feedback must stay immediately
 * responsive, which is a different, deliberately-faster register this
 * sprint has no reason to slow down.
 *
 * `BREATHE` is new: the Heart's one continuous, idle motion — "subtle
 * pulse... light breathing... energy rather than decoration" per the
 * brief. It is a slow, uniform loop, never selected conditionally on
 * judgment (same discipline as `TRANSITION`/`TOUCH` above) — vitality still
 * decides how bright and how present the Heart is; `BREATHE` only decides
 * that it is quietly alive while it waits, the way a screen's own backlight
 * never itself carries information.
 */
export const ROOM_MOTION = {
  TRANSITION: {
    duration: 560,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
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
  BREATHE: {
    duration: 2600,
    easing: Easing.inOut(Easing.sin),
    amplitude: 0.05,
  },
} as const;

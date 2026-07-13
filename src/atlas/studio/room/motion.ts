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
} as const;

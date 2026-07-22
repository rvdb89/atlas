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
 *
 * `ORBIT` is new (Phase 5.7, "Atlas Is The Product") — the Heart's one
 * continuous rotational motion, never selected on judgment either. Two
 * durations, not one: `ringDuration` (slow) turns the outer tick ring,
 * `particleDuration` (faster, opposite direction) turns a single orbiting
 * point — two different speeds in opposite directions read as depth and
 * mechanism ("a living technological object"), where one flat spin alone
 * would just read as a loading indicator. Both are continuous `Easing.linear`
 * loops — rotation has no start or settle to ease, unlike every other motion
 * constant here.
 *
 * Phase 5.8 ("Rebuild Space Around Atlas") adds two more to the same set, same discipline
 * (continuous, `Easing.linear`, never selected on judgment): `segmentDuration` turns the new
 * segmented, partially-lit arc ring — slower than the tick ring so the two never fall into a
 * visually synchronized lockstep — and `secondParticleDuration` turns a second orbiting point at
 * a third speed. Four independent rotation speeds across the whole Heart, still one constant
 * set, still nothing here ever chosen conditionally.
 *
 * Phase 5.9 ("Complete Presentation Reset") adds two more for Heart's rebuilt core: `plateDuration`
 * turns a small rotating faceted plate behind the core — a different shape category (a rounded
 * square, not a circle), reading as an internal mechanical part rather than one more glow ring.
 * `bracketDuration` turns four HUD-style corner brackets extremely slowly — almost imperceptible
 * as motion, present mainly so the brackets never look like a static decal painted onto the
 * screen. Same discipline as every other entry here: continuous, linear, never judgment-driven.
 *
 * `NARRATION` is new ("Remove Manual Progression From the Briefing") — the timing for Atlas's own
 * autonomous narration, replacing the tap-driven advance the Briefing previously required.
 * `reveal`/`exit` govern every step's own materialize/dematerialize beat (within the brief's
 * suggested 500–800ms), reused for every step including the greeting — the greeting is not a
 * separate timing system, it is simply step zero. `holdBase`/`holdPerCharacter`/`holdMax` compute
 * how long an informational step stays on screen once revealed: proportional to how much there is
 * to read, not a fixed slideshow interval, clamped so a long step never stalls indefinitely.
 * `decisionResolvedHold` is the one different case — the brief pause after the CEO has just acted
 * on a decision (Approve/Adjust/Later), before Atlas moves on, distinct from reading-time because
 * nothing is being read at that moment, only confirmed.
 *
 * Design 2.0 ("The Core") is a correction to `BREATHE` and a near-total retirement of the old
 * `ORBIT` set, not an addition to it. The brief's own words: "No constant spinning. No continuous
 * rotating rings... Every other motion should happen because Atlas is doing something." Phase
 * 5.7–5.9's Heart rotated four to six independent rings continuously, forever, regardless of
 * whether anything was happening — reviewed as reading like "an animated circle," a loading
 * indicator with extra steps, not an intelligence at rest. `BREATHE` is now the one motion that
 * never stops, slowed to the brief's 8–12s full-cycle range (`duration` is a half-cycle, so 5000ms
 * here is a 10s breath) and flattened in amplitude so it reads as "almost imperceptible," not a
 * pulse. Every rotation constant that used to loop unconditionally is gone; the three that remain
 * (`containmentDuration`, `plateDuration`, `bracketDuration`) are only ever started by Heart.tsx
 * when its `state` prop calls for rotation — never at `"rest"` — and even then are slower than any
 * of Phase 5.9's speeds, deliberate rather than decorative.
 *
 * Correction, stated openly (same sprint, a follow-up round): the first cut of `BREATHE` above
 * shipped with a real bug, not a restrained design choice. A single `amplitude` was reused for
 * both scale and opacity, but Heart.tsx additionally scaled it down `* 0.3` for scale only — the
 * resting breathing motion was actually swinging about a third of a percent, effectively invisible
 * on most screens. `amplitude` is now two named, one-directional values that swing from the resting
 * value up to a peak and back — never below rest, matching the brief's literal "1.000 → 1.012 →
 * 1.000" — and Heart.tsx's `breatheBoost` per `state` lets breathing itself (not rotation) be the
 * thing that visibly strengthens for `"thinking"`, which this round also stopped rotating anything
 * for: thinking is attentive stillness, not activity.
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
  NARRATION: {
    reveal: {
      duration: 650,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
    exit: {
      duration: 650,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
    holdBase: 1200,
    holdPerCharacter: 15,
    holdMax: 4000,
    decisionResolvedHold: 1000,
  },
  BREATHE: {
    // One leg (rest → peak, or peak → rest); two legs make the full ~10s cycle.
    duration: 5000,
    // A true sine-based ease (not a linear ramp), composed symmetrically — this is what keeps
    // the cycle from ever feeling like a mechanical up/down snap.
    easing: Easing.inOut(Easing.sin),
    // Design 2.0 correction: the previous single `amplitude` was applied two different ways —
    // halved (`* 0.3`) for scale but not for opacity — which left the scale swing at roughly
    // ±0.3%, well under what a screen can reliably render without subpixel rounding eating it
    // entirely. That was the actual cause of "breathing is missing," not the curve or the
    // duration. Scale and opacity now each have their own named, one-directional amplitude
    // (rest → peak → rest, never dipping below the resting value), matched to the brief's
    // explicit numbers: scale swings a full 1.2% (1.000 → 1.012 → 1.000), opacity swings 2.5%
    // (inside the requested 2–3% band).
    scaleAmplitude: 0.095,
    opacityAmplitude: 0.025,
  },
  ORBIT: {
    containmentDuration: 54000,
    plateDuration: 96000,
    bracketDuration: 130000,
    easing: Easing.linear,
  },
} as const;

import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { buildBriefingSteps, type BriefingStep } from "./briefingSteps";
import { ROOM_MOTION } from "./motion";
import DepartmentProjection from "./objects/DepartmentProjection";
import type { ExecutiveBriefing } from "./roomData";
import { ROOM_COLORS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";
import { ADJUST_OPTIONS, type NeedsChangeOptionId } from "@/atlas/studio/control/types";

/**
 * Executive Briefing — Sprint 4.2 ("Executive Briefing v1") first turned the real snapshot into
 * six short sections (welcome, business update, executive judgement, attention, CEO decisions,
 * closing). Sprint 4.3 ("Room Entry Experience") staged those six sections as one cascading
 * reveal. Sprint 5.2 ("Sequential Business Briefing") replaced that with a genuinely sequential,
 * CEO-paced experience: one step on screen at a time, advanced deliberately.
 *
 * Sprint 5.3 ("Actionable Executive Briefing") adds exactly one thing on top: the CEO Decisions
 * step can now be acted on directly, without waiting to enter The Room. `approveInbox`,
 * `adjustInbox`, `deferInbox` and `adjustingItemId` below are the *exact same* functions and
 * state `useControlDashboard()` already exposes to `CeoFocusOverlay.tsx` — no second mutation
 * path, no new approval workflow. Business Update, Executive Judgement and Attention stay purely
 * informational: `CompanyIssue` and `LivePlanSummary` have no approve/adjust/defer mechanism
 * anywhere in this codebase (confirmed in Sprint 5.1's investigation), so those steps carry no
 * `decisionItems` and render no action row — "expose actions only when they already exist."
 *
 * The step *sequence* itself is captured once per session (`capturedStepsRef`) the first moment
 * a real briefing is available, and never recomputed from a later, action-mutated snapshot —
 * taking an action changes what `snapshot.ceoInbox` looks like, which would otherwise shrink or
 * reorder `steps` out from under the CEO mid-sequence. Whether an item still needs a response is
 * instead read live, each render, against the current `briefing.decisions.items` — so a button
 * that's already been acted on stops offering itself again without the step list itself moving.
 *
 * Sprint 5.4 ("Jarvis Experience") adds exactly two presentation-only things on top, per the
 * roadmap's own "punt verschijnt, pauze, visualisatie, verdwijnt, volgende punt": (1) when a step
 * carries `visualReference` (Sprint 5.1's `SynthesisPoint.visualReference`, threaded through by
 * `briefingSteps.ts` — never new data), a small department visual renders. (2) advancing now
 * plays a calm exit — the current step fades out (`exitOpacity`, driven by the exact same
 * `ROOM_MOTION.TRANSITION` duration/easing every other Room transition already uses) and only
 * once that finishes does the next step mount and play its own existing entrance. One thought
 * finishes before the next begins, using the one motion constant this whole file already
 * depended on — no second timing system, no new `Animated.Value` type.
 *
 * Phase 5.6 ("Atlas Space") makes two further changes, both presentation, per "preserve
 * Executive Briefing logic": (1) the department visual above is no longer this file's own
 * inline `PointVisual` — it is `objects/DepartmentProjection.tsx`, the same shared component
 * `RoomScene.tsx` no longer permanently mounts a Department Wall with. One implementation of
 * "a department Atlas is currently discussing," reused here rather than duplicated, per
 * Rendering Law Principle 5. (2) a small, constant Heart echo now sits at the top of the card,
 * reusing `ConversationSpace.tsx`'s own ring/presence idiom — so the whole Briefing reads as
 * Atlas speaking from one consistent point of origin, not a floating card unconnected to it.
 * Nothing about the step sequence, the freeze/live-check pattern, or the action wiring changes.
 */
export default function ExecutiveBriefingOverlay({
  visible,
  briefing,
  onClose,
  adjustingItemId,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onDefer,
  onResetAdjusting,
}: {
  visible: boolean;
  briefing: ExecutiveBriefing | null;
  onClose: () => void;
  adjustingItemId: string | null;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onDefer: (id: string) => void;
  onResetAdjusting: () => void;
}) {
  const progress = useRoomTransition(visible);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<BriefingStep[]>([]);
  const capturedRef = useRef(false);

  // Sprint 5.4 — the current step's own exit fade. One `Animated.Value`, reused every advance
  // (never a fresh one per step, unlike the entrance animation below) — reset to 1 the instant a
  // new step mounts, then animated to 0 the instant the CEO advances again.
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Freeze the step sequence once per session, the first moment a real briefing exists — never
  // re-derived from `briefing` again while `visible` stays true, so an action taken mid-briefing
  // (which changes `snapshot.ceoInbox`, and therefore what a fresh `buildBriefingSteps()` call
  // would produce) can never shrink or reorder the sequence the CEO is already partway through.
  useEffect(() => {
    if (!visible) {
      capturedRef.current = false;
      setIsAdvancing(false);
      exitOpacity.setValue(1);
      return;
    }
    if (!capturedRef.current && briefing) {
      setSteps(buildBriefingSteps(briefing));
      setStepIndex(0);
      capturedRef.current = true;
    }
  }, [visible, briefing, exitOpacity]);

  const cardStyle = {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  const currentStep = steps[stepIndex] ?? null;
  const isLastStep = stepIndex >= steps.length - 1;

  // The CEO can only ever move forward, one approved step at a time — there is no control to
  // skip ahead or jump to the end. Pressing the button on any step but the last only advances
  // `stepIndex`; only on the last step does the exact same press become the real "Enter The
  // Room" dismissal. Either way, an Adjust option row left open on the current step is closed
  // first — it must never silently carry over into Threshold Stone after entering The Room.
  //
  // Sprint 5.4 — advancing no longer swaps the step instantly. The current step fades out first
  // (`exitOpacity`, the same `ROOM_MOTION.TRANSITION` duration/easing as every other transition
  // in this file) and only once that finishes does `stepIndex` actually move — "Atlas finishes
  // one thought before beginning the next," not two thoughts overlapping mid-fade.
  const handleAdvance = () => {
    if (isAdvancing) {
      return;
    }
    onResetAdjusting();
    setIsAdvancing(true);
    Animated.timing(exitOpacity, {
      toValue: 0,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start(() => {
      if (isLastStep) {
        onClose();
        return;
      }
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
      exitOpacity.setValue(1);
      setIsAdvancing(false);
    });
  };

  // Live (not frozen) — the same real ids `briefing.decisions.items` currently contains, used
  // only to tell a frozen step's items whether they've already been acted on since the sequence
  // was captured, so their action row can stop offering itself without the item disappearing
  // from the step entirely.
  const stillWaitingIds = new Set((briefing?.decisions.items ?? []).map((item) => item.id));

  return (
    <Animated.View pointerEvents={visible ? "auto" : "none"} style={[styles.backdrop, { opacity: progress }]}>
      <View style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.card, cardStyle]}>
        <View pointerEvents="none" style={styles.heartEcho}>
          <View style={[styles.heartRing, styles.heartRingOuter]} />
          <View style={[styles.heartRing, styles.heartRingMid]} />
          <View style={[styles.heartRing, styles.heartRingCore]} />
        </View>

        {currentStep ? (
          <Animated.View style={{ width: "100%", opacity: exitOpacity }}>
            <BriefingStepView
              key={currentStep.id}
              step={currentStep}
              stillWaitingIds={stillWaitingIds}
              adjustingItemId={adjustingItemId}
              onApprove={onApprove}
              onAdjustClick={onAdjustClick}
              onAdjustOption={onAdjustOption}
              onDefer={onDefer}
            />
          </Animated.View>
        ) : null}

        <Pressable style={[styles.closeButton, isAdvancing && styles.closeButtonFading]} onPress={handleAdvance}>
          <Text style={styles.closeLabel}>{isLastStep ? "Enter Atlas Space" : "Continue"}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

/**
 * One step's own reveal. Keying this by `step.id` in the parent makes React remount it on every
 * advance, which re-triggers `useRoomTransition`'s own mount-time animation (0 → 1, the same
 * `ROOM_MOTION.TRANSITION` duration and easing every other overlay already uses) fresh for each
 * new step — reusing the existing transition hook exactly as written, not a second animation
 * system with its own timing.
 */
function BriefingStepView({
  step,
  stillWaitingIds,
  adjustingItemId,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onDefer,
}: {
  step: BriefingStep;
  stillWaitingIds: Set<string>;
  adjustingItemId: string | null;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onDefer: (id: string) => void;
}) {
  const progress = useRoomTransition(true);
  const stepStyle = {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.section, stepStyle]}>
      {step.visualReference ? <DepartmentProjection departmentId={step.visualReference} /> : null}

      {step.lines.map((line, index) => (
        <Text key={index} style={lineStyleFor(step.kind, index)}>
          {line}
        </Text>
      ))}

      {step.decisionItems?.map((item) => {
        const stillWaiting = stillWaitingIds.has(item.id);
        return (
          <View key={item.id} style={styles.decisionItem}>
            <Text style={styles.decisionTitle}>{item.title}</Text>
            {stillWaiting ? (
              adjustingItemId === item.id ? (
                <View style={styles.optionRow}>
                  {ADJUST_OPTIONS.map((option) => (
                    <Pressable key={option.id} onPress={() => onAdjustOption(item.id, option.id)}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.actionRow}>
                  <Pressable style={styles.actionPill} onPress={() => onApprove(item.id)}>
                    <Text style={styles.actionLabel}>Approve</Text>
                  </Pressable>
                  <Pressable style={styles.actionPill} onPress={() => onAdjustClick(item.id)}>
                    <Text style={styles.actionLabel}>Adjust</Text>
                  </Pressable>
                  <Pressable style={styles.actionPill} onPress={() => onDefer(item.id)}>
                    <Text style={styles.actionLabel}>Later</Text>
                  </Pressable>
                </View>
              )
            ) : (
              <Text style={styles.decisionNoted}>Noted.</Text>
            )}
          </View>
        );
      })}
    </Animated.View>
  );
}

function lineStyleFor(kind: BriefingStep["kind"], index: number) {
  switch (kind) {
    case "welcome":
      return styles.greeting;
    case "businessUpdate":
      return index === 0 ? styles.leadLine : styles.line;
    case "judgement":
      return styles.judgement;
    case "attention":
      return styles.attentionLine;
    case "decisions":
      return styles.line;
    case "closing":
      return styles.closing;
    default:
      return styles.line;
  }
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ROOM_COLORS.backdrop,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  card: {
    maxWidth: 480,
    width: "100%",
    minHeight: 220,
    backgroundColor: ROOM_COLORS.wallBase,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 10,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },

  // Phase 5.6 — a small, constant echo of the Heart (same ring idiom `ConversationSpace.tsx`
  // already uses), sitting above whichever step is currently showing. Not animated per step —
  // it is the one constant point of origin the whole sequence speaks from, never remounted or
  // re-triggered as steps advance.
  heartEcho: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  heartRing: {
    position: "absolute",
    borderRadius: 999,
  },

  heartRingOuter: {
    width: 44,
    height: 44,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.14,
  },

  heartRingMid: {
    width: 26,
    height: 26,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.28,
  },

  heartRingCore: {
    width: 12,
    height: 12,
    backgroundColor: ROOM_COLORS.emberCore,
    opacity: 0.9,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },

  closeButtonFading: {
    opacity: 0.55,
  },

  section: {
    width: "100%",
    gap: 8,
  },

  greeting: {
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: ROOM_COLORS.textPrimary,
    textAlign: "center",
  },

  leadLine: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: ROOM_COLORS.textPrimary,
    textAlign: "center",
  },

  line: {
    fontSize: 14,
    lineHeight: 21,
    color: ROOM_COLORS.textSecondary,
    textAlign: "center",
  },

  judgement: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: ROOM_COLORS.emberWarm,
    textAlign: "center",
  },

  attentionLine: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: ROOM_COLORS.textSecondary,
    textAlign: "center",
  },

  closing: {
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    color: ROOM_COLORS.textSecondary,
    textAlign: "center",
  },

  // Sprint 5.3 — same visual language `CeoFocusOverlay.tsx` already established for an
  // individual actionable item, reused rather than reinvented.
  decisionItem: {
    width: "100%",
    gap: 4,
    alignItems: "center",
    marginTop: 4,
  },

  decisionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: ROOM_COLORS.textPrimary,
    textAlign: "center",
  },

  decisionNoted: {
    fontSize: 12,
    fontWeight: "600",
    color: ROOM_COLORS.textSecondary,
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 2,
  },

  actionPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(47, 184, 255, 0.08)",
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
  },

  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: ROOM_COLORS.textPrimary,
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 2,
  },

  optionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: ROOM_COLORS.emberWarm,
    paddingVertical: 4,
  },

  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  closeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: ROOM_COLORS.void,
  },
});

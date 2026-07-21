import { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { buildBriefingSteps, type BriefingStep } from "./briefingSteps";
import type { ExecutiveBriefing } from "./roomData";
import { ROOM_COLORS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";

/**
 * Executive Briefing — Sprint 4.2 ("Executive Briefing v1") first turned the real snapshot into
 * six short sections (welcome, business update, executive judgement, attention, CEO decisions,
 * closing). Sprint 4.3 ("Room Entry Experience") staged those six sections as one cascading
 * reveal within a single open animation. Sprint 5.2 ("Sequential Business Briefing") replaces
 * that cascade with a genuinely sequential, CEO-paced experience: one step is on screen at a
 * time, and the CEO advances it deliberately — the same shift "Do NOT introduce a separate
 * motion duration" and "sequencing, not different animation speeds" already pointed toward.
 *
 * `buildBriefingSteps()` (`briefingSteps.ts`) is the only new logic here, and it is purely
 * presentational — it slices the existing `ExecutiveBriefing` object into an ordered step list,
 * never recomputing any of its content. `roomData.ts` and `synthesisEngine.ts` (Sprint 5.1) are
 * untouched.
 *
 * Still shares the exact same Soft State Transition (`useRoomTransition`) and card/backdrop
 * treatment every other Room overlay already uses. The backdrop still does not dismiss on tap
 * (Sprint 4.3) — the CEO's only control is the single button at the bottom, which reads
 * "Continue" until the final step and only becomes "Enter The Room" — the one action that
 * actually dismisses this overlay — once that final step is on screen.
 */
export default function ExecutiveBriefingOverlay({
  visible,
  briefing,
  onClose,
}: {
  visible: boolean;
  briefing: ExecutiveBriefing | null;
  onClose: () => void;
}) {
  const progress = useRoomTransition(visible);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = briefing ? buildBriefingSteps(briefing) : [];

  // A fresh briefing session (the overlay becoming visible again) always starts back at the
  // first step — Welcome — it never resumes mid-sequence from a previous visit.
  useEffect(() => {
    if (visible) {
      setStepIndex(0);
    }
  }, [visible]);

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
  // Room" dismissal.
  const handleAdvance = () => {
    if (isLastStep) {
      onClose();
      return;
    }
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  return (
    <Animated.View pointerEvents={visible ? "auto" : "none"} style={[styles.backdrop, { opacity: progress }]}>
      <View style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.card, cardStyle]}>
        {currentStep ? <BriefingStepView key={currentStep.id} step={currentStep} /> : null}

        <Pressable style={styles.closeButton} onPress={handleAdvance}>
          <Text style={styles.closeLabel}>{isLastStep ? "Enter The Room" : "Continue"}</Text>
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
function BriefingStepView({ step }: { step: BriefingStep }) {
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
      {step.lines.map((line, index) => (
        <Text key={index} style={lineStyleFor(step.kind, index)}>
          {line}
        </Text>
      ))}
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
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },

  section: {
    width: "100%",
    gap: 8,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E291F",
    textAlign: "center",
  },

  leadLine: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    color: "#2E291F",
    textAlign: "center",
  },

  line: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5A5344",
    textAlign: "center",
  },

  judgement: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
    color: ROOM_COLORS.emberDeep,
    textAlign: "center",
  },

  attentionLine: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#5A5344",
    textAlign: "center",
  },

  closing: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    color: "#5A5344",
    textAlign: "center",
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
    color: "#FFF7EE",
  },
});

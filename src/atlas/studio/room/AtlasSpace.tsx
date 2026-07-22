import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { buildBriefingSteps, type BriefingStep } from "./briefingSteps";
import CeoFocusOverlay from "./CeoFocusOverlay";
import CompanyInterior from "./CompanyInterior";
import { ROOM_MOTION } from "./motion";
import Heart, { type AtlasCoreState } from "./objects/Heart";
import DepartmentProjection from "./objects/DepartmentProjection";
import PlaceholderOverlay from "./PlaceholderOverlay";
import {
  composeExecutiveBriefing,
  deriveHeartVitality,
  doorwayBusinessName,
  mapCompanyDoorways,
  selectCeoFocus,
} from "./roomData";
import { ROOM_COLORS } from "./theme";
import type { DoorwayId, RoomObjectId } from "./types";
import { useRoomTransition } from "./useRoomTransition";
import { useControlDashboard } from "@/atlas/studio/control/useControlDashboard";
import { ADJUST_OPTIONS, type NeedsChangeOptionId } from "@/atlas/studio/control/types";

/** Sprint 2.2: "inbox" opens the real `CeoFocusOverlay`; "tools" (AI Tools) stays a placeholder —
 * not one of the six originally-required elements, unchanged since. */
type PlaceholderObjectId = Extract<RoomObjectId, "tools">;

const PLACEHOLDER_MESSAGE: Record<PlaceholderObjectId, string> = {
  tools: "AI Tools view will be built later.",
};

// How long an informational step stays on screen once revealed, proportional to how much there
// is to read rather than a fixed slideshow interval — see `ROOM_MOTION.NARRATION`'s docstring.
function computeHoldDuration(step: BriefingStep): number {
  const characterCount = step.lines.reduce((total, line) => total + line.length, 0);
  const duration = ROOM_MOTION.NARRATION.holdBase + characterCount * ROOM_MOTION.NARRATION.holdPerCharacter;
  return Math.min(duration, ROOM_MOTION.NARRATION.holdMax);
}

/**
 * Atlas Space — Phase 5.9 ("Complete Presentation Reset").
 *
 * This file replaces three files this sprint deletes outright: `RoomScreen.tsx` (the screen
 * component), `AtlasManifestation.tsx` (a "scene" composing Atlas with other layers), and
 * `AtlasBriefingExpression.tsx` (a Briefing mounted as a coordinating sibling component). Those
 * three files existed because presentation was built as several components passing props to each
 * other to stay in sync — activation state here, briefing state there, glow styles computed in
 * one file and threaded through two more to reach the component that actually needed them. That
 * coordination was the thing under review this sprint, not any one file's content. This file is
 * not those three files renamed and pasted together: it is written fresh, as one component that
 * owns the entire visible experience directly — the void, Atlas's core, and Atlas's briefing
 * expression are one render tree with one set of state, not three components agreeing to look
 * like one.
 *
 * What is genuinely unchanged: every call into `roomData.ts`, `briefingSteps.ts`, and
 * `useControlDashboard()` below is the same call the deleted files made, reading the same real
 * data, producing the same real content. Business logic, the synthesis engine, routing, and the
 * organizational model are untouched — this sprint is presentation only, and the presentation
 * that changed is how that data is rendered, never what it is.
 *
 * `CeoFocusOverlay.tsx`, `PlaceholderOverlay.tsx`, and `CompanyInterior.tsx` are unchanged and
 * still mounted here exactly as before. They are reachable only through `handleDevNavigation`
 * below (`__DEV__`-gated, Phase 5.7.1) — this sprint's brief scopes the rebuild to Atlas's own
 * primary rest/activation/briefing experience, not to every screen a development-only mechanism
 * can still reach.
 */
export default function AtlasSpace() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const {
    snapshot,
    adjustingItemId,
    setAdjustingItemId,
    approveInbox,
    adjustInbox,
    deferInbox,
  } = useControlDashboard();

  const [activated, setActivated] = useState(false);
  const [enteredCompany, setEnteredCompany] = useState<DoorwayId | null>(null);
  const [activeObject, setActiveObject] = useState<PlaceholderObjectId | null>(null);
  const [ceoFocusOpen, setCeoFocusOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<BriefingStep[]>([]);
  const capturedRef = useRef(false);
  const advancingRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entrance = useRef(new Animated.Value(0)).current;
  // Phase — "Remove Manual Progression From the Briefing": one Animated.Value carries a step's
  // whole visible lifetime, materializing in (0→1) the instant it becomes current and
  // dematerializing (1→0) the instant Atlas is done with it — driven by timers and real user
  // decisions now, never by a tap.
  const stepPresence = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const ceoFocus = useMemo(() => selectCeoFocus(snapshot?.ceoInbox ?? []), [snapshot?.ceoInbox]);

  const heartVitality = useMemo(
    () => deriveHeartVitality(snapshot?.companyState.companyHealth),
    [snapshot?.companyState.companyHealth],
  );

  const doorwayPresence = useMemo(() => mapCompanyDoorways(snapshot?.businesses ?? []), [snapshot?.businesses]);

  const doorwayNames = useMemo(
    () => ({
      "doorway-left": doorwayBusinessName(snapshot?.businesses ?? [], "doorway-left"),
      "doorway-right": doorwayBusinessName(snapshot?.businesses ?? [], "doorway-right"),
    }),
    [snapshot?.businesses],
  );

  const briefing = useMemo(() => (snapshot ? composeExecutiveBriefing(snapshot) : null), [snapshot]);

  const currentStep = steps[stepIndex] ?? null;
  const stillWaitingIds = useMemo(
    () => new Set((briefing?.decisions.items ?? []).map((item) => item.id)),
    [briefing],
  );
  // How many of the current step's own decisions still require the CEO — the only thing that
  // decides whether Atlas may continue on its own right now. Zero for every step kind except
  // "decisions" until the CEO actually acts.
  const unresolvedCount = currentStep?.decisionItems
    ? currentStep.decisionItems.filter((item) => stillWaitingIds.has(item.id)).length
    : 0;

  // Design 2.0 ("The Core"): Atlas's cognitive register, read from state this component already
  // tracks — no new state variable. Unactivated is always "rest". Once activated, the brief window
  // before `steps` is captured (briefing composing, `currentStep` still null) reads as "thinking";
  // once a step is on screen, Atlas is "speaking" it. "listening" has no trigger yet in this
  // sprint's scope (Atlas Space has no listening interaction) — Heart.tsx defines its visual
  // register regardless, per the brief's "prepare the visual language" instruction.
  const heartState: AtlasCoreState = !activated ? "rest" : currentStep ? "speaking" : "thinking";

  // The step sequence is captured once, the first moment a real briefing exists after
  // activation, and never recomputed from a later, action-mutated snapshot — unchanged logic
  // from the deleted `AtlasBriefingExpression.tsx`, carried over because the reasoning still
  // holds, not because the old file is being reused.
  useEffect(() => {
    if (!activated) {
      capturedRef.current = false;
      advancingRef.current = false;
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      stepPresence.setValue(1);
      return;
    }
    if (!capturedRef.current && briefing) {
      setSteps(buildBriefingSteps(briefing));
      setStepIndex(0);
      capturedRef.current = true;
    }
  }, [activated, briefing, stepPresence]);

  const activatedProgress = useRoomTransition(activated);
  const expressionProgress = useRoomTransition(activated && briefing !== null);
  const companyProgress = useRoomTransition(enteredCompany !== null);

  // Reveal each step the instant it becomes current — the greeting is not a separate mechanism,
  // it is simply step zero going through the same materialize beat every later step will.
  useEffect(() => {
    if (!activated || !currentStep) {
      return;
    }
    stepPresence.setValue(0);
    Animated.timing(stepPresence, {
      toValue: 1,
      duration: ROOM_MOTION.NARRATION.reveal.duration,
      easing: ROOM_MOTION.NARRATION.reveal.easing,
      useNativeDriver: true,
    }).start();
  }, [currentStep, activated, stepPresence]);

  const goToNextStep = useCallback(() => {
    if (advancingRef.current) {
      return;
    }
    advancingRef.current = true;
    const isLast = stepIndex >= steps.length - 1;
    Animated.timing(stepPresence, {
      toValue: 0,
      duration: ROOM_MOTION.NARRATION.exit.duration,
      easing: ROOM_MOTION.NARRATION.exit.easing,
      useNativeDriver: true,
    }).start(() => {
      advancingRef.current = false;
      if (isLast) {
        setActivated(false);
      } else {
        setStepIndex((index) => Math.min(index + 1, steps.length - 1));
      }
    });
  }, [stepIndex, steps.length, stepPresence]);

  // Autonomous narration ("Remove Manual Progression From the Briefing"). Informational steps
  // hold for a reading-proportional duration (`computeHoldDuration`) and then advance on their
  // own — no arrow, no tap. A step that still has an unresolved decision never starts this timer
  // at all: Atlas waits for the real Approve/Adjust/Later input the CEO must give, exactly as
  // long as it takes. The moment that input arrives (`unresolvedCount` reaches 0), a short
  // confirmation hold plays and Atlas continues — the CEO's own action is what unblocks
  // progression, never a click on a separate "next" control.
  useEffect(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (!activated || !currentStep || unresolvedCount > 0) {
      return;
    }
    const hasDecisions = (currentStep.decisionItems?.length ?? 0) > 0;
    const duration = hasDecisions
      ? ROOM_MOTION.NARRATION.decisionResolvedHold
      : computeHoldDuration(currentStep);
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      goToNextStep();
    }, duration);
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    };
  }, [activated, currentStep, unresolvedCount, goToNextStep]);

  const handleActivate = useCallback(() => {
    setActivated((current) => !current);
  }, []);

  const handleSelect = useCallback((object: Exclude<RoomObjectId, "heart">) => {
    if (object === "doorway-left" || object === "doorway-right") {
      setEnteredCompany(object);
      return;
    }
    if (object === "inbox") {
      setCeoFocusOpen(true);
      return;
    }
    setActiveObject(object);
  }, []);

  const handleExitCompany = useCallback(() => setEnteredCompany(null), []);
  const handleClose = useCallback(() => setActiveObject(null), []);

  const handleCloseCeoFocus = useCallback(() => {
    setCeoFocusOpen(false);
    setAdjustingItemId(null);
  }, [setAdjustingItemId]);

  const handleAdjustClick = useCallback(
    (itemId: string) => setAdjustingItemId((current) => (current === itemId ? null : itemId)),
    [setAdjustingItemId],
  );

  const handleDevBack = useCallback(() => {
    if (enteredCompany) {
      handleExitCompany();
      return;
    }
    router.back();
  }, [enteredCompany, handleExitCompany]);

  const handleDevNavigation = useCallback(() => {
    Alert.alert("Dev navigation", "Temporary developer infrastructure — not part of Atlas Space.", [
      { text: "CEO Inbox", onPress: () => handleSelect("inbox") },
      { text: "AI Tools", onPress: () => handleSelect("tools") },
      { text: doorwayNames["doorway-left"], onPress: () => handleSelect("doorway-left") },
      { text: doorwayNames["doorway-right"], onPress: () => handleSelect("doorway-right") },
      { text: "← Back", onPress: handleDevBack },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [handleSelect, doorwayNames, handleDevBack]);

  const placeholderMessage = activeObject ? PLACEHOLDER_MESSAGE[activeObject] : null;

  // Ambient light is a function of Atlas's own state, not a fixed decoration: intensity tracks
  // `heartVitality`, and size tracks the viewport diagonal so its edge is never inside any
  // realistic screen, on any device.
  const vignetteSize = Math.hypot(width, height) * 1.6;
  const vignetteOpacity = 0.2 + 0.22 * heartVitality;
  const ambientOpacity = 0.7 + 0.3 * heartVitality;
  const restOffset = Math.min(Math.max(height * 0.24, 170), 260);

  const stageStyle = {
    opacity: entrance,
    transform: [
      {
        scale: Animated.multiply(
          entrance.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }),
          activatedProgress.interpolate({ inputRange: [0, 1], outputRange: [1, ROOM_MOTION.APPROACH.scale] }),
        ),
      },
    ],
  };

  const heartPresenceStyle = {
    opacity: activatedProgress.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }),
  };

  const peripheryStyle = {
    opacity: activatedProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, ROOM_MOTION.APPROACH.peripheryOpacity],
    }),
  };

  const presenceLightStyle = {
    opacity: activatedProgress.interpolate({ inputRange: [0, 1], outputRange: [0.32, 1] }),
  };

  const expressionStyle = {
    opacity: expressionProgress,
    transform: [
      { translateY: expressionProgress.interpolate({ inputRange: [0, 1], outputRange: [0, restOffset] }) },
      { scale: expressionProgress.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }) },
    ],
  };

  const seamStyle = {
    opacity: Animated.multiply(expressionProgress, 0.3),
    height: expressionProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.max(restOffset - 140, 40)],
    }),
  };

  // `stepPresence` alone carries a step's whole visible lifetime now — materializing in when it
  // becomes current, dematerializing when Atlas is done with it (timer or resolved decision),
  // never a tap-driven fade.
  const stepLifecycleStyle = {
    opacity: stepPresence,
    transform: [
      { translateY: stepPresence.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] }) },
      { scale: stepPresence.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
    ],
  };

  const roomContentStyle = {
    opacity: companyProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [{ scale: companyProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }],
  };

  const companyContentStyle = {
    opacity: companyProgress,
    transform: [{ scale: companyProgress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.stage, stageStyle]}>
        <Animated.View pointerEvents={enteredCompany ? "none" : "box-none"} style={[styles.layer, roomContentStyle]}>
          <View
            pointerEvents="none"
            style={[
              styles.vignette,
              {
                width: vignetteSize,
                height: vignetteSize,
                marginLeft: -vignetteSize / 2,
                marginTop: -vignetteSize / 2,
                borderRadius: vignetteSize / 2,
                opacity: vignetteOpacity,
              },
            ]}
          />
          <View pointerEvents="none" style={[styles.ambientCore, { opacity: ambientOpacity }]} />

          <Animated.View pointerEvents="none" style={[styles.presenceLight, presenceLightStyle]}>
            <View style={[styles.glowRing, styles.glowOuter]} />
            <View style={[styles.glowRing, styles.glowMid]} />
            <View style={[styles.glowRing, styles.glowInner]} />
          </Animated.View>

          <Animated.View style={[styles.heartLevel, heartPresenceStyle]} pointerEvents="box-none">
            <Heart onPress={handleActivate} vitality={heartVitality} activated={activated} state={heartState} />
          </Animated.View>

          <View style={styles.expressionRoot} pointerEvents={activated ? "box-none" : "none"}>
            <Animated.View pointerEvents="none" style={[styles.seam, seamStyle]} />
            <Animated.View style={[styles.expression, expressionStyle]}>
              {currentStep ? (
                <Animated.View style={{ width: "100%", alignItems: "center", ...stepLifecycleStyle }}>
                  <View style={styles.section}>
                    {currentStep.visualReference ? (
                      <DepartmentProjection departmentId={currentStep.visualReference} />
                    ) : null}

                    {currentStep.lines.map((line, index) => (
                      <Text key={index} style={lineStyleFor(currentStep.kind, index)}>
                        {line}
                      </Text>
                    ))}

                    {currentStep.decisionItems?.map((item) => {
                      const stillWaiting = stillWaitingIds.has(item.id);
                      return (
                        <View key={item.id} style={styles.decisionItem}>
                          <Text style={styles.decisionTitle}>{item.title}</Text>
                          {stillWaiting ? (
                            adjustingItemId === item.id ? (
                              <View style={styles.optionRow}>
                                {ADJUST_OPTIONS.map((option: { id: NeedsChangeOptionId; label: string }) => (
                                  <Pressable key={option.id} onPress={() => adjustInbox(item.id, option.id)}>
                                    <Text style={styles.optionLabel}>{option.label}</Text>
                                  </Pressable>
                                ))}
                              </View>
                            ) : (
                              <View style={styles.actionRow}>
                                <Pressable style={styles.actionPill} onPress={() => approveInbox(item.id)}>
                                  <Text style={styles.actionLabel}>Approve</Text>
                                </Pressable>
                                <Pressable style={styles.actionPill} onPress={() => handleAdjustClick(item.id)}>
                                  <Text style={styles.actionLabel}>Adjust</Text>
                                </Pressable>
                                <Pressable style={styles.actionPill} onPress={() => deferInbox(item.id)}>
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
                  </View>
                </Animated.View>
              ) : null}
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View pointerEvents={enteredCompany ? "box-none" : "none"} style={[styles.layer, companyContentStyle]}>
          <CompanyInterior
            doorway={enteredCompany}
            onExit={handleExitCompany}
            onSelectHeart={handleActivate}
            presenceLightStyle={presenceLightStyle}
            peripheryStyle={peripheryStyle}
            heartVitality={heartVitality}
            doorwayPresence={doorwayPresence}
          />
        </Animated.View>
      </Animated.View>

      {__DEV__ && (
        <Pressable
          style={[styles.devTrigger, { top: Math.max(insets.top, 16) }]}
          onLongPress={handleDevNavigation}
          accessibilityLabel="Developer navigation (development builds only)"
        />
      )}

      <CeoFocusOverlay
        visible={ceoFocusOpen}
        items={ceoFocus.items}
        adjustingItemId={adjustingItemId}
        onApprove={approveInbox}
        onAdjustClick={handleAdjustClick}
        onAdjustOption={adjustInbox}
        onDefer={deferInbox}
        onClose={handleCloseCeoFocus}
      />

      <PlaceholderOverlay visible={activeObject !== null} message={placeholderMessage} onClose={handleClose} />
    </View>
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
  screen: {
    flex: 1,
    backgroundColor: ROOM_COLORS.void,
  },

  stage: {
    ...StyleSheet.absoluteFill,
  },

  layer: {
    ...StyleSheet.absoluteFill,
  },

  vignette: {
    position: "absolute",
    top: "50%",
    left: "50%",
    backgroundColor: ROOM_COLORS.ambientWarm,
  },

  ambientCore: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ROOM_COLORS.ambientCore,
  },

  presenceLight: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },

  glowRing: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  glowOuter: { width: 260, height: 260, opacity: ROOM_MOTION.APPROACH.glow.outer },
  glowMid: { width: 180, height: 180, opacity: ROOM_MOTION.APPROACH.glow.mid },
  glowInner: { width: 120, height: 120, opacity: ROOM_MOTION.APPROACH.glow.inner },

  heartLevel: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },

  expressionRoot: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },

  seam: {
    position: "absolute",
    width: 1,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  expression: {
    maxWidth: 440,
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },

  section: {
    width: "100%",
    gap: 8,
    alignItems: "center",
  },

  greeting: { fontSize: 22, fontWeight: "700", letterSpacing: 0.2, color: ROOM_COLORS.textPrimary, textAlign: "center" },
  leadLine: { fontSize: 16, lineHeight: 24, fontWeight: "600", color: ROOM_COLORS.textPrimary, textAlign: "center" },
  line: { fontSize: 14, lineHeight: 21, color: ROOM_COLORS.textSecondary, textAlign: "center" },
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
  closing: { fontSize: 14, lineHeight: 21, fontStyle: "italic", color: ROOM_COLORS.textSecondary, textAlign: "center" },

  decisionItem: { width: "100%", gap: 4, alignItems: "center", marginTop: 4 },
  decisionTitle: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: ROOM_COLORS.textPrimary, textAlign: "center" },
  decisionNoted: { fontSize: 12, fontWeight: "600", color: ROOM_COLORS.textSecondary },

  actionRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 2 },
  actionPill: { paddingVertical: 4 },
  actionLabel: { fontSize: 13, fontWeight: "600", color: ROOM_COLORS.emberWarm },

  optionRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 2 },
  optionLabel: { fontSize: 13, fontWeight: "600", color: ROOM_COLORS.emberWarm, paddingVertical: 4 },

  devTrigger: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
  },
});

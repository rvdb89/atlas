import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import type { ExecutiveBriefing } from "./roomData";
import { ROOM_COLORS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";

/**
 * Executive Briefing — Sprint 4.2 ("Executive Briefing v1"). The CEO's first moment inside
 * The Room: Atlas speaks first, in the six-part order already approved (welcome, business
 * update, executive judgement, attention, CEO decisions, closing), before anything else in
 * the Room is touched. `composeExecutiveBriefing()` (`roomData.ts`) already turns the real
 * snapshot into these six short sections — this component only renders them, in order, as one
 * coherent message, never as separate cards or a dashboard.
 *
 * Shares the exact same Soft State Transition (`useRoomTransition`) and card/backdrop
 * treatment every other Room overlay already uses (`PlaceholderOverlay.tsx`,
 * `CeoFocusOverlay.tsx`) — this reads as the same Atlas, not a new surface with its own rules.
 * Dismissing it (the one action available here) reveals the ordinary Room underneath,
 * unchanged; any further detail the CEO wants lives behind the Room's existing objects
 * (Threshold Stone, Company Doorways, Department Wall), never inside this overlay itself.
 *
 * Sprint 4.3 ("Room Entry Experience") — the CEO now dismisses this deliberately, via
 * "Enter The Room" only; the backdrop no longer closes it on tap. The three sections below
 * reveal in sequence — Greeting, then Business Update + Executive Judgement, then Attention +
 * CEO Decisions + Closing — but this is staged entirely by giving each group its own
 * `inputRange` window over the *same* `progress` value `useRoomTransition` already produces.
 * There is still exactly one timing loop and one duration (`ROOM_MOTION.TRANSITION`, unchanged);
 * nothing here introduces a second `Animated.Value` or a different speed.
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

  // Sprint 4.3 — three windows over the one shared `progress` value. Each stage finishes
  // revealing earlier than the next, producing a cascade inside the existing transition
  // duration rather than a second animation system.
  const stage1Style = stageStyle(progress, [0, 0.35]);
  const stage2Style = stageStyle(progress, [0.2, 0.6]);
  const stage3Style = stageStyle(progress, [0.45, 1]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.backdrop, { opacity: progress }]}
    >
      <View style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.card, cardStyle]}>
        {briefing ? (
          <View style={styles.body}>
            <Animated.View style={stage1Style}>
              <Text style={styles.greeting}>{briefing.greeting}.</Text>
            </Animated.View>

            <Animated.View style={[styles.stageGroup, stage2Style]}>
              <View style={styles.section}>
                {briefing.businessUpdate.map((line, index) => (
                  <Text key={index} style={index === 0 ? styles.leadLine : styles.line}>
                    {line}
                  </Text>
                ))}
              </View>

              <Text style={styles.judgement}>{briefing.judgement}</Text>
            </Animated.View>

            <Animated.View style={[styles.stageGroup, stage3Style]}>
              {briefing.attention.length > 0 ? (
                <View style={styles.section}>
                  {briefing.attention.map((line, index) => (
                    <Text key={index} style={styles.attentionLine}>
                      {line}
                    </Text>
                  ))}
                </View>
              ) : null}

              <Text style={styles.line}>{briefing.decisions.summary}</Text>

              <Text style={styles.closing}>{briefing.closing}</Text>
            </Animated.View>
          </View>
        ) : null}

        <Animated.View style={stage3Style}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeLabel}>Enter The Room</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

/** Sprint 4.3 — derives one stage's opacity/translateY from the shared `progress` value over
 * its own `inputRange` window, clamped so it holds at rest before/after that window instead of
 * over- or under-shooting. No new `Animated.Value`; this is purely a different read of the one
 * that already exists. */
function stageStyle(progress: Animated.Value, inputRange: [number, number]) {
  return {
    opacity: progress.interpolate({
      inputRange,
      outputRange: [0, 1],
      extrapolate: "clamp" as const,
    }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange,
          outputRange: [8, 0],
          extrapolate: "clamp" as const,
        }),
      },
    ],
  };
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
    backgroundColor: ROOM_COLORS.wallBase,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 22,
  },

  body: {
    width: "100%",
    gap: 16,
  },

  // Sprint 4.3 — matches `body`'s own gap so grouping items inside a staged Animated.View
  // reproduces the original spacing exactly once the whole card is revealed.
  stageGroup: {
    gap: 16,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E291F",
    textAlign: "center",
  },

  section: {
    gap: 4,
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

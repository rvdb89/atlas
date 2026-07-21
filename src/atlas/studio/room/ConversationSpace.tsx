import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ROOM_COLORS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";

/**
 * Conversation Space — Sprint 17 ("First Conversation," the space, not the
 * AI). Opens behind the Heart. Deliberately not a chat window: no message
 * bubbles, no avatar, no send button, no "Atlas is typing" indicator, no
 * message history. The CEO has the initiative; Atlas says nothing — that
 * silence is not a missing feature, it is the entire point of this sprint
 * (`ATLAS_RELATIONSHIP_MODEL_CANDIDATE.md`, "Het initiatief ligt altijd bij
 * de CEO").
 *
 * There is intentionally no response mechanism here at all yet — no LLM,
 * no API, no simulated reply. What the CEO types is never "sent" anywhere;
 * it simply exists, visibly, as their own words in the space. Text clears
 * when the space closes rather than persisting, because Atlas has no
 * memory yet and pretending otherwise would be dishonest about current
 * capability.
 */
export default function ConversationSpace({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const progress = useRoomTransition(visible);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // The CEO already gave the initiative by approaching the Heart —
      // making the field ready to receive that isn't Atlas asking
      // anything, it's the space being usable the instant it opens.
      const focusTimeout = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(focusTimeout);
    }
    // No memory yet — closing the space is the honest moment to let go of
    // whatever was typed, rather than quietly implying it was kept.
    setDraft("");
    return undefined;
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.backdrop, { opacity: progress }]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        style={[
          styles.panel,
          {
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* A quiet echo of the Heart — continuity, not a second object. */}
        <View pointerEvents="none" style={styles.presence}>
          <View style={[styles.ring, styles.ringOuter]} />
          <View style={[styles.ring, styles.ringMid]} />
          <View style={[styles.ring, styles.ringCore]} />
        </View>

        <Text style={styles.hint}>Typ om te beginnen</Text>

        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          multiline
          style={styles.input}
          accessibilityLabel="Aan Atlas"
          placeholder=""
          selectionColor={ROOM_COLORS.emberWarm}
          underlineColorAndroid="transparent"
        />

        <Pressable style={styles.closeLink} onPress={onClose}>
          <Text style={styles.closeLabel}>Terug naar Atlas Space</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ROOM_COLORS.backdrop,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  panel: {
    maxWidth: 560,
    width: "100%",
    minHeight: 320,
    backgroundColor: ROOM_COLORS.wallBase,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
    elevation: 8,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: "center",
  },

  presence: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  ring: {
    position: "absolute",
    borderRadius: 999,
  },

  ringOuter: {
    width: 64,
    height: 64,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.14,
  },

  ringMid: {
    width: 38,
    height: 38,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.28,
  },

  ringCore: {
    width: 18,
    height: 18,
    backgroundColor: ROOM_COLORS.emberCore,
    opacity: 0.85,
  },

  hint: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: ROOM_COLORS.textSecondary,
    marginBottom: 16,
  },

  input: {
    width: "100%",
    flex: 1,
    minHeight: 120,
    fontSize: 17,
    lineHeight: 26,
    color: ROOM_COLORS.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: ROOM_COLORS.glassBorder,
    paddingBottom: 12,
    textAlignVertical: "top",
  },

  closeLink: {
    marginTop: 24,
    paddingVertical: 8,
  },

  closeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: ROOM_COLORS.textSecondary,
  },
});

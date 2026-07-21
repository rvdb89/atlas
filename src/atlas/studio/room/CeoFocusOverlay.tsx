import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import type { CeoFocusItem } from "./roomData";
import { ROOM_COLORS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";
import { ADJUST_OPTIONS, type NeedsChangeOptionId } from "@/atlas/studio/control/types";

/**
 * CEO Focus — Threshold Stone's real destination. Sprint 2.2 ("The Room — First Living
 * Prototype") replaces the "CEO Inbox" `PlaceholderOverlay` stub with this purpose-built
 * surface — never a full inbox list, never a table, never a status/urgency badge system.
 * Only the small, real set of things `roomData.ts`'s `selectCeoFocus()` judged worth
 * surfacing, each shown as a title and the reason it matters — nothing else.
 *
 * Two states, both real, neither invented: when nothing currently deserves attention, that
 * is shown directly, calmly (Visual Constitution — "Silence is a decision, not an absence");
 * when something does, only that — capped, short, never a list that scrolls. Reuses the
 * same Soft State Transition (`useRoomTransition`) and card/backdrop tokens every other
 * overlay in The Room already uses, so this reads as the same Atlas, not a different screen
 * wearing the Room's colors.
 *
 * Sprint 4.2 ("Capability Migration 01 — CEO Inbox → Threshold Stone"): Approve, Adjust and
 * Defer are now real actions here, not just a read-only view. Per `ATLAS_OBJECT_SEMANTICS.md`,
 * Threshold Stone represents "the things currently awaiting the CEO" — never a task list,
 * dashboard, menu, or notification center — so these three actions reuse exactly the plain
 * text/pill treatment already established for "Terug naar The Room" below, never a bordered
 * card, badge, status pill, icon, or table row. `onApprove`/`onAdjustClick`/`onAdjustOption`/
 * `onDefer` are the same `approveInbox`/`adjustInbox`/`deferInbox` functions
 * `useControlDashboard()` already exposes to `ControlScreenV2.tsx` — no new business logic,
 * no second mutation path. `adjustingItemId` is the same shared piece of state Atlas Control
 * already owns; this overlay only reads and displays it, never forks its own copy.
 */
export default function CeoFocusOverlay({
  visible,
  items,
  adjustingItemId,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onDefer,
  onClose,
}: {
  visible: boolean;
  items: CeoFocusItem[];
  adjustingItemId: string | null;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onDefer: (id: string) => void;
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

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.backdrop, { opacity: progress }]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View style={[styles.card, cardStyle]}>
        {items.length === 0 ? (
          <Text style={styles.calmMessage}>
            Niets vraagt nu je aandacht. Atlas heeft gekeken — dit is rustig.
          </Text>
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemReason}>{item.reason}</Text>

                {adjustingItemId === item.id ? (
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
                )}
              </View>
            ))}
          </View>
        )}
        <Pressable style={styles.closeButton} onPress={onClose}>
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

  card: {
    maxWidth: 440,
    width: "100%",
    backgroundColor: ROOM_COLORS.wallBase,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 8,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 20,
  },

  calmMessage: {
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
    color: ROOM_COLORS.textPrimary,
  },

  list: {
    width: "100%",
    gap: 18,
  },

  item: {
    gap: 4,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: ROOM_COLORS.textPrimary,
  },

  itemReason: {
    fontSize: 14,
    lineHeight: 20,
    color: ROOM_COLORS.textSecondary,
  },

  // Sprint 4.2 · deliberately not the same solid ember fill as `closeButton` below — three
  // equally strong pills per item would compete with the one real accent action in this
  // overlay (leaving The Room). A quiet neutral tint, drawn from the same text colors already
  // used above, keeps these reading as "acting on this item" rather than a second CTA row.
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
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

  // Sprint 4.2 · the four Adjust options — plain text, no pill chrome at all, so revealing
  // them never reads as a dropdown/menu. Tappable purely via color + weight, the same
  // restraint Threshold Stone itself uses (warmth, never a box).
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 4,
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

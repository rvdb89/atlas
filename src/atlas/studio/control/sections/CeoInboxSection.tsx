import { StyleSheet, Text, View } from "react-native";

import { groupCeoInboxItems } from "../ceoInbox/ceoInboxView";
import ControlButton from "../ControlButton";
import ControlStateBadge from "../ControlStateBadge";
import { CONTROL_COLORS } from "../theme";
import type { ControlSnapshot, NeedsChangeOptionId } from "../types";
import { ADJUST_OPTIONS, INBOX_CATEGORY_LABELS, INBOX_STATUS_LABELS, URGENCY_LABELS } from "../types";

type CeoInboxSectionProps = {
  snapshot: ControlSnapshot;
  adjustingItemId: string | null;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onLater: (id: string) => void;
};

const URGENCY_COLOR: Record<string, string> = {
  urgent: CONTROL_COLORS.danger,
  high: CONTROL_COLORS.warning,
  medium: CONTROL_COLORS.gold,
  low: CONTROL_COLORS.textMuted,
};

const STATUS_COLOR: Record<string, string> = {
  pending: CONTROL_COLORS.gold,
  approved: CONTROL_COLORS.success,
  needs_changes: CONTROL_COLORS.warning,
  deferred: CONTROL_COLORS.textMuted,
};

function InboxItemCard({
  item,
  adjustingItemId,
  muted,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onLater,
}: {
  item: ControlSnapshot["ceoInbox"][number];
  adjustingItemId: string | null;
  muted?: boolean;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onLater: (id: string) => void;
}) {
  const urgencyColor = URGENCY_COLOR[item.urgency] ?? CONTROL_COLORS.textMuted;
  const statusColor = STATUS_COLOR[item.status] ?? CONTROL_COLORS.textMuted;

  return (
    <View style={[styles.itemCard, muted ? styles.itemCardMuted : null]}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor}22` }]}>
          <Text style={[styles.statusPillText, { color: statusColor }]}>
            {INBOX_STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        <View style={styles.typeChip}>
          <Text style={styles.chipLabel}>Type</Text>
          <Text style={styles.chipValue}>{INBOX_CATEGORY_LABELS[item.category]}</Text>
        </View>
        <View style={[styles.urgencyChip, { borderColor: `${urgencyColor}55` }]}>
          <Text style={styles.chipLabel}>Urgency</Text>
          <Text style={[styles.chipValue, { color: urgencyColor }]}>{URGENCY_LABELS[item.urgency]}</Text>
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Reason</Text>
        <Text style={styles.fieldText}>{item.reason}</Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Atlas recommendation</Text>
        <Text style={styles.recommendationText}>{item.recommendation}</Text>
      </View>

      {item.confirmationMessage ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>{item.confirmationMessage}</Text>
        </View>
      ) : null}

      {item.changeNote ? <Text style={styles.changeNote}>{item.changeNote}</Text> : null}

      {item.status === "pending" ? (
        <View style={styles.actions}>
          <ControlButton label="Approve" onPress={() => onApprove(item.id)} />
          <ControlButton label="Adjust" variant="secondary" onPress={() => onAdjustClick(item.id)} />
          <ControlButton label="Later" variant="secondary" onPress={() => onLater(item.id)} />
        </View>
      ) : null}

      {adjustingItemId === item.id ? (
        <View style={styles.adjustPanel}>
          <Text style={styles.adjustLabel}>Kies aanpassing</Text>
          {ADJUST_OPTIONS.map((option) => (
            <ControlButton
              key={option.id}
              label={option.label}
              variant="secondary"
              onPress={() => onAdjustOption(item.id, option.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** CEO Inbox — first functional Atlas Control module, driven by state.approvals. */
export default function CeoInboxSection({
  snapshot,
  adjustingItemId,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onLater,
}: CeoInboxSectionProps) {
  const state = snapshot.companyState;
  const grouped = groupCeoInboxItems(snapshot.ceoInbox);

  return (
    <View style={styles.shell}>
      <View style={styles.shellHeader}>
        <View style={styles.shellCopy}>
          <Text style={styles.eyebrow}>Atlas Control · Module 1</Text>
          <Text style={styles.title}>CEO Inbox</Text>
          <Text style={styles.subtitle}>
            Every decision waiting for Robbert — from Company State, not static cards.
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countValue}>{state.counts.pendingApprovals}</Text>
          <Text style={styles.countLabel}>pending</Text>
        </View>
      </View>

      <ControlStateBadge
        detail={`state.approvals · ${state.counts.approvals} total · ${state.counts.pendingApprovals} pending`}
      />

      {grouped.pending.length === 0 && grouped.deferred.length === 0 && grouped.resolved.length === 0 ? (
        <Text style={styles.empty}>No inbox items in Company State.</Text>
      ) : null}

      {grouped.pending.length > 0 ? (
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Needs your decision · {grouped.pending.length}</Text>
          {grouped.pending.map((item) => (
            <InboxItemCard
              key={item.id}
              item={item}
              adjustingItemId={adjustingItemId}
              onApprove={onApprove}
              onAdjustClick={onAdjustClick}
              onAdjustOption={onAdjustOption}
              onLater={onLater}
            />
          ))}
        </View>
      ) : grouped.resolved.length === 0 && grouped.deferred.length === 0 ? (
        <View style={styles.clearBox}>
          <Text style={styles.clearText}>Inbox clear — no pending decisions.</Text>
        </View>
      ) : null}

      {grouped.deferred.length > 0 ? (
        <View style={styles.group}>
          <Text style={styles.groupTitleMuted}>Deferred · lower priority · {grouped.deferred.length}</Text>
          {grouped.deferred.map((item) => (
            <InboxItemCard
              key={item.id}
              item={item}
              adjustingItemId={adjustingItemId}
              muted
              onApprove={onApprove}
              onAdjustClick={onAdjustClick}
              onAdjustOption={onAdjustOption}
              onLater={onLater}
            />
          ))}
        </View>
      ) : null}

      {grouped.resolved.length > 0 ? (
        <View style={styles.group}>
          <Text style={styles.groupTitleMuted}>Completed · {grouped.resolved.length}</Text>
          {grouped.resolved.map((item) => (
            <InboxItemCard
              key={item.id}
              item={item}
              adjustingItemId={adjustingItemId}
              muted
              onApprove={onApprove}
              onAdjustClick={onAdjustClick}
              onAdjustOption={onAdjustOption}
              onLater={onLater}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 18,
    padding: 20,
    borderRadius: 20,
    backgroundColor: CONTROL_COLORS.surface,
    borderWidth: 2,
    borderColor: CONTROL_COLORS.gold,
    borderLeftWidth: 6,
  },

  shellHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 4,
  },

  shellCopy: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.gold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  title: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: CONTROL_COLORS.textMuted,
  },

  countBadge: {
    alignItems: "center",
    minWidth: 72,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: `${CONTROL_COLORS.gold}18`,
    borderWidth: 1,
    borderColor: `${CONTROL_COLORS.gold}44`,
  },

  countValue: {
    fontSize: 28,
    fontWeight: "900",
    color: CONTROL_COLORS.gold,
  },

  countLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  group: {
    marginTop: 16,
  },

  groupTitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  groupTitleMuted: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  itemCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: CONTROL_COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.borderSoft,
  },

  itemCardMuted: {
    opacity: 0.72,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: CONTROL_COLORS.text,
    lineHeight: 22,
  },

  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  chipRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  typeChip: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: CONTROL_COLORS.surface,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.borderSoft,
  },

  urgencyChip: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: CONTROL_COLORS.surface,
    borderWidth: 1,
  },

  chipLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  chipValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: CONTROL_COLORS.text,
  },

  fieldBlock: {
    marginTop: 12,
  },

  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  fieldText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: CONTROL_COLORS.textMuted,
  },

  recommendationText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: CONTROL_COLORS.text,
  },

  confirmBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: `${CONTROL_COLORS.success}18`,
    borderWidth: 1,
    borderColor: `${CONTROL_COLORS.success}44`,
  },

  confirmText: {
    fontSize: 14,
    fontWeight: "800",
    color: CONTROL_COLORS.success,
  },

  changeNote: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: CONTROL_COLORS.warning,
  },

  actions: {
    marginTop: 14,
    gap: 8,
  },

  adjustPanel: {
    marginTop: 12,
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: CONTROL_COLORS.borderSoft,
  },

  adjustLabel: {
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  clearBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: `${CONTROL_COLORS.success}12`,
    borderWidth: 1,
    borderColor: `${CONTROL_COLORS.success}33`,
  },

  clearText: {
    fontSize: 14,
    fontWeight: "700",
    color: CONTROL_COLORS.success,
    textAlign: "center",
  },

  empty: {
    marginTop: 16,
    fontSize: 14,
    color: CONTROL_COLORS.textMuted,
  },
});

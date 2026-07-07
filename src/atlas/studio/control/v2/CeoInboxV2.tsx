import { StyleSheet, Text, View } from "react-native";

import { groupCeoInboxItems } from "../ceoInbox/ceoInboxView";
import type { ControlSnapshot, NeedsChangeOptionId } from "../types";
import { ADJUST_OPTIONS, INBOX_STATUS_LABELS, URGENCY_LABELS } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import V2Button from "./V2Button";
import { urgencyTone, V2 } from "./v2Theme";

type CeoInboxV2Props = {
  snapshot: ControlSnapshot;
  adjustingItemId: string | null;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onLater: (id: string) => void;
};

function InboxCard({
  item,
  adjustingItemId,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onLater,
}: {
  item: ControlSnapshot["ceoInbox"][number];
  adjustingItemId: string | null;
  onApprove: (id: string) => void;
  onAdjustClick: (id: string) => void;
  onAdjustOption: (id: string, option: NeedsChangeOptionId) => void;
  onLater: (id: string) => void;
}) {
  const pending = item.status === "pending";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <StatusPill label={URGENCY_LABELS[item.urgency]} tone={urgencyTone(item.urgency)} />
      </View>

      <Text style={styles.status}>{INBOX_STATUS_LABELS[item.status]}</Text>
      <Text style={styles.reason}>{item.reason}</Text>

      <View style={styles.recBox}>
        <Text style={styles.recLabel}>Atlas recommendation</Text>
        <Text style={styles.recText}>{item.recommendation}</Text>
      </View>

      {item.confirmationMessage ? (
        <Text style={styles.confirm}>{item.confirmationMessage}</Text>
      ) : null}
      {item.changeNote ? <Text style={styles.change}>{item.changeNote}</Text> : null}

      {pending ? (
        <View style={styles.actions}>
          <V2Button label="Approve" onPress={() => onApprove(item.id)} variant="success" compact />
          <V2Button label="Adjust" onPress={() => onAdjustClick(item.id)} variant="secondary" compact />
          <V2Button label="Later" onPress={() => onLater(item.id)} variant="ghost" compact />
        </View>
      ) : null}

      {adjustingItemId === item.id ? (
        <View style={styles.adjust}>
          {ADJUST_OPTIONS.map((option) => (
            <V2Button
              key={option.id}
              label={option.label}
              variant="ghost"
              compact
              onPress={() => onAdjustOption(item.id, option.id)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function CeoInboxV2({
  snapshot,
  adjustingItemId,
  onApprove,
  onAdjustClick,
  onAdjustOption,
  onLater,
}: CeoInboxV2Props) {
  const grouped = groupCeoInboxItems(snapshot.ceoInbox);
  const pending = grouped.pending;
  const state = snapshot.companyState;

  return (
    <GlassCard
      title="CEO Inbox"
      subtitle="Decisions waiting for your approval"
      badge={`${state.counts.pendingApprovals} pending`}
    >
      {pending.length === 0 ? (
        <Text style={styles.empty}>Inbox clear — no pending decisions.</Text>
      ) : (
        <View style={styles.grid}>
          {pending.map((item) => (
            <InboxCard
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
      )}

      {grouped.deferred.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Deferred</Text>
          <View style={styles.grid}>
            {grouped.deferred.map((item) => (
              <InboxCard
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
        </>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },

  card: {
    padding: 16,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: V2.text,
    lineHeight: 21,
  },

  status: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "700",
    color: V2.textDim,
    textTransform: "uppercase",
  },

  reason: {
    marginTop: 8,
    fontSize: 13,
    color: V2.textMuted,
    lineHeight: 19,
  },

  recBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: V2.accentSoft,
    borderWidth: 1,
    borderColor: V2.borderGlow,
  },

  recLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  recText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: V2.text,
    lineHeight: 19,
  },

  confirm: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: V2.success,
  },

  change: {
    marginTop: 6,
    fontSize: 12,
    color: V2.warning,
  },

  actions: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  adjust: {
    marginTop: 10,
    gap: 6,
  },

  sectionLabel: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  empty: {
    fontSize: 14,
    color: V2.textMuted,
  },
});

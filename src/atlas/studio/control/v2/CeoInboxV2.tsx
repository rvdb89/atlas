import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { groupCeoInboxItems } from "../ceoInbox/ceoInboxView";
import type { AppliedMissionRecord, ControlSnapshot, NeedsChangeOptionId } from "../types";
import { ADJUST_OPTIONS, INBOX_STATUS_LABELS, URGENCY_LABELS } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import V2Button from "./V2Button";
import { urgencyTone, V2 } from "./v2Theme";

type InboxTab = "open" | "gesloten";

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

      {item.applyWarning ? (
        <Text style={styles.applyWarning}>⚠ {item.applyWarning}</Text>
      ) : null}
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

// Content/tips missies loggen "risico's" die eigenlijk overgeslagen artikelen zijn
// (generatie mislukt, dus nooit toegepast) — geen inhoudelijke risicobeoordeling zoals
// bij execution missies. Zelfde onderliggende `risks: string[]`-veld, andere betekenis.
function isContentPipelineMission(missionId: string): boolean {
  return missionId.startsWith("CONTENT-") || missionId.startsWith("TIPS-");
}

function formatAppliedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AppliedCard({ mission }: { mission: AppliedMissionRecord }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>
          {mission.missionId} · {mission.title}
        </Text>
        <Text style={styles.appliedAt}>{formatAppliedAt(mission.appliedAt)}</Text>
      </View>

      <Text style={styles.reason}>{mission.summary}</Text>

      {mission.files.length > 0 ? (
        <View style={styles.fileList}>
          {mission.files.map((file) => (
            <View key={file.path} style={styles.fileRow}>
              <Text style={styles.fileAction}>{file.action === "modify" ? "wijzig" : "nieuw"}</Text>
              <Text style={styles.filePath} numberOfLines={1}>
                {file.path}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {mission.risks.length > 0 ? (
        <Text style={styles.risks}>
          {isContentPipelineMission(mission.missionId)
            ? // Content/tips engines log a "risk" per artikel dat niet gegenereerd kon worden
              // (bv. lege AI-respons) en dus is overgeslagen — geen fact-check-waarschuwing.
              `${mission.risks.length} item${mission.risks.length === 1 ? "" : "s"} overgeslagen (niet toegepast).`
            : // Execution missions krijgen echte, AI-beoordeelde risico's van het model terug.
              `${mission.risks.length} risico${mission.risks.length === 1 ? "" : "'s"} genoteerd bij het voorstel.`}
        </Text>
      ) : null}

      {mission.validation ? (
        <View style={styles.validationBox}>
          <Text style={mission.validation.typecheckOk ? styles.validationOk : styles.validationFail}>
            {mission.validation.typecheckOk
              ? "✓ TypeScript compileert schoon na toepassen"
              : "⚠ TypeScript-fouten na toepassen — zie details"}
          </Text>
          {!mission.validation.typecheckOk ? (
            <Text style={styles.validationDetail} numberOfLines={4}>
              {mission.validation.typecheckSummary}
            </Text>
          ) : null}
          {mission.validation.testsOk !== undefined ? (
            <Text style={mission.validation.testsOk ? styles.validationOk : styles.validationFail}>
              {mission.validation.testsOk ? "✓ Testsuite geslaagd" : "⚠ Testsuite gefaald — zie details"}
            </Text>
          ) : null}
          {mission.validation.testsOk === false ? (
            <Text style={styles.validationDetail} numberOfLines={4}>
              {mission.validation.testSummary}
            </Text>
          ) : null}
          <Text style={styles.validationDetail}>{mission.validation.stageNote}</Text>
          <Text style={styles.commitLabel}>Voorgesteld commit-bericht</Text>
          <Text style={styles.commitMessage} numberOfLines={3}>
            {mission.validation.suggestedCommitMessage}
          </Text>
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
  const [activeTab, setActiveTab] = useState<InboxTab>("open");
  const grouped = groupCeoInboxItems(snapshot.ceoInbox);
  const pending = grouped.pending;
  const closed = snapshot.appliedHistory;
  const state = snapshot.companyState;
  const openBadge =
    grouped.attention.length > 0
      ? `${state.counts.pendingApprovals} pending · ${grouped.attention.length} needs attention`
      : `${state.counts.pendingApprovals} pending`;

  return (
    <GlassCard
      title="CEO Inbox"
      subtitle={
        activeTab === "open"
          ? "Decisions waiting for your approval"
          : "Wat Atlas al écht heeft toegepast, nieuwste eerst"
      }
      badge={activeTab === "open" ? openBadge : `${closed.length} toegepast`}
    >
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab("open")}
          style={[styles.tab, activeTab === "open" && styles.tabActive]}
        >
          <Text style={[styles.tabLabel, activeTab === "open" && styles.tabLabelActive]}>
            Open ({pending.length + grouped.attention.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("gesloten")}
          style={[styles.tab, activeTab === "gesloten" && styles.tabActive]}
        >
          <Text style={[styles.tabLabel, activeTab === "gesloten" && styles.tabLabelActive]}>
            Gesloten ({closed.length})
          </Text>
        </Pressable>
      </View>

      {activeTab === "open" ? (
        <>
          {grouped.attention.length > 0 ? (
            <>
              <Text style={styles.sectionLabelWarning}>
                ⚠ Needs attention — goedgekeurd maar niet toegepast
              </Text>
              <View style={styles.grid}>
                {grouped.attention.map((item) => (
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

          {pending.length === 0 && grouped.attention.length === 0 ? (
            <Text style={styles.empty}>Inbox clear — no pending decisions.</Text>
          ) : pending.length > 0 ? (
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
          ) : null}

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
        </>
      ) : closed.length === 0 ? (
        <Text style={styles.empty}>Nog niets toegepast — hier verschijnt elke goedgekeurde wijziging.</Text>
      ) : (
        <View style={styles.grid}>
          {closed.map((mission) => (
            <AppliedCard key={`${mission.missionId}-${mission.appliedAt}`} mission={mission} />
          ))}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: V2.border,
    backgroundColor: "transparent",
  },

  tabActive: {
    backgroundColor: V2.accentSoft,
    borderColor: V2.borderGlow,
  },

  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: V2.textMuted,
  },

  tabLabelActive: {
    color: V2.accent,
  },

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

  appliedAt: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.textDim,
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

  applyWarning: {
    marginTop: 10,
    padding: 10,
    borderRadius: V2.radiusSm,
    fontSize: 12,
    fontWeight: "700",
    color: V2.danger,
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
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

  sectionLabelWarning: {
    marginBottom: 10,
    fontSize: 10,
    fontWeight: "800",
    color: V2.danger,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  fileList: {
    marginTop: 12,
    gap: 4,
  },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  fileAction: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.accent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    width: 42,
  },

  filePath: {
    flex: 1,
    fontSize: 12,
    color: V2.textMuted,
  },

  risks: {
    marginTop: 10,
    fontSize: 11,
    color: V2.warning,
  },

  validationBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
    gap: 4,
  },

  validationOk: {
    fontSize: 12,
    fontWeight: "700",
    color: V2.success,
  },

  validationFail: {
    fontSize: 12,
    fontWeight: "700",
    color: V2.danger,
  },

  validationDetail: {
    fontSize: 11,
    color: V2.textMuted,
    fontFamily: "monospace",
  },

  commitLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  commitMessage: {
    fontSize: 11,
    color: V2.text,
    fontFamily: "monospace",
  },

  empty: {
    fontSize: 14,
    color: V2.textMuted,
  },
});

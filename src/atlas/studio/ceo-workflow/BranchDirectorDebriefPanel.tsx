import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { StudioCard } from "../components";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { CEO_ADJUST_OPTIONS } from "./BranchDirectorDebrief";
import type { BranchDirectorDebrief, CeoAdjustOptionId, CeoWorkflowState } from "./ceoWorkflow.types";

type BranchDirectorDebriefPanelProps = {
  workflow: CeoWorkflowState;
  running: boolean;
  onContinue: () => void;
  onAdjust: (option: CeoAdjustOptionId) => void;
};

export default function BranchDirectorDebriefPanel({
  workflow,
  running,
  onContinue,
  onAdjust,
}: BranchDirectorDebriefPanelProps) {
  const debrief = workflow.debrief;
  const [showAdjustOptions, setShowAdjustOptions] = useState(false);

  if (!debrief && !workflow.ceoContinueDecision) return null;

  const continueDecision = workflow.ceoContinueDecision;
  const awaitingContinueDecision = continueDecision?.status === "awaiting";
  const showDecisionButtons =
    workflow.status === "awaiting_ceo_debrief" && awaitingContinueDecision && !showAdjustOptions;
  const showPausedAdjust =
    workflow.status === "paused" ||
    showAdjustOptions ||
    continueDecision?.status === "adjustment_requested";

  return (
    <StudioCard>
      <Text style={styles.roleLabel}>Branch Director debrief</Text>
      {debrief ? (
        <>
          <Text style={styles.headline}>{debrief.headline}</Text>

          {debrief.summary.split("\n").slice(1).map((line) => (
            <Text key={line} style={styles.summaryLine}>
              {line}
            </Text>
          ))}

          <View style={styles.metrics}>
            <Metric label="Initiative" value={formatInitiative(debrief.initiativeId, debrief.initiativeTitle)} />
            <Metric label="Status" value={debrief.statusLabel} />
            <Metric label="Review" value={debrief.reviewResult} />
            <Metric label="Blockers" value={String(debrief.blockerCount)} />
            <Metric label="Aandachtspunten" value={String(debrief.warningCount)} />
            <Metric
              label="Door kunnen gaan"
              value={debrief.readyToContinue ? "Ja" : "Nog niet"}
            />
          </View>

          {debrief.blockers.length > 0 ? (
            <View style={styles.listBlock}>
              <Text style={styles.listTitle}>Belemmeringen</Text>
              {debrief.blockers.slice(0, 3).map((item) => (
                <Text key={item.title} style={styles.listItem}>
                  · {item.title}
                </Text>
              ))}
            </View>
          ) : null}

          {debrief.warnings.length > 0 ? (
            <View style={styles.listBlock}>
              <Text style={styles.listTitle}>Aandachtspunten</Text>
              {debrief.warnings.slice(0, 3).map((item) => (
                <Text key={item.title} style={styles.listItem}>
                  · {item.title}
                </Text>
              ))}
            </View>
          ) : null}
        </>
      ) : null}

      {continueDecision?.status === "completed" && continueDecision.confirmationMessage ? (
        <Text style={styles.decisionComplete}>{continueDecision.confirmationMessage}</Text>
      ) : null}

      {showDecisionButtons && debrief ? (
        <>
          <Text style={styles.question}>{debrief.question}</Text>
          <View style={styles.actions}>
            <Pressable
              style={[styles.continueButton, running && styles.buttonDisabled]}
              onPress={onContinue}
              disabled={running}
            >
              {running ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Ja, ga door</Text>
              )}
            </Pressable>
            <Pressable
              style={[styles.adjustButton, running && styles.buttonDisabled]}
              onPress={() => setShowAdjustOptions(true)}
              disabled={running}
            >
              <Text style={styles.adjustButtonText}>Nee, aanpassen</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {showPausedAdjust ? (
        <View style={styles.adjustBlock}>
          <Text style={styles.adjustTitle}>Wat wil je aanpassen?</Text>
          {CEO_ADJUST_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.optionRow,
                continueDecision?.adjustOption === option.id && styles.optionRowSelected,
              ]}
              onPress={() => onAdjust(option.id)}
              disabled={running}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </Pressable>
          ))}
          {debrief?.adjustFeedback ? (
            <Text style={styles.feedback}>Feedback: {debrief.adjustFeedback}</Text>
          ) : null}
        </View>
      ) : null}

      {workflow.status === "paused" ? (
        <Text style={styles.pausedNote}>
          Atlas wacht op jouw richting. Geef nieuwe intent wanneer je verder wilt.
        </Text>
      ) : null}
    </StudioCard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function formatInitiative(id: string | null, title: string | null): string {
  if (title && id) return `${title} (${id})`;
  return title ?? id ?? "Onbekend";
}

const styles = StyleSheet.create({
  roleLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  headline: {
    fontSize: 24,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginBottom: 8,
  },

  summaryLine: {
    fontSize: 16,
    lineHeight: 24,
    color: STUDIO_COLORS.brown,
    fontWeight: "600",
    marginBottom: 4,
  },

  metrics: {
    marginTop: 16,
    gap: 10,
  },

  metric: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  metricLabel: {
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
    fontWeight: "700",
  },

  metricValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: STUDIO_COLORS.brown,
    fontWeight: "700",
  },

  listBlock: {
    marginTop: 14,
    padding: 12,
    borderRadius: STUDIO_RADIUS.input,
    backgroundColor: STUDIO_COLORS.cream,
  },

  listTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  listItem: {
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },

  question: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  decisionComplete: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: STUDIO_COLORS.success,
    fontWeight: "800",
  },

  actions: {
    marginTop: 14,
    gap: 10,
  },

  continueButton: {
    backgroundColor: STUDIO_COLORS.success,
    borderRadius: STUDIO_RADIUS.input,
    paddingVertical: 16,
    alignItems: "center",
  },

  adjustButton: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.input,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },

  adjustButtonText: {
    color: STUDIO_COLORS.brown,
    fontSize: 15,
    fontWeight: "800",
  },

  adjustBlock: {
    marginTop: 16,
    gap: 8,
  },

  adjustTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginBottom: 4,
  },

  optionRow: {
    padding: 12,
    borderRadius: STUDIO_RADIUS.input,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    backgroundColor: STUDIO_COLORS.cream,
  },

  optionRowSelected: {
    borderColor: STUDIO_COLORS.accent,
    backgroundColor: STUDIO_COLORS.warmWhite,
  },

  optionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  optionDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },

  feedback: {
    marginTop: 8,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  pausedNote: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },
});

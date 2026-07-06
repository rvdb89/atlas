import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getBranchDirectorTerminology } from "@/atlas/constitution";
import {
  StudioCard,
  StudioScreen,
  StudioSectionTitle,
} from "../components";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { useStudioBootstrap } from "../hooks/useStudioBootstrap";
import BranchDirectorDebriefPanel from "./BranchDirectorDebriefPanel";
import CapabilityIntelligencePanel from "./CapabilityIntelligencePanel";
import { DEBRIEF_FLOW_HIERARCHY } from "./ceoWorkflow.constants";
import type { CeoAdjustOptionId } from "./ceoWorkflow.types";
import CeoWorkflowTimeline from "./CeoWorkflowTimeline";
import { useCeoWorkflow } from "./useCeoWorkflow";

export default function CeoWorkflowScreen() {
  useStudioBootstrap();
  const terms = getBranchDirectorTerminology();
  const {
    workflow,
    running,
    error,
    runWorkflow,
    approveRelease,
    continueAfterDebrief,
    adjustAfterDebrief,
  } = useCeoWorkflow();
  const [intent, setIntent] = useState("I want Atlas to improve the CEO workflow in Studio.");

  const awaitingApproval = workflow?.status === "awaiting_ceo_approval";
  const awaitingDebrief = workflow?.status === "awaiting_ceo_debrief";
  const paused = workflow?.status === "paused";

  async function handleRunWorkflow() {
    if (!intent.trim()) return;
    await runWorkflow(intent.trim());
  }

  async function handleApproveRelease() {
    await approveRelease(workflow?.impact?.suggestedCommitMessage);
  }

  async function handleContinue() {
    await continueAfterDebrief();
  }

  async function handleAdjust(option: CeoAdjustOptionId) {
    await adjustAfterDebrief(option);
  }

  return (
    <StudioScreen
      title="CEO Workflow"
      subtitle="Geef intent — Atlas beslist, voert uit, reviewt en rapporteert als Branch Director. Jij keurt goed."
    >
      <StudioCard compact>
        <Text style={styles.pipelineLabel}>Branch Director debrief flow</Text>
        <Text style={styles.pipelineFlow}>{DEBRIEF_FLOW_HIERARCHY.join(" → ")}</Text>
      </StudioCard>

      <StudioSectionTitle>1 · Intent</StudioSectionTitle>
      <StudioCard>
        <Text style={styles.fieldLabel}>Wat wil je dat Atlas doet?</Text>
        <TextInput
          value={intent}
          onChangeText={setIntent}
          placeholder="I want Atlas to…"
          placeholderTextColor={STUDIO_COLORS.secondary}
          multiline
          style={styles.input}
          editable={!running && !paused}
        />
        <Pressable
          style={[styles.primaryButton, running && styles.buttonDisabled]}
          onPress={() => void handleRunWorkflow()}
          disabled={running || !intent.trim() || paused}
        >
          {running ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Start Branch Director workflow</Text>
          )}
        </Pressable>
        <Text style={styles.hint}>
          Atlas valideert en reviewt automatisch. Geen terminal nodig voor normale operatie.
        </Text>
      </StudioCard>

      <StudioSectionTitle>Capability Registry</StudioSectionTitle>
      <CapabilityIntelligencePanel />

      {error ? (
        <StudioCard compact>
          <Text style={styles.errorTitle}>Atlas melding</Text>
          <Text style={styles.errorText}>{error}</Text>
        </StudioCard>
      ) : null}

      {workflow ? (
        <>
          <StudioSectionTitle>2 · Branch Director advies</StudioSectionTitle>
          <StudioCard>
            {workflow.decision ? (
              <>
                <Text style={styles.metricLabel}>{terms.recommendedNextInitiative}</Text>
                <Text style={styles.metricValue}>
                  {workflow.decision.recommendedInitiativeTitle ??
                    workflow.decision.recommendedInitiativeId ??
                    "Operationele routing"}
                </Text>
                <Text style={styles.whyLabel}>Waarom</Text>
                <Text style={styles.whyText}>{workflow.decision.why}</Text>
                {"branchDirectorAdvice" in workflow.decision && workflow.decision.branchDirectorAdvice ? (
                  <>
                    <Text style={styles.whyLabel}>Branch Director</Text>
                    <Text style={styles.adviceText}>{workflow.decision.branchDirectorAdvice}</Text>
                  </>
                ) : null}
              </>
            ) : (
              <Text style={styles.meta}>Beslissing volgt…</Text>
            )}
          </StudioCard>

          {awaitingApproval ? (
            <StudioCard>
              <Text style={styles.approvalTitle}>Atlas is klaar om af te ronden</Text>
              <Text style={styles.approvalText}>
                Atlas heeft de review afgerond en de release voorbereid. Keur goed wanneer jij
                akkoord bent — Atlas rondt de rest af.
              </Text>
              <Pressable
                style={[styles.approveButton, running && styles.buttonDisabled]}
                onPress={() => void handleApproveRelease()}
                disabled={running}
              >
                {running ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Akkoord — Atlas mag afronden</Text>
                )}
              </Pressable>
            </StudioCard>
          ) : null}

          {awaitingDebrief || paused ? (
            <>
              <StudioSectionTitle>3 · Branch Director debrief</StudioSectionTitle>
              <BranchDirectorDebriefPanel
                workflow={workflow}
                running={running}
                onContinue={() => void handleContinue()}
                onAdjust={(option) => void handleAdjust(option)}
              />
            </>
          ) : null}

          <StudioSectionTitle>Voortgang</StudioSectionTitle>
          <CeoWorkflowTimeline steps={workflow.steps} />

          {workflow.status === "blocked" || workflow.status === "failed" ? (
            <StudioCard compact>
              <Text style={styles.errorTitle}>Atlas kan nog niet doorgaan</Text>
              <Text style={styles.errorText}>
                {workflow.error ?? "Branch Director heeft de release tegengehouden."}
              </Text>
            </StudioCard>
          ) : null}
        </>
      ) : null}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  pipelineLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  pipelineFlow: {
    fontSize: 14,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
    fontWeight: "600",
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
    marginBottom: 8,
  },

  input: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    borderRadius: STUDIO_RADIUS.input,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
    backgroundColor: STUDIO_COLORS.cream,
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: STUDIO_COLORS.accent,
    borderRadius: STUDIO_RADIUS.input,
    paddingVertical: 14,
    alignItems: "center",
  },

  approveButton: {
    backgroundColor: STUDIO_COLORS.success,
    borderRadius: STUDIO_RADIUS.input,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },

  hint: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },

  metricLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 8,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginTop: 4,
  },

  whyLabel: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
  },

  whyText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: STUDIO_COLORS.secondary,
  },

  adviceText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
    fontWeight: "600",
  },

  meta: {
    marginTop: 8,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  approvalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  approvalText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: STUDIO_COLORS.secondary,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: STUDIO_COLORS.danger,
  },

  errorText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },
});

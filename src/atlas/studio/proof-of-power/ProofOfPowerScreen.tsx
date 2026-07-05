import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  PROOF_OF_POWER_STEPS,
  runProofOfPowerWorkflow,
} from "@/atlas/workflows/proof-of-power";
import type { ContextSnapshot } from "@/atlas/brain/context";
import type { ExecutionPlan } from "@/atlas/brain/planner/planner.types";
import type {
  ProofOfPowerContentType,
  ProofOfPowerInput,
  ProofOfPowerResult,
  WorkflowStep,
} from "@/atlas/workflows/proof-of-power/types";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import {
  StudioCard,
  StudioChip,
  StudioScreen,
  StudioSectionTitle,
} from "../components";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { useStudioBootstrap } from "../hooks/useStudioBootstrap";
import { studioDataService } from "../services/studioDataService";
import ProofOfPowerPreview from "./ProofOfPowerPreview";
import ProofOfPowerTimeline from "./ProofOfPowerTimeline";
import ExecutionPlanViewer from "./ExecutionPlanViewer";
import ContextSnapshotViewer from "./ContextSnapshotViewer";

const CONTENT_TYPES: ProofOfPowerContentType[] = [
  "Knowledge Bite",
  "Recipe",
  "Technique",
  "Ingredient Guide",
];

const LANGUAGES = ["Nederlands", "English", "Deutsch", "Français"];

function createPendingSteps(): WorkflowStep[] {
  return PROOF_OF_POWER_STEPS.map((step) => ({ ...step, status: "pending" }));
}

export default function ProofOfPowerScreen() {
  useStudioBootstrap();

  const activeModule = studioDataService.getActiveModule();
  const modules = useMemo(() => {
    const registered = listRegisteredModules();
    if (registered.length > 0) {
      return registered.map((module) => ({ id: module.id, label: module.name }));
    }
    return [{ id: "doughbert", label: "Doughbert" }];
  }, []);

  const [topic, setTopic] = useState("T80 Franse bloem");
  const [moduleId, setModuleId] = useState(activeModule?.id ?? modules[0]?.id ?? "doughbert");
  const [contentType, setContentType] = useState<ProofOfPowerContentType>("Knowledge Bite");
  const [language, setLanguage] = useState("Nederlands");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [steps, setSteps] = useState<WorkflowStep[]>(createPendingSteps());
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | undefined>();
  const [contextSnapshot, setContextSnapshot] = useState<ContextSnapshot | undefined>();
  const [result, setResult] = useState<ProofOfPowerResult | undefined>();

  const moduleLabel = modules.find((module) => module.id === moduleId)?.label ?? moduleId;

  async function handleRunWorkflow() {
    if (!topic.trim()) {
      setError("Voer een onderwerp in.");
      return;
    }

    setError(undefined);
    setRunning(true);
    setResult(undefined);
    setExecutionPlan(undefined);
    setContextSnapshot(undefined);
    setSteps(createPendingSteps());

    const input: ProofOfPowerInput = {
      topic: topic.trim(),
      moduleId,
      moduleLabel,
      contentType,
      language,
    };

    try {
      const workflowResult = await runProofOfPowerWorkflow(
        input,
        setSteps,
        setExecutionPlan,
        setContextSnapshot,
      );
      setResult(workflowResult);
    } catch (workflowError) {
      setError(workflowError instanceof Error ? workflowError.message : "Workflow mislukt");
    } finally {
      setRunning(false);
    }
  }

  return (
    <StudioScreen
      title="Proof of Power"
      subtitle="Atlas plans, loads context, then executes: Input → Planner → Memory → Context → Execution Plan → Workflow → Output."
    >
      <StudioSectionTitle>Workflow input</StudioSectionTitle>
      <StudioCard>
        <Text style={styles.fieldLabel}>Topic</Text>
        <TextInput
          value={topic}
          onChangeText={setTopic}
          placeholder="Bijv. T80 Franse bloem"
          placeholderTextColor={STUDIO_COLORS.secondary}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Domain / Module</Text>
        <View style={styles.chips}>
          {modules.map((module) => (
            <StudioChip
              key={module.id}
              label={module.label}
              active={moduleId === module.id}
              onPress={() => setModuleId(module.id)}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Content Type</Text>
        <View style={styles.chips}>
          {CONTENT_TYPES.map((type) => (
            <StudioChip
              key={type}
              label={type}
              active={contentType === type}
              onPress={() => setContentType(type)}
            />
          ))}
        </View>

        <Text style={styles.fieldLabel}>Language</Text>
        <View style={styles.chips}>
          {LANGUAGES.map((option) => (
            <StudioChip
              key={option}
              label={option}
              active={language === option}
              onPress={() => setLanguage(option)}
            />
          ))}
        </View>

        <Pressable
          style={[styles.runButton, running && styles.runButtonDisabled]}
          onPress={handleRunWorkflow}
          disabled={running}
        >
          {running ? (
            <View style={styles.runningRow}>
              <ActivityIndicator color={STUDIO_COLORS.warmWhite} />
              <Text style={styles.runLabel}>Atlas workflow running…</Text>
            </View>
          ) : (
            <Text style={styles.runLabel}>Plan & Run Atlas Workflow</Text>
          )}
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </StudioCard>

      {contextSnapshot ? (
        <>
          <StudioSectionTitle>Context Snapshot</StudioSectionTitle>
          <ContextSnapshotViewer snapshot={contextSnapshot} />
        </>
      ) : null}

      {executionPlan ? (
        <>
          <StudioSectionTitle>Execution Plan</StudioSectionTitle>
          <ExecutionPlanViewer plan={executionPlan} />
        </>
      ) : null}

      <StudioSectionTitle>Workflow timeline</StudioSectionTitle>
      <ProofOfPowerTimeline steps={steps} />

      {result ? (
        <>
          <StudioSectionTitle>Generated draft</StudioSectionTitle>
          <ProofOfPowerPreview result={result} />
        </>
      ) : null}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: STUDIO_RADIUS.input,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: STUDIO_COLORS.brown,
    marginBottom: 12,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  runButton: {
    marginTop: 8,
    backgroundColor: STUDIO_COLORS.accent,
    borderRadius: STUDIO_RADIUS.input,
    paddingVertical: 16,
    alignItems: "center",
  },

  runButtonDisabled: {
    opacity: 0.85,
  },

  runningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  runLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.warmWhite,
  },

  error: {
    marginTop: 12,
    fontSize: 14,
    color: STUDIO_COLORS.danger,
    fontWeight: "700",
  },
});

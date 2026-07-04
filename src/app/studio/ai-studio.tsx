import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ATLAS_AI_TEAM } from "@/atlas/agents/team";
import {
  StudioCard,
  StudioChip,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { runMockAiTask, STUDIO_TASK_OPTIONS } from "@/atlas/studio/ai/mockTasks";
import { useStudioBootstrap, useStudioEntities } from "@/atlas/studio/hooks";
import { studioDataService } from "@/atlas/studio/services/studioDataService";
import type { AiTaskName } from "@/atlas/ai/types";
import type { StudioAiMockResult } from "@/atlas/studio/types";

export default function StudioAiStudioScreen() {
  useStudioBootstrap();
  const module = studioDataService.getActiveModule();
  const { entities } = useStudioEntities();
  const [taskName, setTaskName] = useState<AiTaskName>("GenerateKnowledgeArticle");
  const [targetEntityId, setTargetEntityId] = useState<string | undefined>();
  const [context, setContext] = useState("");
  const [result, setResult] = useState<StudioAiMockResult | undefined>();

  const entityOptions = useMemo(() => entities.slice(0, 8), [entities]);

  return (
    <StudioScreen
      title="AI Studio"
      subtitle="Launch Atlas AI tasks. Agents route through the Orchestrator — mock output for now."
    >
      <StudioSectionTitle>AI Team</StudioSectionTitle>
      <View style={styles.teamGrid}>
        {ATLAS_AI_TEAM.map((member) => (
          <StudioCard key={member.id} compact>
            <Text style={styles.agentName}>
              {member.emoji} {member.name}
            </Text>
            <Text style={styles.agentRole}>{member.role}</Text>
          </StudioCard>
        ))}
      </View>

      <StudioSectionTitle>Task</StudioSectionTitle>
      <View style={styles.chips}>
        {STUDIO_TASK_OPTIONS.map((option) => (
          <StudioChip
            key={option}
            label={option}
            active={taskName === option}
            onPress={() => setTaskName(option)}
          />
        ))}
      </View>

      <StudioSectionTitle>Target entity</StudioSectionTitle>
      <View style={styles.chips}>
        <StudioChip label="None" active={!targetEntityId} onPress={() => setTargetEntityId(undefined)} />
        {entityOptions.map((entity) => (
          <StudioChip
            key={entity.id}
            label={entity.title.slice(0, 24)}
            active={targetEntityId === entity.id}
            onPress={() => setTargetEntityId(entity.id)}
          />
        ))}
      </View>

      <StudioSectionTitle>Prompt / context</StudioSectionTitle>
      <TextInput
        value={context}
        onChangeText={setContext}
        placeholder="Describe what the AI should generate or review…"
        placeholderTextColor={STUDIO_COLORS.secondary}
        multiline
        style={styles.input}
      />

      <Pressable
        style={styles.generateButton}
        onPress={() =>
          setResult(
            runMockAiTask({
              taskName,
              moduleId: module?.id ?? "atlas",
              targetEntityId,
              context,
            }),
          )
        }
      >
        <Text style={styles.generateLabel}>Generate (mock)</Text>
      </Pressable>

      {result ? (
        <>
          <StudioSectionTitle>Mock output</StudioSectionTitle>
          <StudioCard title={result.agentLabel} subtitle={result.modelLabel}>
            <Text style={styles.output}>{result.outputPreview}</Text>
          </StudioCard>
        </>
      ) : null}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  teamGrid: {
    gap: 8,
  },

  agentName: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  agentRole: {
    marginTop: 4,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  input: {
    minHeight: 120,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    textAlignVertical: "top",
  },

  generateButton: {
    marginTop: 16,
    backgroundColor: STUDIO_COLORS.brown,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },

  generateLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: STUDIO_COLORS.warmWhite,
  },

  output: {
    fontSize: 14,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
  },
});

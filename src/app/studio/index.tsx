import { StyleSheet, Text, View } from "react-native";

import AiTeamRoster from "@/components/studio/AiTeamRoster";
import DraftList from "@/components/studio/DraftList";
import ModelOrchestrationPanel from "@/components/studio/ModelOrchestrationPanel";
import PipelineFlowBanner from "@/components/studio/PipelineFlowBanner";
import StudioLayout from "@/components/studio/StudioLayout";
import StudioNavGrid from "@/components/studio/StudioNavGrid";
import { STUDIO_COLORS } from "@/components/studio/studioTheme";
import { EDITOR_IN_CHIEF } from "@/studio/aiTeam";
import { usePublicationStore, useStudioStats } from "@/studio/hooks/usePublicationStore";

export default function StudioDashboardScreen() {
  const { drafts, isGenerating } = usePublicationStore();
  const stats = useStudioStats();

  return (
    <StudioLayout
      title="Publishing Studio"
      subtitle={`${EDITOR_IN_CHIEF.emoji} Jij bent ${EDITOR_IN_CHIEF.name}. Het AI Team produceert — jij keurt goed of af.`}
      backTo="/profile"
    >
      <PipelineFlowBanner />

      <View style={styles.statsRow}>
        <StatCard label="Drafts" value={String(stats.total)} />
        <StatCard label="Review" value={String(stats.inReview)} />
        <StatCard label="Doughbert" value={String(stats.averageBakingScore)} />
      </View>

      {isGenerating ? (
        <Text style={styles.generating}>Het AI Team is aan het werk…</Text>
      ) : null}

      <Text style={styles.sectionTitle}>AI Orchestration</Text>
      <ModelOrchestrationPanel />

      <Text style={styles.sectionTitle}>AI Team</Text>
      <AiTeamRoster compact />

      <Text style={styles.sectionTitle}>Redactie</Text>
      <StudioNavGrid />

      <Text style={styles.sectionTitle}>Recente drafts</Text>
      <DraftList drafts={drafts.slice(0, 3)} />
    </StudioLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  generating: {
    marginBottom: 16,
    fontSize: 15,
    fontWeight: "700",
    color: STUDIO_COLORS.accent,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

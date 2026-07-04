import { StyleSheet, Text, View } from "react-native";

import {
  StudioCard,
  StudioEmptyState,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap, useStudioIntelligence } from "@/atlas/studio/hooks";

export default function StudioIntelligenceScreen() {
  useStudioBootstrap();
  const { data, loading, graph } = useStudioIntelligence();

  if (loading || !data) {
    return (
      <StudioScreen title="Intelligence" subtitle="Atlas Intelligence insights and recommendations.">
        <StudioEmptyState title="Analyzing…" message="Running intelligence analysis on platform signals." />
      </StudioScreen>
    );
  }

  return (
    <StudioScreen
      title="Intelligence"
      subtitle="Content gaps, trends, quality warnings, and recommendations from Atlas Intelligence."
    >
      <StudioSectionTitle>Content gaps</StudioSectionTitle>
      {data.contentGaps.length === 0 ? (
        <StudioCard>
          <Text style={styles.body}>No content gaps detected in the current scope.</Text>
        </StudioCard>
      ) : (
        data.contentGaps.map((gap) => (
          <StudioCard key={gap.topic} compact>
            <Text style={styles.title}>{gap.topic}</Text>
            <Text style={styles.meta}>Priority: {gap.priority}</Text>
          </StudioCard>
        ))
      )}

      <StudioSectionTitle>Trends</StudioSectionTitle>
      {data.trends.length === 0 ? (
        <StudioCard>
          <Text style={styles.body}>Insufficient metric history for trend detection.</Text>
        </StudioCard>
      ) : (
        data.trends.map((trend) => (
          <StudioCard key={trend.metricId} compact>
            <Text style={styles.title}>{trend.metricId}</Text>
            <Text style={styles.meta}>
              {trend.direction} · {trend.changePercent}%
            </Text>
          </StudioCard>
        ))
      )}

      <StudioSectionTitle>Quality warnings</StudioSectionTitle>
      {data.qualityWarnings.length === 0 ? (
        <StudioCard>
          <Text style={styles.body}>No quality warnings below threshold.</Text>
        </StudioCard>
      ) : (
        data.qualityWarnings.map((warning) => (
          <StudioCard key={warning} compact>
            <Text style={styles.body}>{warning}</Text>
          </StudioCard>
        ))
      )}

      <StudioSectionTitle>Recommendations</StudioSectionTitle>
      {data.recommendations.length === 0 ? (
        <StudioCard>
          <Text style={styles.body}>No recommendations yet.</Text>
        </StudioCard>
      ) : (
        data.recommendations.map((item) => (
          <StudioCard key={item.title} compact>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>Priority: {item.priority}</Text>
          </StudioCard>
        ))
      )}

      <StudioSectionTitle>Knowledge graph</StudioSectionTitle>
      <StudioCard title="Graph snapshot" subtitle="Placeholder for interactive graph explorer">
        <View style={styles.graphStats}>
          <GraphStat label="Nodes" value={String(graph?.stats.nodeCount ?? 0)} />
          <GraphStat label="Edges" value={String(graph?.stats.edgeCount ?? 0)} />
          <GraphStat label="Avg degree" value={String(graph?.stats.avgDegree ?? 0)} />
        </View>
        <Text style={styles.placeholder}>
          Interactive knowledge graph visualization will connect Entity Engine relations with Intelligence analytics.
        </Text>
      </StudioCard>
    </StudioScreen>
  );
}

function GraphStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.graphStat}>
      <Text style={styles.graphValue}>{value}</Text>
      <Text style={styles.graphLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  meta: {
    marginTop: 4,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },

  graphStats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  graphStat: {
    flex: 1,
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 16,
    padding: 12,
  },

  graphValue: {
    fontSize: 22,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  graphLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
  },

  placeholder: {
    fontSize: 14,
    lineHeight: 21,
    color: STUDIO_COLORS.secondary,
  },
});

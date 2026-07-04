import { Text } from "react-native";

import {
  StudioCard,
  StudioPipelineBanner,
  StudioScreen,
  StudioSectionTitle,
  StudioStatGrid,
} from "@/atlas/studio/components";
import { useStudioBootstrap, useStudioDashboard } from "@/atlas/studio/hooks";

export default function StudioDashboardScreen() {
  useStudioBootstrap();
  const { stats, module } = useStudioDashboard();

  return (
    <StudioScreen
      title="Atlas Studio"
      subtitle={
        module
          ? `Internal cockpit for ${module.name}. Manage entities, AI tasks, intelligence, and publishing.`
          : "Internal cockpit for Project Atlas verticals."
      }
      backTo="/profile"
    >
      <StudioPipelineBanner />

      <StudioStatGrid
        items={[
          { label: "Entities", value: String(stats.entities) },
          { label: "Drafts", value: String(stats.drafts) },
          { label: "Published", value: String(stats.published) },
          { label: "AI Tasks", value: String(stats.aiTasks) },
          { label: "Quality Issues", value: String(stats.qualityIssues) },
          { label: "Content Gaps", value: String(stats.contentGaps) },
          { label: "Assets", value: String(stats.assets) },
          { label: "Active Modules", value: String(stats.activeModules) },
        ]}
      />

      <StudioSectionTitle>Active module</StudioSectionTitle>
      <StudioCard title={module?.name ?? "No module"} subtitle={module?.mission}>
        <Text style={{ fontSize: 14, color: "#7A6652" }}>
          Module id: {module?.id ?? "—"}
        </Text>
      </StudioCard>
    </StudioScreen>
  );
}

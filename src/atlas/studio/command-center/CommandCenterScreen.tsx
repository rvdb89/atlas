import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { StudioScreen, StudioSectionTitle, StudioStatGrid } from "../components";
import { STUDIO_COLORS } from "../core/theme";
import { useStudioBootstrap } from "../hooks/useStudioBootstrap";
import { loadCommandCenterSnapshot } from "./commandCenterDataService";
import ModuleStatusPanel from "./ModuleStatusPanel";
import ProviderStatusPanel from "./ProviderStatusPanel";
import QualityPanel from "./QualityPanel";
import RecentTasksPanel from "./RecentTasksPanel";
import SystemAlertsPanel from "./SystemAlertsPanel";
import WorkflowStatusPanel from "./WorkflowStatusPanel";
import type { CommandCenterSnapshot } from "./types";

export default function CommandCenterScreen() {
  useStudioBootstrap();
  const [snapshot, setSnapshot] = useState<CommandCenterSnapshot | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommandCenterSnapshot()
      .then(setSnapshot)
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudioScreen
      title="Command Center"
      subtitle="Central Atlas Studio cockpit — health, providers, workflows, quality, and alerts in one view."
    >
      {loading || !snapshot ? (
        <View style={styles.loading}>
          <ActivityIndicator color={STUDIO_COLORS.accent} />
          <Text style={styles.loadingText}>Loading Atlas Command Center…</Text>
        </View>
      ) : (
        <>
          <StudioStatGrid
            items={[
              { label: "Atlas Health", value: snapshot.summary.atlasHealth },
              { label: "Active Providers", value: String(snapshot.summary.activeProviders) },
              { label: "Running Workflows", value: String(snapshot.summary.runningWorkflows) },
              { label: "Quality Score", value: String(snapshot.summary.qualityScore) },
              { label: "Drafts", value: String(snapshot.summary.drafts) },
              { label: "Alerts", value: String(snapshot.summary.alerts) },
            ]}
          />

          <StudioSectionTitle>Platform overview</StudioSectionTitle>
          <ProviderStatusPanel providers={snapshot.providers} />
          <WorkflowStatusPanel workflows={snapshot.workflows} />
          <RecentTasksPanel tasks={snapshot.recentTasks} />
          <SystemAlertsPanel alerts={snapshot.alerts} />
          <ModuleStatusPanel modules={snapshot.modules} />
          <QualityPanel quality={snapshot.quality} publishing={snapshot.publishing} />
        </>
      )}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: STUDIO_COLORS.secondary,
  },
});

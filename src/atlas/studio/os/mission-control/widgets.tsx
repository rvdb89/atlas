import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { getAtlasHealthSnapshot } from "@/atlas/diagnostics";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { listProviders } from "@/atlas/ai/providers/registry";
import { listWorkflows } from "@/atlas/workflows/registry";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";

import { loadCommandCenterSnapshot } from "../../command-center/commandCenterDataService";
import type { CommandCenterSnapshot } from "../../command-center/types";
import { studioDataService } from "../../services/studioDataService";
import { STUDIO_COLORS } from "../../core/theme";
import { Card, Metric, StatusBadge } from "../design-system";
import { listRecentActivity } from "../registries/activityRegistry";
import type { MissionControlWidgetProps } from "../types";

function WidgetFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card title={title}>{children}</Card>;
}

export function AtlasHealthWidget(_props: MissionControlWidgetProps) {
  const health = getAtlasHealthSnapshot();
  const healthy = health.checks.filter((check) => check.ok).length;

  return (
    <WidgetFrame title="Atlas Health">
      <Metric label="Checks" value={`${healthy}/${health.checks.length}`} hint="Platform diagnostics" />
      <View style={styles.row}>
        <StatusBadge label="Core online" tone="healthy" />
      </View>
    </WidgetFrame>
  );
}

export function ClaudeStatusWidget(_props: MissionControlWidgetProps) {
  const configured = isAnthropicConfigured();
  const claude = listLiveProviders().find((provider) => provider.id === "claude");

  return (
    <WidgetFrame title="Claude Status">
      <Metric label="Mode" value={configured ? "Live" : "Mock"} />
      <Text style={styles.copy}>{claude?.label ?? "Claude provider"} ready</Text>
      <StatusBadge label={configured ? "Configured" : "Mock fallback"} tone={configured ? "healthy" : "mock"} />
    </WidgetFrame>
  );
}

export function ActiveWorkflowsWidget(_props: MissionControlWidgetProps) {
  const workflows = listWorkflows();

  return (
    <WidgetFrame title="Active Workflows">
      <Metric label="Registered" value={workflows.length} />
      {workflows.slice(0, 3).map((workflow) => (
        <Text key={workflow.id} style={styles.copy}>
          • {workflow.label}
        </Text>
      ))}
    </WidgetFrame>
  );
}

export function PublishingQueueWidget(_props: MissionControlWidgetProps) {
  const items = studioDataService.listPublishingItems();

  return (
    <WidgetFrame title="Publishing Queue">
      <View style={styles.metrics}>
        <Metric label="Draft" value={items.filter((item) => item.stage === "draft").length} />
        <Metric label="Review" value={items.filter((item) => item.stage === "review").length} />
      </View>
    </WidgetFrame>
  );
}

export function RecentActivityWidget(_props: MissionControlWidgetProps) {
  const items = listRecentActivity(4);

  return (
    <WidgetFrame title="Recent Activity">
      {items.map((item) => (
        <Text key={item.id} style={styles.copy}>
          • {item.title} — {item.message}
        </Text>
      ))}
    </WidgetFrame>
  );
}

export function AlertsWidget(_props: MissionControlWidgetProps) {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadCommandCenterSnapshot().then((snapshot) => {
      setAlerts(snapshot.alerts.slice(0, 4).map((alert) => alert.message));
    });
  }, []);

  return (
    <WidgetFrame title="Alerts">
      {alerts.map((alert) => (
        <Text key={alert} style={styles.copy}>
          • {alert}
        </Text>
      ))}
    </WidgetFrame>
  );
}

export function KnowledgeGrowthWidget(_props: MissionControlWidgetProps) {
  const stats = studioDataService.getDashboardStats();

  return (
    <WidgetFrame title="Knowledge Growth">
      <Metric label="Content gaps" value={stats.contentGaps} hint="Intelligence backlog" />
    </WidgetFrame>
  );
}

export function EntitiesWidget(_props: MissionControlWidgetProps) {
  const stats = studioDataService.getDashboardStats();

  return (
    <WidgetFrame title="Entities">
      <Metric label="Catalog" value={stats.entities} hint="Registered entities" />
    </WidgetFrame>
  );
}

export function ProvidersWidget(_props: MissionControlWidgetProps) {
  const providers = listProviders();

  return (
    <WidgetFrame title="Providers">
      <Metric label="Registered" value={providers.length} />
      <Text style={styles.copy}>{providers.map((provider) => provider.id).join(" · ")}</Text>
    </WidgetFrame>
  );
}

export function PerformanceWidget(_props: MissionControlWidgetProps) {
  const module = tryGetActiveModule();

  return (
    <WidgetFrame title="Performance">
      <Metric label="AI Tasks" value={studioDataService.getDashboardStats().aiTasks} />
      <Text style={styles.copy}>Active module · {module?.name ?? "None"}</Text>
    </WidgetFrame>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 10,
  },

  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  copy: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },
});

export type { CommandCenterSnapshot };

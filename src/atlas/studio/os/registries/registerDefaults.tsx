import { Text } from "react-native";

import { activityProviderRegistry } from "./activityRegistry";
import { commandRegistry } from "./commandRegistry";
import { inspectorRegistry } from "./inspectorRegistry";
import { quickActionRegistry } from "./quickActionRegistry";
import { searchProviderRegistry } from "./searchProviderRegistry";
import { widgetRegistry } from "./widgetRegistry";
import { MOCK_STUDIO_ACTIVITY } from "../data/mockActivity";
import { searchAtlasMemory } from "../data/memorySearch";
import {
  searchMockAssets,
  searchMockEntities,
  searchMockKnowledge,
  searchMockModules,
  searchMockProviders,
  searchMockRecipes,
  searchMockWorkflows,
} from "../data/mockSearch";
import {
  ActiveWorkflowsWidget,
  AlertsWidget,
  AtlasHealthWidget,
  AtlasMemoryWidget,
  AtlasContextWidget,
  AtlasPlannerWidget,
  ClaudeStatusWidget,
  EntitiesWidget,
  KnowledgeGrowthWidget,
  PerformanceWidget,
  ProvidersWidget,
  PublishingQueueWidget,
  RecentActivityWidget,
} from "../mission-control/widgets";
import { studioOsActions } from "../services/studioOsActions";
import type { StudioOsCommandContext } from "../types";
import { InspectorPanel, Metric } from "../design-system";
import { studioDataService } from "../../services/studioDataService";
import { STUDIO_COLORS } from "../../core/theme";
import { memoryEngine } from "@/atlas/brain/memory";
import { contextEngine } from "@/atlas/brain/context";
import { getPlannerSnapshot } from "@/atlas/brain/planner/PlannerEngine";
import { pushAtlasDevNotification } from "@/atlas/studio/developer/devEvents";

let registered = false;

function nav(ctx: StudioOsCommandContext, route: string) {
  ctx.navigate(route);
  ctx.closePalette();
}

export function registerAtlasOsDefaults(): void {
  if (registered) return;
  registered = true;

  const commands: Array<Parameters<typeof commandRegistry.register>[0]> = [
    { id: "run-workflow", label: "Run Workflow", group: "Workflows", keywords: ["proof", "pipeline"], run: (ctx) => nav(ctx, "/studio/proof-of-power") },
    { id: "open-command-center", label: "Open Command Center", group: "Navigation", keywords: ["cockpit"], run: (ctx) => nav(ctx, "/studio/command-center") },
    { id: "open-proof-of-power", label: "Open Proof of Power", group: "Navigation", run: (ctx) => nav(ctx, "/studio/proof-of-power") },
    { id: "open-entities", label: "Open Entities", group: "Navigation", run: (ctx) => nav(ctx, "/studio/entities") },
    { id: "generate-knowledge", label: "Generate Knowledge", group: "AI", keywords: ["write", "article"], run: (ctx) => nav(ctx, "/studio/ai-studio") },
    { id: "publish-draft", label: "Publish Draft", group: "Publishing", run: (ctx) => nav(ctx, "/studio/publishing") },
    { id: "health-dashboard", label: "Health Dashboard", group: "Diagnostics", run: (ctx) => nav(ctx, "/studio/health") },
    { id: "claude-status", label: "Claude Status", group: "Providers", run: (ctx) => nav(ctx, "/studio/command-center") },
    { id: "restart-provider", label: "Restart Provider", group: "Providers", run: (ctx) => { studioOsActions.restartProvider("claude"); ctx.closePalette(); } },
    { id: "reload-registry", label: "Reload Registry", group: "System", run: (ctx) => { studioOsActions.reloadRegistry(); ctx.refresh(); ctx.closePalette(); } },
    { id: "search-entity", label: "Search Entity", group: "Search", run: (ctx) => ctx.openSearch() },
    { id: "search-workflow", label: "Search Workflow", group: "Search", run: (ctx) => ctx.openSearch() },
    { id: "search-module", label: "Search Module", group: "Search", run: (ctx) => ctx.openSearch() },
    { id: "open-mission-control", label: "Open Mission Control", group: "Navigation", run: (ctx) => nav(ctx, "/studio") },
    { id: "search-memory", label: "Search Memory", group: "Memory", keywords: ["remember", "recall"], run: (ctx) => ctx.openSearch() },
    {
      id: "create-memory",
      label: "Create Memory",
      group: "Memory",
      run: (ctx) => {
        memoryEngine.saveMemory({
          type: "knowledge",
          title: "Atlas Studio note",
          summary: "Manual memory entry created from Command Palette",
          content: JSON.stringify({ createdFrom: "command-palette", at: new Date().toISOString() }),
          tags: ["manual", "studio"],
          source: "atlas.studio.command-palette",
          importance: 5,
          confidence: 0.75,
        });
        pushAtlasDevNotification({
          kind: "registry",
          title: "Memory created",
          message: "New knowledge memory saved locally",
        });
        ctx.closePalette();
      },
    },
    {
      id: "open-recent-memory",
      label: "Open Recent Memory",
      group: "Memory",
      run: (ctx) => {
        nav(ctx, "/studio/command-center");
      },
    },
    {
      id: "memory-health",
      label: "Memory Health",
      group: "Memory",
      run: (ctx) => {
        const snapshot = memoryEngine.getSnapshot();
        pushAtlasDevNotification({
          kind: "health",
          title: "Memory health",
          message: `${snapshot.total} memories · ${snapshot.health}`,
        });
        nav(ctx, "/studio/command-center");
      },
    },
    {
      id: "open-current-context",
      label: "Open Current Context",
      group: "Context",
      keywords: ["goal", "snapshot"],
      run: (ctx) => nav(ctx, "/studio"),
    },
    {
      id: "refresh-context",
      label: "Refresh Context",
      group: "Context",
      run: (ctx) => {
        const planner = getPlannerSnapshot();
        const goal = planner.currentPlan?.goal ?? "Atlas idle context";
        contextEngine.createSnapshot({
          goal,
          executionPlan: planner.currentPlan,
        });
        pushAtlasDevNotification({
          kind: "registry",
          title: "Context refreshed",
          message: goal,
        });
        ctx.refresh();
        ctx.closePalette();
      },
    },
    {
      id: "inspect-context",
      label: "Inspect Context",
      group: "Context",
      run: (ctx) => {
        const snapshot = contextEngine.getSnapshot();
        pushAtlasDevNotification({
          kind: "registry",
          title: "Context inspect",
          message: snapshot
            ? `${snapshot.relevantMemories.length} memories · ${snapshot.loadedProviders.length} providers · ${snapshot.health}`
            : "No context snapshot loaded",
        });
        ctx.closePalette();
      },
    },
    {
      id: "context-health",
      label: "Context Health",
      group: "Context",
      run: (ctx) => {
        const snapshot = contextEngine.getSnapshot();
        pushAtlasDevNotification({
          kind: "health",
          title: "Context health",
          message: snapshot ? `${snapshot.health} · ${snapshot.goal}` : "empty · no active context",
        });
        nav(ctx, "/studio");
      },
    },
  ];

  for (const command of commands) {
    commandRegistry.register(command);
  }

  const searchProviders = [
    { id: "entities", label: "Entities", search: searchMockEntities },
    { id: "recipes", label: "Recipes", search: searchMockRecipes },
    { id: "knowledge", label: "Knowledge", search: searchMockKnowledge },
    { id: "modules", label: "Modules", search: searchMockModules },
    { id: "workflows", label: "Workflows", search: searchMockWorkflows },
    { id: "providers", label: "Providers", search: searchMockProviders },
    { id: "assets", label: "Assets", search: searchMockAssets },
    { id: "memory", label: "Memory", search: searchAtlasMemory },
  ];

  for (const provider of searchProviders) {
    searchProviderRegistry.register(provider);
  }

  activityProviderRegistry.register({
    id: "mock-activity",
    label: "Studio Activity",
    list: () => MOCK_STUDIO_ACTIVITY,
  });

  const widgets = [
    { id: "atlas-health", title: "Atlas Health", order: 1, span: "half" as const, component: AtlasHealthWidget },
    { id: "atlas-planner", title: "Atlas Planner", order: 2, span: "half" as const, component: AtlasPlannerWidget },
    { id: "atlas-memory", title: "Atlas Memory", order: 3, span: "half" as const, component: AtlasMemoryWidget },
    { id: "atlas-context", title: "Current Context", order: 4, span: "half" as const, component: AtlasContextWidget },
    { id: "claude-status", title: "Claude Status", order: 5, span: "half" as const, component: ClaudeStatusWidget },
    { id: "active-workflows", title: "Active Workflows", order: 6, span: "half" as const, component: ActiveWorkflowsWidget },
    { id: "publishing-queue", title: "Publishing Queue", order: 7, span: "half" as const, component: PublishingQueueWidget },
    { id: "recent-activity", title: "Recent Activity", order: 8, span: "full" as const, component: RecentActivityWidget },
    { id: "alerts", title: "Alerts", order: 9, span: "half" as const, component: AlertsWidget },
    { id: "knowledge-growth", title: "Knowledge Growth", order: 10, span: "half" as const, component: KnowledgeGrowthWidget },
    { id: "entities", title: "Entities", order: 11, span: "half" as const, component: EntitiesWidget },
    { id: "providers", title: "Providers", order: 12, span: "half" as const, component: ProvidersWidget },
    { id: "performance", title: "Performance", order: 13, span: "full" as const, component: PerformanceWidget },
  ];

  for (const widget of widgets) {
    widgetRegistry.register(widget);
  }

  const quickActions = [
    { id: "create-entity", label: "Create Entity", emoji: "⬡", run: (ctx: StudioOsCommandContext) => nav(ctx, "/studio/entities") },
    { id: "generate-knowledge", label: "Generate Knowledge", emoji: "✦", run: (ctx: StudioOsCommandContext) => nav(ctx, "/studio/ai-studio") },
    { id: "run-workflow", label: "Run Workflow", emoji: "⚡", run: (ctx: StudioOsCommandContext) => nav(ctx, "/studio/proof-of-power") },
    { id: "publish", label: "Publish", emoji: "→", run: (ctx: StudioOsCommandContext) => nav(ctx, "/studio/publishing") },
    { id: "research", label: "Research", emoji: "◎", run: (ctx: StudioOsCommandContext) => nav(ctx, "/studio/intelligence") },
    { id: "visual-generation", label: "Visual Generation", emoji: "▢", run: (ctx: StudioOsCommandContext) => nav(ctx, "/studio/assets") },
  ];

  for (const action of quickActions) {
    quickActionRegistry.register(action);
  }

  inspectorRegistry.register({
    id: "mission-default",
    title: "Mission Control",
    order: 1,
    matchRoute: (pathname) => pathname === "/studio" || pathname === "/studio/",
    render: () => (
      <InspectorPanel title="Mission Control">
        <Metric label="Entities" value={studioDataService.getDashboardStats().entities} />
        <Text style={{ marginTop: 8, fontSize: 12, color: STUDIO_COLORS.secondary }}>
          Atlas OS cockpit overview
        </Text>
      </InspectorPanel>
    ),
  });

  inspectorRegistry.register({
    id: "command-center",
    title: "Command Center",
    order: 1,
    matchRoute: (pathname) => pathname.includes("/command-center"),
    render: () => (
      <InspectorPanel title="Actions">
        <Text style={{ fontSize: 12, color: STUDIO_COLORS.secondary }}>
          Use Command Center actions to restart providers, reload registries, and run health checks.
        </Text>
      </InspectorPanel>
    ),
  });
}

import { aiTelemetryStore } from "@/atlas/ai/telemetry/TelemetryStore";
import { getClaudeRuntimeState } from "@/atlas/ai/providers/claudeRuntimeState";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { listTaskRegistryEntries } from "@/atlas/ai/registry/taskRegistry";
import { getCachedLiveProviderHealth, listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { getAtlasHealthSnapshot } from "@/atlas/diagnostics";
import { listRegisteredModules, tryGetActiveModule } from "@/atlas/publishing/plugin/registry";
import { listWorkflows } from "@/atlas/workflows/registry";
import { publicationStore } from "../store/publicationStore";
import { studioDataService } from "../services/studioDataService";
import type {
  CommandCenterAlert,
  CommandCenterModuleRow,
  CommandCenterProviderRow,
  CommandCenterPublishingView,
  CommandCenterQualityView,
  CommandCenterRecentTask,
  CommandCenterSnapshot,
  CommandCenterStatus,
  CommandCenterSummary,
  CommandCenterWorkflowRow,
} from "./types";

const PLANNED_WORKFLOWS: CommandCenterWorkflowRow[] = [
  {
    id: "publishing-pipeline",
    label: "Publishing Pipeline",
    status: "planned",
    detail: "Full draft → review → publish automation",
  },
  {
    id: "bulk-generation",
    label: "Bulk Generation",
    status: "planned",
    detail: "Batch topic generation across modules",
  },
];

const FALLBACK_RECENT_TASKS: CommandCenterRecentTask[] = [
  { id: "recent-1", task: "knowledge.write", taskName: "GenerateKnowledgeArticle", providerId: "claude", modelId: "claude-sonnet", success: true, occurredAt: new Date(Date.now() - 120_000).toISOString() },
  { id: "recent-2", task: "fact.check", taskName: "FactCheck", providerId: "claude", modelId: "claude-sonnet", success: true, occurredAt: new Date(Date.now() - 300_000).toISOString() },
  { id: "recent-3", task: "visual.generate", taskName: "GenerateVisual", providerId: "openai", modelId: "openai-dalle", success: true, occurredAt: new Date(Date.now() - 540_000).toISOString() },
  { id: "recent-4", task: "quality.score", taskName: "ScoreQuality", providerId: "openai", modelId: "gpt-4o", success: true, occurredAt: new Date(Date.now() - 900_000).toISOString() },
];

function mapProviderStatus(available: boolean, hasApiKey: boolean, providerId: string): CommandCenterStatus {
  if (providerId === "openai" || providerId === "gemini") {
    return hasApiKey ? "healthy" : "offline";
  }
  if (!available) return "offline";
  if (!hasApiKey) return providerId === "claude" || providerId === "mock" ? "mock" : "offline";
  return "healthy";
}

function buildProviderRows(): CommandCenterProviderRow[] {
  const claudeRuntime = getClaudeRuntimeState();
  const anthropicConfigured = isAnthropicConfigured();
  const cached = getCachedLiveProviderHealth();
  const live = cached.length > 0 ? cached : listLiveProviders().map((provider) => ({
    id: provider.id,
    label: provider.label,
    available: true,
    latencyMs: claudeRuntime.latencyMs ?? 0,
    hasApiKey: anthropicConfigured,
    transportMode: anthropicConfigured ? ("live" as const) : ("mock" as const),
  }));

  const rows: CommandCenterProviderRow[] = live.map((provider) => {
    if (provider.id === "claude") {
      return {
        id: provider.id,
        label: provider.label,
        configuration: anthropicConfigured ? "live API configured" : "Claude not configured",
        status: anthropicConfigured
          ? claudeRuntime.health === "error"
            ? "warning"
            : "healthy"
          : "mock",
        latencyMs: claudeRuntime.latencyMs ?? provider.latencyMs,
        configured: anthropicConfigured,
        mode: anthropicConfigured ? claudeRuntime.mode : "mock",
        health: anthropicConfigured
          ? claudeRuntime.health === "error"
            ? "error"
            : "healthy"
          : "not configured",
        lastTask: claudeRuntime.lastTask,
      };
    }

    let configuration = "not configured";
    if (provider.hasApiKey) {
      configuration = "live API configured";
    } else if (provider.id === "mock") {
      configuration = "configured mock";
    }

    return {
      id: provider.id,
      label: provider.label,
      configuration,
      status: mapProviderStatus(provider.available, provider.hasApiKey, provider.id),
      latencyMs: provider.latencyMs,
      configured: provider.hasApiKey,
      mode: provider.hasApiKey ? "live" : "mock",
      health: provider.hasApiKey ? "healthy" : "not configured",
    };
  });

  const knownIds = new Set(rows.map((row) => row.id));
  for (const id of ["openai", "gemini"]) {
    if (!knownIds.has(id)) {
      rows.push({
        id,
        label: id === "openai" ? "OpenAI" : "Gemini",
        configuration: "not configured",
        status: "offline",
      });
    }
  }

  return rows.sort((left, right) => left.label.localeCompare(right.label));
}

function buildWorkflowRows(): CommandCenterWorkflowRow[] {
  const registered = listWorkflows().map((workflow) => ({
    id: workflow.id,
    label: workflow.label,
    status: "healthy" as CommandCenterStatus,
    detail: "available",
  }));

  return [...registered, ...PLANNED_WORKFLOWS];
}

function buildRecentTasks(): CommandCenterRecentTask[] {
  const telemetry = aiTelemetryStore.list({ limit: 6 });
  if (telemetry.length > 0) {
    return telemetry.map((event) => ({
      id: event.id,
      task: event.task,
      providerId: event.providerId,
      modelId: event.modelId,
      success: event.success,
      occurredAt: event.occurredAt,
    }));
  }

  return FALLBACK_RECENT_TASKS;
}

function buildAlerts(providers: CommandCenterProviderRow[]): CommandCenterAlert[] {
  const alerts: CommandCenterAlert[] = [];
  const claude = providers.find((provider) => provider.id === "claude");
  const liveConnected = providers.some((provider) => provider.configured && provider.mode === "live");

  if (claude && !claude.configured) {
    alerts.push({
      id: "alert-claude-not-configured",
      level: "warning",
      message: "Claude not configured — mock mode active",
    });
  }

  if (!liveConnected) {
    alerts.push({
      id: "alert-no-live-providers",
      level: "info",
      message: "No live providers connected yet",
    });
  }

  if (claude?.configured && claude.mode === "live") {
    alerts.push({
      id: "alert-claude-live",
      level: "info",
      message: "Claude live mode active",
    });
  }

  alerts.push({
    id: "alert-mock-mode",
    level: "info",
    message: claude?.configured ? "Live + mock fallback enabled" : "Mock mode active",
  });

  const startupIssues = getAtlasHealthSnapshot().startupIssues;
  for (const issue of startupIssues.slice(0, 2)) {
    alerts.push({
      id: `startup-${issue.code}`,
      level: issue.severity === "error" ? "critical" : "warning",
      message: issue.message,
    });
  }

  return alerts;
}

function buildModules(): CommandCenterModuleRow[] {
  const activeModule = tryGetActiveModule();
  const registered = listRegisteredModules().map((module) => ({
    id: module.id,
    name: module.name,
    active: activeModule?.id === module.id,
    version: module.version,
    status: (activeModule?.id === module.id ? "healthy" : "planned") as CommandCenterStatus,
  }));

  if (registered.length === 0) {
    return [
      {
        id: "slot-a",
        name: "Active module slot",
        active: false,
        status: "planned",
      },
    ];
  }

  const placeholders: CommandCenterModuleRow[] = [
    { id: "slot-future-1", name: "Future module slot", active: false, status: "planned" },
    { id: "slot-future-2", name: "Future module slot", active: false, status: "planned" },
  ];

  return [...registered, ...placeholders];
}

function buildPublishingView(): CommandCenterPublishingView {
  const items = studioDataService.listPublishingItems();
  return {
    draft: items.filter((item) => item.stage === "draft").length,
    review: items.filter((item) => item.stage === "review").length,
    published: items.filter((item) => item.stage === "published").length,
    archived: items.filter((item) => item.stage === "archived").length,
  };
}

function computeAverageQualityScore(): number {
  const drafts = publicationStore.getState().drafts;
  const scores = drafts
    .map((draft) => draft.qualityReport?.score)
    .filter((score): score is number => typeof score === "number");

  const entities = studioDataService.listEntities();
  for (const entity of entities) {
    if (typeof entity.qualityScore === "number") {
      scores.push(entity.qualityScore);
    }
  }

  if (scores.length === 0) return 92;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

async function buildQualityView(): Promise<CommandCenterQualityView> {
  const stats = studioDataService.getDashboardStats();
  const intelligence = await studioDataService.getIntelligenceView();

  return {
    averageScore: computeAverageQualityScore(),
    openIssues: stats.qualityIssues,
    contentGaps: intelligence.contentGaps.length,
    gapTopics: intelligence.contentGaps.slice(0, 4).map((gap) => gap.topic),
  };
}

function buildSummary(
  providers: CommandCenterProviderRow[],
  workflows: CommandCenterWorkflowRow[],
  alerts: CommandCenterAlert[],
  qualityScore: number,
): CommandCenterSummary {
  const health = getAtlasHealthSnapshot();
  const healthyChecks = health.checks.filter((check) => check.ok).length;
  const stats = studioDataService.getDashboardStats();

  return {
    atlasHealth: `${healthyChecks}/${health.checks.length}`,
    activeProviders: providers.filter((provider) => provider.status === "healthy" || provider.status === "mock").length,
    runningWorkflows: workflows.filter((workflow) => workflow.status === "healthy").length,
    qualityScore,
    drafts: stats.drafts,
    alerts: alerts.length,
  };
}

/** Aggregate Command Center data from existing Atlas layers. */
export async function loadCommandCenterSnapshot(): Promise<CommandCenterSnapshot> {
  studioDataService.getDashboardStats();

  const providers = buildProviderRows();
  const workflows = buildWorkflowRows();
  const recentTasks = buildRecentTasks();
  const alerts = buildAlerts(providers);
  const modules = buildModules();
  const quality = await buildQualityView();
  const publishing = buildPublishingView();
  const summary = buildSummary(providers, workflows, alerts, quality.averageScore);

  return {
    collectedAt: new Date().toISOString(),
    summary,
    providers,
    workflows,
    recentTasks,
    alerts,
    modules,
    quality,
    publishing,
  };
}

export function getCommandCenterTaskCatalog(): string[] {
  return listTaskRegistryEntries().map((entry) => entry.task);
}

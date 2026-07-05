import { getClaudeRuntimeState } from "@/atlas/ai/providers/claudeRuntimeState";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { getCachedLiveProviderHealth, listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { getAtlasHealthSnapshot } from "@/atlas/diagnostics";
import type { CommandCenterAlert, CommandCenterProviderRow, CommandCenterStatus } from "./types";

function mapProviderStatus(available: boolean, hasApiKey: boolean, providerId: string): CommandCenterStatus {
  if (providerId === "openai" || providerId === "gemini") {
    return hasApiKey ? "healthy" : "offline";
  }
  if (!available) return "offline";
  if (!hasApiKey) return providerId === "claude" || providerId === "mock" ? "mock" : "offline";
  return "healthy";
}

export function buildProviderRows(): CommandCenterProviderRow[] {
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

export function buildAlerts(providers: CommandCenterProviderRow[]): CommandCenterAlert[] {
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

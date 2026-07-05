import { loadavg } from "node:os";

import { bootstrapAtlas } from "@/atlas/bootstrap";
import { listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { getEntityCount } from "@/atlas/entity/registry/entityStore";
import { getStartupIssues } from "@/atlas/diagnostics/auditLog";
import { listWorkflows } from "@/atlas/workflows/registry";

import { checkRouteFiles, checkNodeAndNpm, isPortInUse, ATLAS_PORT } from "../shared";
import { healthDelta } from "./ui";

type HealthSnapshot = {
  node: string;
  memoryMb: number;
  cpuLoad: string;
  claude: string;
  routesOk: boolean;
  workflows: number;
  entities: number;
  errors: number;
};

function captureSnapshot(): HealthSnapshot {
  bootstrapAtlas();
  const runtime = checkNodeAndNpm();
  const memory = process.memoryUsage().rss / (1024 * 1024);
  const load = process.platform === "win32" ? "n/a" : loadavg()[0].toFixed(2);

  return {
    node: runtime.node,
    memoryMb: Math.round(memory),
    cpuLoad: load,
    claude: isAnthropicConfigured() ? "live" : "mock",
    routesOk: checkRouteFiles().every((entry) => entry.ok),
    workflows: listWorkflows().length,
    entities: getEntityCount(),
    errors: getStartupIssues().filter((issue) => issue.severity === "error").length,
  };
}

function serialize(snapshot: HealthSnapshot): string {
  return JSON.stringify(snapshot);
}

function diffSnapshots(previous: HealthSnapshot, current: HealthSnapshot): string[] {
  const changes: string[] = [];

  if (previous.node !== current.node) changes.push(`Node changed · ${current.node}`);
  if (previous.memoryMb !== current.memoryMb) changes.push(`Memory · ${current.memoryMb} MB`);
  if (previous.cpuLoad !== current.cpuLoad) changes.push(`CPU load · ${current.cpuLoad}`);
  if (previous.claude !== current.claude) changes.push(`Claude · ${current.claude}`);
  if (previous.routesOk !== current.routesOk) {
    changes.push(current.routesOk ? "Routes restored" : "Routes degraded");
  }
  if (previous.workflows !== current.workflows) {
    changes.push(`Workflow registry · ${current.workflows}`);
  }
  if (previous.entities !== current.entities) {
    changes.push(`Entity registry · ${current.entities}`);
  }
  if (previous.errors !== current.errors) {
    changes.push(`Errors · ${current.errors}`);
  }

  if (!isPortInUse(ATLAS_PORT)) {
    changes.push("Atlas web port unavailable");
  }

  const liveCount = listLiveProviders().length;
  if (liveCount === 0) {
    changes.push("No live providers registered");
  }

  return changes;
}

export function startSmartHealth(intervalMs = 30_000): NodeJS.Timeout {
  let previous = captureSnapshot();

  return setInterval(() => {
    const current = captureSnapshot();
    if (serialize(previous) === serialize(current)) {
      previous = current;
      return;
    }

    const changes = diffSnapshots(previous, current);
    for (const change of changes) {
      healthDelta(change);
    }

    previous = current;
  }, intervalMs);
}

export function runSmartHealthOnce(): string[] {
  const current = captureSnapshot();
  const baseline: HealthSnapshot = {
    node: "",
    memoryMb: 0,
    cpuLoad: "0",
    claude: "",
    routesOk: true,
    workflows: 0,
    entities: 0,
    errors: 0,
  };
  return diffSnapshots(baseline, current);
}

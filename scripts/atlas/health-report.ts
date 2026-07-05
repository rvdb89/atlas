import "dotenv/config";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { bootstrapAtlas } from "@/atlas/bootstrap";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { isAtlasAiBootstrapped } from "@/atlas/ai/bootstrap";
import { listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { listProviders } from "@/atlas/ai/providers/registry";
import { listTaskRegistryEntries } from "@/atlas/ai/registry/taskRegistry";
import { isAtlasEntityBootstrapped } from "@/atlas/entity/bootstrap";
import { isAtlasIntelligenceBootstrapped } from "@/atlas/intelligence/bootstrap";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { isAtlasStudioBootstrapped } from "@/atlas/studio/core/bootstrap";
import { listWorkflows } from "@/atlas/workflows/registry";
import {
  printAtlasHealthChecks,
  runAtlasHealthChecks,
  runAtlasStartupChecks,
} from "@/atlas/diagnostics";
import type { AtlasHealthCheckResult } from "@/atlas/diagnostics/types";

import { checkRouteFiles, printStatus, ROOT_DIR, STUDIO_ROUTES } from "./shared";

function claudeProviderCheck(): AtlasHealthCheckResult {
  const configured = isAnthropicConfigured();
  const claude = listLiveProviders().find((provider: { id: string }) => provider.id === "claude");
  const mode = configured ? "live" : "mock";

  return {
    label: "Claude Provider",
    ok: Boolean(claude),
    detail: configured ? `configured · ${mode}` : "not configured · mock fallback",
  };
}

function buildExtendedHealthChecks(): AtlasHealthCheckResult[] {
  bootstrapAtlas();
  runAtlasStartupChecks();

  const base = runAtlasHealthChecks();
  const modules = listRegisteredModules();
  const routesOk = checkRouteFiles().every((entry) => entry.ok);

  const extended: AtlasHealthCheckResult[] = [
    {
      label: "Atlas Core",
      ok: isAtlasStudioBootstrapped() && isAtlasEntityBootstrapped() && isAtlasAiBootstrapped(),
      detail: "Bootstrap chain loaded",
    },
    {
      label: "Studio",
      ok: isAtlasStudioBootstrapped(),
      detail: isAtlasStudioBootstrapped() ? "Bootstrapped" : "Not bootstrapped",
    },
    {
      label: "Entity Engine",
      ok: isAtlasEntityBootstrapped(),
      detail: isAtlasEntityBootstrapped() ? "Bootstrapped" : "Not bootstrapped",
    },
    {
      label: "AI Orchestrator",
      ok: isAtlasAiBootstrapped() && listTaskRegistryEntries().length > 0,
      detail: `${listTaskRegistryEntries().length} task route(s)`,
    },
    {
      label: "Provider Registry",
      ok: listProviders().length > 0,
      detail: `${listProviders().length} provider adapter(s) · ${listLiveProviders().length} live provider(s)`,
    },
    claudeProviderCheck(),
    {
      label: "Intelligence",
      ok: isAtlasIntelligenceBootstrapped(),
      detail: isAtlasIntelligenceBootstrapped() ? "Bootstrapped" : "Not bootstrapped",
    },
    {
      label: "Workflows",
      ok: listWorkflows().length > 0,
      detail: `${listWorkflows().length} workflow(s)`,
    },
    {
      label: "Publishing",
      ok: isAtlasAiBootstrapped(),
      detail: "Publishing pipeline wired",
    },
    {
      label: "Modules",
      ok: modules.length > 0,
      detail: `${modules.length} registered module(s)`,
    },
    {
      label: "Routes",
      ok: routesOk,
      detail: routesOk ? `${STUDIO_ROUTES.length} studio route files` : "Missing studio route files",
    },
  ];

  const merged = [...extended];
  for (const item of base) {
    if (!merged.some((entry) => entry.label === item.label)) {
      merged.push(item);
    }
  }

  return merged;
}

export function runAtlasHealthReport(): boolean {
  console.log("");
  console.log("Atlas Health Report");
  console.log("───────────────────");

  const checks = buildExtendedHealthChecks();
  const ok = printAtlasHealthChecks(checks);

  const commandCenter = join(ROOT_DIR, "src/app/studio/command-center.tsx");
  if (!existsSync(commandCenter)) {
    printStatus("error", "Command Center route file missing");
    return false;
  }

  console.log("");
  return ok;
}

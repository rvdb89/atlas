import { isAtlasAiBootstrapped } from "@/atlas/ai/bootstrap";
import { listAnalyzers } from "@/atlas/intelligence/engine/registry";
import { isAtlasEntityBootstrapped } from "@/atlas/entity/bootstrap";
import { isAtlasIntelligenceBootstrapped } from "@/atlas/intelligence/bootstrap";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { isAtlasStudioBootstrapped } from "@/atlas/studio/core/bootstrap";
import { ATLAS_BUILD, ATLAS_VERSION } from "@/atlas/version";

import { collectAtlasDiagnostics } from "./collectDiagnostics";
import { runAtlasHealthChecks, runAtlasStartupChecks } from "./startupChecks";
import type { AtlasHealthSnapshot, AtlasSubsystemHealth, DiagnosticStatus } from "./types";

function resolveEnvironment(): string {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    return "development";
  }
  return "production";
}

function resolveStatus(ok: boolean, placeholder = false): DiagnosticStatus {
  if (placeholder) return "placeholder";
  if (ok) return "healthy";
  return "degraded";
}

/** Build subsystem cards for the Atlas Health Dashboard. */
export function getAtlasHealthSnapshot(): AtlasHealthSnapshot {
  runAtlasStartupChecks();
  const diagnostics = collectAtlasDiagnostics();
  const checks = runAtlasHealthChecks();
  const modules = diagnostics.modules;
  const moduleCount = modules.length;

  const subsystems: AtlasSubsystemHealth[] = [
    {
      id: "studio",
      title: "Studio",
      status: resolveStatus(isAtlasStudioBootstrapped()),
      version: ATLAS_VERSION,
      registeredServices: ["StudioScreen", "StudioDataService", "PublicationStore", "SettingsStore"],
      moduleCount,
    },
    {
      id: "entity",
      title: "Entity",
      status: resolveStatus(isAtlasEntityBootstrapped()),
      version: "1.0.0",
      registeredServices: [
        "EntityFactory",
        "EntityStore",
        "QueryEngine",
        "SearchIndex",
        `${diagnostics.entityTypes.length} entity types`,
      ],
      moduleCount,
    },
    {
      id: "ai",
      title: "AI",
      status: resolveStatus(isAtlasAiBootstrapped()),
      version: ATLAS_VERSION,
      registeredServices: [
        "Orchestrator",
        `${diagnostics.providers.length} providers`,
        `${diagnostics.aiTasks.length} tasks`,
      ],
      moduleCount,
    },
    {
      id: "publishing",
      title: "Publishing",
      status: resolveStatus(isAtlasAiBootstrapped() && diagnostics.publishingHandlers.length > 0),
      version: ATLAS_VERSION,
      registeredServices: [
        "PublishingPipeline",
        `${diagnostics.publishingHandlers.length} handlers`,
      ],
      moduleCount,
    },
    {
      id: "workflow",
      title: "Workflow",
      status: resolveStatus(diagnostics.workflows.length > 0),
      version: ATLAS_VERSION,
      registeredServices: diagnostics.workflows.map((workflow) => workflow.label),
      moduleCount,
    },
    {
      id: "registry",
      title: "Registry",
      status: resolveStatus(moduleCount > 0 && !diagnostics.startupIssues.some((issue) => issue.severity === "error")),
      version: ATLAS_VERSION,
      registeredServices: [
        "Modules",
        "Tasks",
        "Entity Types",
        "Workflows",
        "Providers",
        `${listAnalyzers().length} intelligence analyzers`,
      ],
      moduleCount,
    },
    {
      id: "memory",
      title: "Memory",
      status: "placeholder",
      version: "0.1.0",
      registeredServices: [`${diagnostics.memoryEntryCount} in-memory entries`],
      moduleCount,
      detail: "Placeholder — future persistent memory layer",
    },
    {
      id: "cache",
      title: "Cache",
      status: "placeholder",
      version: "0.1.0",
      registeredServices: [`${diagnostics.cacheEntryCount} cached outputs`],
      moduleCount,
      detail: "Placeholder — AI response cache",
    },
  ];

  return {
    collectedAt: diagnostics.collectedAt,
    atlasVersion: ATLAS_VERSION,
    atlasBuild: ATLAS_BUILD,
    environment: resolveEnvironment(),
    subsystems,
    startupIssues: diagnostics.startupIssues,
    checks,
  };
}

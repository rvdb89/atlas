import { isAtlasAiBootstrapped } from "@/atlas/ai/bootstrap";
import { listTaskRegistryEntries } from "@/atlas/ai/registry/taskRegistry";
import { TASK_NAME_TO_TYPE } from "@/atlas/ai/types";
import { isAtlasEntityBootstrapped } from "@/atlas/entity/bootstrap";
import { listRegisteredEntityTypes } from "@/atlas/entity/registry/entityTypeRegistry";
import { isAtlasIntelligenceBootstrapped } from "@/atlas/intelligence/bootstrap";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { isAtlasStudioBootstrapped } from "@/atlas/studio/core/bootstrap";
import { listWorkflows } from "@/atlas/workflows/registry";

import { clearStartupIssues, getStartupIssues, recordStartupIssue } from "./auditLog";
import type { AtlasHealthCheckResult, StartupIssue } from "./types";

function findDuplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return [...duplicates];
}

function checkDuplicateTaskNames(): void {
  const taskNames = Object.keys(TASK_NAME_TO_TYPE);
  const duplicateNames = findDuplicateValues(taskNames);
  for (const name of duplicateNames) {
    recordStartupIssue({
      code: "duplicate-task-name",
      severity: "error",
      message: `Duplicate public AI task name: ${name}`,
      context: { taskName: name },
    });
  }

  const mappedTypes = Object.values(TASK_NAME_TO_TYPE);
  const duplicateTypes = findDuplicateValues(mappedTypes);
  for (const task of duplicateTypes) {
    recordStartupIssue({
      code: "duplicate-task-route",
      severity: "warning",
      message: `Multiple public task names map to task route: ${task}`,
      context: { task },
    });
  }

  const registryNames = listTaskRegistryEntries()
    .map((entry) => entry.taskName)
    .filter(Boolean) as string[];
  for (const name of findDuplicateValues(registryNames)) {
    recordStartupIssue({
      code: "duplicate-task-registry-name",
      severity: "error",
      message: `Duplicate task registry name: ${name}`,
      context: { taskName: name },
    });
  }
}

function checkDuplicateEntityTypes(): void {
  const typeIds = listRegisteredEntityTypes().map((type) => type.typeId);
  for (const typeId of findDuplicateValues(typeIds)) {
    recordStartupIssue({
      code: "duplicate-entity-type",
      severity: "error",
      message: `Duplicate entity type registered: ${typeId}`,
      context: { typeId },
    });
  }
}

function checkDuplicateWorkflowIds(): void {
  const workflowIds = listWorkflows().map((workflow) => workflow.id);
  for (const workflowId of findDuplicateValues(workflowIds)) {
    recordStartupIssue({
      code: "duplicate-workflow-id",
      severity: "error",
      message: `Duplicate workflow id: ${workflowId}`,
      context: { workflowId },
    });
  }
}

function checkDuplicateModules(): void {
  const moduleIds = listRegisteredModules().map((module) => module.id);
  for (const moduleId of findDuplicateValues(moduleIds)) {
    recordStartupIssue({
      code: "duplicate-module",
      severity: "error",
      message: `Duplicate module registered: ${moduleId}`,
      context: { moduleId },
    });
  }
}

/** Run startup validation checks after Atlas bootstrap. */
export function runAtlasStartupChecks(options?: { reset?: boolean }): StartupIssue[] {
  if (options?.reset) {
    clearStartupIssues();
  }

  checkDuplicateModules();
  checkDuplicateTaskNames();
  checkDuplicateEntityTypes();
  checkDuplicateWorkflowIds();

  return getStartupIssues();
}

export function runAtlasHealthChecks(): AtlasHealthCheckResult[] {
  const modules = listRegisteredModules();
  const workflows = listWorkflows();
  const tasks = listTaskRegistryEntries();
  const startupIssues = getStartupIssues();
  const hasErrors = startupIssues.some((issue) => issue.severity === "error");

  return [
    {
      label: "Atlas Studio",
      ok: isAtlasStudioBootstrapped(),
      detail: isAtlasStudioBootstrapped() ? "Bootstrapped" : "Not bootstrapped",
    },
    {
      label: "Entity Engine",
      ok: isAtlasEntityBootstrapped(),
      detail: isAtlasEntityBootstrapped() ? "Bootstrapped" : "Not bootstrapped",
    },
    {
      label: "Intelligence",
      ok: isAtlasIntelligenceBootstrapped(),
      detail: isAtlasIntelligenceBootstrapped() ? "Bootstrapped" : "Not bootstrapped",
    },
    {
      label: "Workflows",
      ok: workflows.length > 0,
      detail: `${workflows.length} workflow(s)`,
    },
    {
      label: "Publishing",
      ok: isAtlasAiBootstrapped() && tasks.length > 0,
      detail: `${tasks.length} routed task(s)`,
    },
    {
      label: "Registry",
      ok: modules.length > 0 && !hasErrors,
      detail: hasErrors ? `${startupIssues.length} startup issue(s)` : `${modules.length} module(s)`,
    },
  ];
}

export function printAtlasHealthChecks(checks: AtlasHealthCheckResult[]): boolean {
  let allOk = true;

  for (const check of checks) {
    const icon = check.ok ? "✔" : "✖";
    console.log(`${icon} ${check.label}`);
    if (!check.ok) {
      allOk = false;
      if (check.detail) {
        console.log(`  ↳ ${check.detail}`);
      }
    }
  }

  return allOk;
}

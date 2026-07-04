import type { AiTaskName, AtlasTaskType } from "../types";
import { TASK_NAME_TO_TYPE, resolveTaskTypeName } from "../types";
import { getTaskRouteConfig, getTaskRouteConfigs, type TaskRouteConfig } from "../tasks/routes";

export type TaskRegistryEntry = TaskRouteConfig & {
  taskName?: AiTaskName;
};

export function listTaskRegistryEntries(): TaskRegistryEntry[] {
  return getTaskRouteConfigs().map((config) => ({
    ...config,
    taskName: resolveTaskTypeName(config.task),
  }));
}

export function getTaskRegistryEntry(task: AtlasTaskType): TaskRegistryEntry {
  return {
    ...getTaskRouteConfig(task),
    taskName: resolveTaskTypeName(task),
  };
}

export function getTaskRegistryEntryByName(taskName: AiTaskName): TaskRegistryEntry {
  const task = TASK_NAME_TO_TYPE[taskName];
  return getTaskRegistryEntry(task);
}

export function listPublicTaskNames(): AiTaskName[] {
  return Object.keys(TASK_NAME_TO_TYPE) as AiTaskName[];
}

import type { AtlasTaskType } from "../types";
import type { AiProviderRequest, AiProviderResponse } from "../providers/types";
import { recordStartupIssue } from "@/atlas/diagnostics/auditLog";

export type TaskHandler = (request: AiProviderRequest) => Promise<AiProviderResponse>;

const handlers = new Map<AtlasTaskType, TaskHandler>();

export function registerTaskHandler(task: AtlasTaskType, handler: TaskHandler): void {
  if (handlers.has(task)) {
    recordStartupIssue({
      code: "duplicate-task-handler",
      severity: "warning",
      message: `Duplicate task handler registered: ${task}`,
      context: { task },
    });
  }
  handlers.set(task, handler);
}

export function getTaskHandler(task: AtlasTaskType): TaskHandler | undefined {
  return handlers.get(task);
}

export function listTaskHandlers(): AtlasTaskType[] {
  return [...handlers.keys()];
}

export function clearTaskHandlers(): void {
  handlers.clear();
}

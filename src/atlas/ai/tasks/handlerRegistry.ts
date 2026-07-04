import type { AtlasTaskType } from "../types";
import type { AiProviderRequest, AiProviderResponse } from "../providers/types";

export type TaskHandler = (request: AiProviderRequest) => Promise<AiProviderResponse>;

const handlers = new Map<AtlasTaskType, TaskHandler>();

export function registerTaskHandler(task: AtlasTaskType, handler: TaskHandler): void {
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

import type { AiTaskSettings, AtlasTaskType } from "../types";

export type AiExecutionContext = {
  contextId: string;
  task: AtlasTaskType;
  moduleId?: string;
  locale?: string;
  settings: AiTaskSettings;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export function buildExecutionContext(input: {
  task: AtlasTaskType;
  moduleId?: string;
  locale?: string;
  settings?: AiTaskSettings;
  metadata?: Record<string, unknown>;
}): AiExecutionContext {
  return {
    contextId: `ctx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    task: input.task,
    moduleId: input.moduleId,
    locale: input.locale,
    settings: input.settings ?? {},
    metadata: input.metadata ?? {},
    createdAt: new Date().toISOString(),
  };
}

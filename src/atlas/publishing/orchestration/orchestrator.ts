import { executeTask as atlasExecuteTask, formatTaskExecutionLog } from "@/atlas/ai/router/executeTask";
import { mapPublishingTask } from "@/atlas/ai/tasks/publishingBridge";
import type { AiTaskType } from "./types";

/** @deprecated Use executeTask from @/atlas/ai with AtlasTaskType directly. */
export type LegacyExecuteTaskInput<T> = {
  taskType: AiTaskType;
  payload: unknown;
  moduleId?: string;
};

/** @deprecated Use executeTask from @/atlas/ai with AtlasTaskType directly. */
export async function executePublishingTask<T = unknown>(input: LegacyExecuteTaskInput<T>) {
  const atlasTask = mapPublishingTask(input.taskType);
  return atlasExecuteTask<T>({
    task: atlasTask,
    payload: input.payload,
    moduleId: input.moduleId ?? "doughbert",
  });
}

export { formatTaskExecutionLog };

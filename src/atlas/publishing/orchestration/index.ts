export * from "./types";
export {
  executePublishingTask,
  formatTaskExecutionLog,
  type LegacyExecuteTaskInput,
} from "./orchestrator";

/** @deprecated Use executePublishingTask */
export { executePublishingTask as executeTask } from "./orchestrator";

import type { AtlasTaskType, ExecuteTaskInput } from "../types";

export type AiJobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type AiJob<TPayload = unknown, TOutput = unknown> = {
  id: string;
  task: AtlasTaskType;
  payload: TPayload;
  input: ExecuteTaskInput<TPayload>;
  status: AiJobStatus;
  enqueuedAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: TOutput;
  error?: string;
  attempts: number;
};

export type AiJobQueue = {
  enqueue<TPayload>(input: ExecuteTaskInput<TPayload>): Promise<AiJob<TPayload>>;
  dequeue(): AiJob | undefined;
  peek(): AiJob | undefined;
  size(): number;
  list(status?: AiJobStatus): AiJob[];
  markRunning(jobId: string): AiJob | undefined;
  markCompleted<T>(jobId: string, result: T): AiJob | undefined;
  markFailed(jobId: string, error: string): AiJob | undefined;
};

export type AiJobProcessor = {
  processNext(): Promise<AiJob | undefined>;
  processAll(limit?: number): Promise<number>;
};

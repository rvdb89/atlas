import type { AiJob, AiJobQueue, AiJobStatus } from "../interfaces/queue";
import type { ExecuteTaskInput } from "../types";
import { executeTask } from "../core/Orchestrator";

const queue: AiJob[] = [];

function createJobId(): string {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const aiJobQueue: AiJobQueue = {
  async enqueue<TPayload>(input: ExecuteTaskInput<TPayload>) {
    const job: AiJob<TPayload> = {
      id: createJobId(),
      task: input.task,
      payload: input.payload,
      input,
      status: "queued",
      enqueuedAt: new Date().toISOString(),
      attempts: 0,
    };
    queue.push(job);
    return job;
  },

  dequeue() {
    const index = queue.findIndex((job) => job.status === "queued");
    if (index === -1) return undefined;
    return queue[index];
  },

  peek() {
    return queue.find((job) => job.status === "queued");
  },

  size() {
    return queue.filter((job) => job.status === "queued").length;
  },

  list(status) {
    return status ? queue.filter((job) => job.status === status) : [...queue];
  },

  markRunning(jobId) {
    const job = queue.find((entry) => entry.id === jobId);
    if (!job) return undefined;
    job.status = "running";
    job.startedAt = new Date().toISOString();
    job.attempts += 1;
    return job;
  },

  markCompleted(jobId, result) {
    const job = queue.find((entry) => entry.id === jobId);
    if (!job) return undefined;
    job.status = "completed";
    job.completedAt = new Date().toISOString();
    job.result = result;
    return job;
  },

  markFailed(jobId, error) {
    const job = queue.find((entry) => entry.id === jobId);
    if (!job) return undefined;
    job.status = "failed";
    job.completedAt = new Date().toISOString();
    job.error = error;
    return job;
  },
};

export const aiJobProcessor = {
  async processNext() {
    const next = aiJobQueue.dequeue();
    if (!next) return undefined;

    aiJobQueue.markRunning(next.id);
    try {
      const result = await executeTask(next.input);
      aiJobQueue.markCompleted(next.id, result.output);
      next.result = result.output;
      next.status = "completed";
      return next;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      aiJobQueue.markFailed(next.id, message);
      next.error = message;
      next.status = "failed";
      return next;
    }
  },

  async processAll(limit = 10) {
    let processed = 0;
    for (let index = 0; index < limit; index += 1) {
      const job = await aiJobProcessor.processNext();
      if (!job) break;
      processed += 1;
    }
    return processed;
  },
};

export function enqueueAiJob<TPayload>(input: ExecuteTaskInput<TPayload>) {
  return aiJobQueue.enqueue(input);
}

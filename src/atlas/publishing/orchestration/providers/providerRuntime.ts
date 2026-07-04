import type { AiTaskType } from "../types";

export type ProviderExecutionContext = {
  modelId: string;
  taskType: AiTaskType;
};

export class ProviderUnavailableError extends Error {
  constructor(
    readonly modelId: string,
    message = "Provider unavailable",
  ) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}

const forcedFailures = new Set<string>();

export function simulateProviderFailure(modelId: string) {
  forcedFailures.add(modelId);
}

export function clearSimulatedFailures() {
  forcedFailures.clear();
}

export function isProviderForcedDown(modelId: string): boolean {
  return forcedFailures.has(modelId);
}

export async function invokeProvider<T>(
  context: ProviderExecutionContext,
  handler: () => Promise<T>,
): Promise<T> {
  if (isProviderForcedDown(context.modelId)) {
    throw new ProviderUnavailableError(context.modelId);
  }

  return handler();
}

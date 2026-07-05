export type ClaudeRuntimeState = {
  configured: boolean;
  mode: "live" | "mock";
  health: "healthy" | "not configured" | "error";
  latencyMs?: number;
  lastTask?: string;
  lastModel?: string;
  lastError?: string;
  updatedAt: string;
};

let state: ClaudeRuntimeState = {
  configured: false,
  mode: "mock",
  health: "not configured",
  updatedAt: new Date().toISOString(),
};

export function getClaudeRuntimeState(): ClaudeRuntimeState {
  return { ...state };
}

export function updateClaudeRuntimeState(patch: Partial<ClaudeRuntimeState>): ClaudeRuntimeState {
  state = {
    ...state,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return { ...state };
}

export function recordClaudeTask(task: string, model: string, mode: "live" | "mock"): void {
  updateClaudeRuntimeState({
    lastTask: task,
    lastModel: model,
    mode,
  });
}

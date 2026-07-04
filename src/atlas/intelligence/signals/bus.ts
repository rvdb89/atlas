import type { IntelligenceSignal } from "../types";

const signals: IntelligenceSignal[] = [];
let retentionLimit = 10_000;

export function configureSignalBus(options: { retentionLimit?: number }): void {
  if (options.retentionLimit !== undefined) {
    retentionLimit = options.retentionLimit;
  }
}

export function emitSignal(signal: Omit<IntelligenceSignal, "id" | "timestamp"> & Partial<Pick<IntelligenceSignal, "id" | "timestamp">>): IntelligenceSignal {
  const entry: IntelligenceSignal = {
    id: signal.id ?? `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: signal.timestamp ?? new Date().toISOString(),
    type: signal.type,
    moduleId: signal.moduleId,
    userId: signal.userId,
    contentId: signal.contentId,
    locale: signal.locale,
    payload: signal.payload,
  };

  signals.unshift(entry);
  if (signals.length > retentionLimit) {
    signals.length = retentionLimit;
  }

  return entry;
}

export function listSignals(filter?: {
  moduleId?: string;
  type?: IntelligenceSignal["type"];
  limit?: number;
}): IntelligenceSignal[] {
  let result = signals;

  if (filter?.moduleId) {
    result = result.filter((entry) => entry.moduleId === filter.moduleId);
  }
  if (filter?.type) {
    result = result.filter((entry) => entry.type === filter.type);
  }

  const limit = filter?.limit ?? result.length;
  return result.slice(0, limit);
}

export function clearSignals(): void {
  signals.length = 0;
}

export function getSignalCount(): number {
  return signals.length;
}

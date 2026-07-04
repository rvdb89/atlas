import type { MetricDefinition, MetricSnapshot } from "./types";

const definitions = new Map<string, MetricDefinition>();
const snapshots: MetricSnapshot[] = [];

export function registerMetricDefinition(definition: MetricDefinition): void {
  definitions.set(definition.id, definition);
}

export function getMetricDefinition(metricId: string): MetricDefinition | undefined {
  return definitions.get(metricId);
}

export function listMetricDefinitions(): MetricDefinition[] {
  return [...definitions.values()];
}

export function recordMetricSnapshot(snapshot: Omit<MetricSnapshot, "recordedAt"> & Partial<Pick<MetricSnapshot, "recordedAt">>): MetricSnapshot {
  const entry: MetricSnapshot = {
    ...snapshot,
    recordedAt: snapshot.recordedAt ?? new Date().toISOString(),
  };
  snapshots.unshift(entry);
  return entry;
}

export function listMetricSnapshots(filter?: { metricId?: string; moduleId?: string; limit?: number }): MetricSnapshot[] {
  let result = snapshots;
  if (filter?.metricId) result = result.filter((entry) => entry.metricId === filter.metricId);
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearMetricSnapshots(): void {
  snapshots.length = 0;
}

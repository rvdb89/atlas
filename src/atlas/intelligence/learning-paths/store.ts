import type { LearningPath, LearningPathProvider } from "./types";

const providers = new Map<string, LearningPathProvider>();
const paths: LearningPath[] = [];

export function registerLearningPathProvider(provider: LearningPathProvider): void {
  providers.set(provider.moduleId, provider);
}

export function getLearningPathProvider(moduleId: string): LearningPathProvider | undefined {
  return providers.get(moduleId);
}

export function storeLearningPath(path: LearningPath): LearningPath {
  paths.unshift(path);
  return path;
}

export function listLearningPaths(filter?: { moduleId?: string; limit?: number }): LearningPath[] {
  let result = paths;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearLearningPaths(): void {
  paths.length = 0;
}

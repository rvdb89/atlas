import type { AiSuggestion } from "./types";

const suggestions: AiSuggestion[] = [];

export function storeAiSuggestion(suggestion: AiSuggestion): AiSuggestion {
  suggestions.unshift(suggestion);
  return suggestion;
}

export function updateAiSuggestionStatus(id: string, status: AiSuggestion["status"]): AiSuggestion | undefined {
  const entry = suggestions.find((item) => item.id === id);
  if (!entry) return undefined;
  entry.status = status;
  return entry;
}

export function listAiSuggestions(filter?: {
  moduleId?: string;
  kind?: AiSuggestion["kind"];
  status?: AiSuggestion["status"];
  limit?: number;
}): AiSuggestion[] {
  let result = suggestions;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.kind) result = result.filter((entry) => entry.kind === filter.kind);
  if (filter?.status) result = result.filter((entry) => entry.status === filter.status);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearAiSuggestions(): void {
  suggestions.length = 0;
}

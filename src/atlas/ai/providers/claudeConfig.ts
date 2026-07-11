/** Default Claude model — override via provider-config task modelId. */
export const DEFAULT_CLAUDE_MODEL = "claude-sonnet-5";

const CLAUDE_API_MODEL_MAP: Record<string, string> = {
  "claude-sonnet": DEFAULT_CLAUDE_MODEL,
  "claude-haiku": "claude-haiku-4-5",
  // Legacy aliases (retired by Anthropic) — mapped forward so old references don't 404.
  "claude-3-5-sonnet-latest": DEFAULT_CLAUDE_MODEL,
  "claude-3-5-haiku-latest": "claude-haiku-4-5",
};

export function resolveClaudeApiModel(modelId: string): string {
  return CLAUDE_API_MODEL_MAP[modelId] ?? modelId;
}

/** Default Claude model — override via provider-config task modelId. */
export const DEFAULT_CLAUDE_MODEL = "claude-3-5-sonnet-latest";

const CLAUDE_API_MODEL_MAP: Record<string, string> = {
  "claude-sonnet": DEFAULT_CLAUDE_MODEL,
  "claude-3-5-sonnet-latest": DEFAULT_CLAUDE_MODEL,
  "claude-haiku": "claude-3-5-haiku-latest",
  "claude-3-5-haiku-latest": "claude-3-5-haiku-latest",
};

export function resolveClaudeApiModel(modelId: string): string {
  return CLAUDE_API_MODEL_MAP[modelId] ?? modelId;
}

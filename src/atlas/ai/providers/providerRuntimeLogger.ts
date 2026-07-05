type ProviderLogEntry = {
  provider: string;
  task: string;
  model: string;
  durationMs: number;
  fallbackUsed: boolean;
};

/** Development-only provider logging — never logs prompts or API keys. */
export function logProviderExecution(entry: ProviderLogEntry): void {
  if (typeof __DEV__ === "undefined" || !__DEV__) {
    return;
  }

  console.log(
    `[Atlas AI] provider=${entry.provider} task=${entry.task} model=${entry.model} duration=${entry.durationMs}ms fallback=${entry.fallbackUsed ? "yes" : "no"}`,
  );
}

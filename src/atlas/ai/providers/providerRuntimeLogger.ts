type ProviderLogEntry = {
  provider: string;
  task: string;
  model: string;
  durationMs: number;
  fallbackUsed: boolean;
};

/** Development-only provider logging — never logs prompts or API keys.
 *
 * BRAIN-010 · __DEV__ is an RN-only global — it's `undefined` (not `false`) in every
 * Node.js context, including scripts/atlas-runtime.ts, the exact place this fallback
 * logging mattered most for diagnosing CONTENT-007's silent Claude failures. The old
 * `typeof __DEV__ === "undefined" || !__DEV__` treated "undefined" the same as "explicitly
 * false" and skipped logging in Node entirely. Now it only skips when __DEV__ is defined
 * AND explicitly false (a real RN production build) — Node and RN dev both log. */
export function logProviderExecution(entry: ProviderLogEntry): void {
  if (typeof __DEV__ !== "undefined" && !__DEV__) {
    return;
  }

  console.log(
    `[Atlas AI] provider=${entry.provider} task=${entry.task} model=${entry.model} duration=${entry.durationMs}ms fallback=${entry.fallbackUsed ? "yes" : "no"}`,
  );
}

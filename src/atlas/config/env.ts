/** Read Anthropic API key from Expo extra or process env — never log this value. */
export function getAnthropicApiKey(): string | undefined {
  let fromExpo: string | undefined;

  try {
    // Lazy require keeps Node health scripts free of React Native imports.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Constants = require("expo-constants").default as {
      expoConfig?: { extra?: { anthropicApiKey?: string } };
    };
    fromExpo = Constants.expoConfig?.extra?.anthropicApiKey;
  } catch {
    fromExpo = undefined;
  }

  const fromProcess =
    typeof process !== "undefined" && process.env?.ANTHROPIC_API_KEY
      ? process.env.ANTHROPIC_API_KEY
      : undefined;

  const key = String(fromExpo ?? fromProcess ?? "").trim();
  return key.length > 0 ? key : undefined;
}

export function isAnthropicConfigured(): boolean {
  return Boolean(getAnthropicApiKey());
}

import { registerProvider } from "./registry";
import { ALL_PROVIDERS } from "./adapters";

let initialized = false;

export function bootstrapAiProviders(): void {
  if (initialized) return;
  for (const adapter of ALL_PROVIDERS) {
    registerProvider(adapter);
  }
  initialized = true;
}

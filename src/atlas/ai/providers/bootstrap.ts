import { registerProvider } from "./registry";
import { bootstrapLiveProviders } from "./liveBootstrap";

let initialized = false;

export function bootstrapAiProviders(): void {
  if (initialized) return;
  bootstrapLiveProviders();
  initialized = true;
}

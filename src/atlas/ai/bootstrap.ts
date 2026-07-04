import { bootstrapAiProviders } from "./providers/bootstrap";
import { configureAiPolicies } from "./policies/PolicyEngine";
import { registerDoughbertAiHandlers } from "@/modules/doughbert/ai/handlers";

let bootstrapped = false;

export function bootstrapAtlasAi(): void {
  if (bootstrapped) return;

  configureAiPolicies({
    allowFallback: true,
    offlineMode: false,
    maxTokens: 8192,
  });

  bootstrapAiProviders();
  registerDoughbertAiHandlers();
  bootstrapped = true;
}

export function isAtlasAiBootstrapped(): boolean {
  return bootstrapped;
}

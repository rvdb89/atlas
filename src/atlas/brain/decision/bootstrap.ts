import { registerDefaultDecisionPolicies } from "./DecisionRegistry";

let bootstrapped = false;

export function bootstrapAtlasDecision(): void {
  if (bootstrapped) return;

  registerDefaultDecisionPolicies();
  bootstrapped = true;
}

export function isAtlasDecisionBootstrapped(): boolean {
  return bootstrapped;
}

import { registerDefaultAuditRules } from "./AuditRegistry";

let bootstrapped = false;

export function bootstrapAtlasAuditor(): void {
  if (bootstrapped) return;
  registerDefaultAuditRules();
  bootstrapped = true;
}

export function isAtlasAuditorBootstrapped(): boolean {
  return bootstrapped;
}

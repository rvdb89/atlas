import { listAuditRules } from "./AuditRegistry";
import type { AuditContext, AuditRuleResult } from "./audit.types";

export function runAuditRules(context: AuditContext): AuditRuleResult[] {
  return listAuditRules().map((rule) => rule.run(context));
}

export function summarizeAuditResults(results: AuditRuleResult[]): {
  passedChecks: number;
  totalChecks: number;
  warningCount: number;
  blockerCount: number;
} {
  const passedChecks = results.filter((entry) => entry.passed).length;
  const warningCount = results.reduce((total, entry) => total + entry.warnings.length, 0);
  const blockerCount = results.reduce((total, entry) => total + entry.blockers.length, 0);

  return {
    passedChecks,
    totalChecks: results.length,
    warningCount,
    blockerCount,
  };
}

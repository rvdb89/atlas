import type { AuditRule } from "./audit.types";
import { DEFAULT_AUDIT_RULES } from "./AuditRule";

const rules = new Map<string, AuditRule>();

export function registerAuditRule(rule: AuditRule): void {
  rules.set(rule.id, rule);
}

export function unregisterAuditRule(ruleId: string): void {
  rules.delete(ruleId);
}

export function getAuditRule(ruleId: string): AuditRule | undefined {
  return rules.get(ruleId);
}

export function listAuditRules(): AuditRule[] {
  return [...rules.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function registerDefaultAuditRules(): void {
  for (const run of DEFAULT_AUDIT_RULES) {
    const probe = run(createProbeContext());
    registerAuditRule({
      id: probe.ruleId,
      label: probe.label,
      category: probe.category,
      description: probe.message,
      run,
    });
  }
}

function createProbeContext(): Parameters<AuditRule["run"]>[0] {
  return {
    collectedAt: new Date().toISOString(),
    atlasVersion: "0.0.0",
    atlasBuild: "probe",
    git: {
      available: true,
      clean: true,
      changedFiles: [],
      stagedFiles: [],
      hasEnvStaged: false,
      hasEnvChanged: false,
    },
    changedFiles: [],
    packageScripts: {},
    build: { typescriptOk: true, healthOk: true },
    healthChecks: [],
    brief: {
      sprintId: "probe",
      sprintTitle: "Probe",
      phase: "Probe",
      goals: [],
      definitionOfDone: [],
      architectureRules: [],
      northStarGoals: [],
    },
    scannedFiles: [],
    strict: false,
  };
}

export function isAuditRegistryBootstrapped(): boolean {
  return rules.size > 0;
}

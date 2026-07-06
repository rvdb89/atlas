import type { AuditContext, AuditContextInput } from "./audit.types";
import {
  getConstitutionArchitectureRules,
  getConstitutionNorthStarGoals,
} from "@/atlas/constitution";

export const CURRENT_ARCHITECTURE_BRIEF: AuditContextInput["brief"] = {
  sprintId: "brain-sprint-3.6",
  sprintTitle: "Atlas Auditor Hardening",
  phase: "PHASE 2 — ATLAS BRAIN",
  goals: [
    "Upgrade Atlas Auditor to Audit Report 2.0",
    "Add detailed warnings, blockers, and quality scoring",
    "Enable strict self-review mode for sprint validation",
  ],
  definitionOfDone: [
    "Audit report shows detailed warnings",
    "Audit report shows quality scores",
    "Audit report recommendation is correct",
    "Strict mode exists",
    "Security checks are extended",
    "Architecture checks are extended",
    "North Star check is present",
    "reports/sprints/index.md is updated",
    "Command Center Auditor card is improved",
    "npm run atlas:audit works",
    "npm run atlas:audit -- --strict works",
    "No existing functionality breaks",
  ],
  architectureRules: getConstitutionArchitectureRules(),
  northStarGoals: getConstitutionNorthStarGoals(),
};

export function createAuditContext(input: AuditContextInput): AuditContext {
  return {
    ...input,
    collectedAt: input.collectedAt ?? new Date().toISOString(),
    scannedFiles: input.scannedFiles ?? [],
    strict: input.strict ?? false,
  };
}

export function createMockAuditContext(overrides?: Partial<AuditContextInput>): AuditContext {
  return createAuditContext({
    atlasVersion: "0.14.6",
    atlasBuild: "brain-sprint-3.6",
    git: {
      available: true,
      clean: false,
      branch: "main",
      changedFiles: ["src/atlas/auditor/AuditReport.ts"],
      stagedFiles: [],
      hasEnvStaged: false,
      hasEnvChanged: false,
    },
    changedFiles: ["src/atlas/auditor/AuditReport.ts"],
    packageScripts: {
      "atlas:audit": "tsx scripts/atlas-audit.ts",
    },
    build: {
      typescriptOk: true,
      healthOk: true,
    },
    healthChecks: [{ label: "Atlas health", ok: true, detail: "passed" }],
    brief: CURRENT_ARCHITECTURE_BRIEF,
    ...overrides,
  });
}

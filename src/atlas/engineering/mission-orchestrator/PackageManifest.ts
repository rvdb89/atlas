export type PackageManifest = {
  schemaVersion: "1.0";
  packageType: "engineering";
  missionId: string;
  title: string;
  templateLabel: string;
  atlasVersion: string;
  atlasBuild: string;
  generatedAt: string;
  outputDir: string;
  entrypoint: string;
  legacyBriefPath: string;
  inputRequired: "missionIdOnly" | "intentOnly";
  inferencePipeline: string[];
  constitutionId: string;
  constitutionPath: string;
  decisionFrameworkId: string;
  decisionEngineId: string;
  evolutionEngineId: string;
  organizationModelId: string;
  branchDirectorIdentityId: string;
  dependencies: Array<{
    missionId: string;
    title: string;
    relationship: string;
    reason: string;
  }>;
  files: {
    manifest: string;
    claudeEntrypoint: string;
    architectureBrief: string;
    validationPlan: string;
    auditChecklist: string;
    releaseNotes: string;
  };
};

export const ENGINEERING_PACKAGE_FILENAMES = [
  "manifest.json",
  "claude-engineering-package.md",
  "architecture-brief.md",
  "validation-plan.md",
  "audit-checklist.md",
  "release-notes.md",
] as const;

export type EngineeringPackageFilename = (typeof ENGINEERING_PACKAGE_FILENAMES)[number];

export function buildPackageFilePath(outputDir: string, filename: EngineeringPackageFilename | string): string {
  return `${outputDir}/${filename}`;
}

import type { InferredMissionContext } from "./MissionKnowledge";

export function buildPackageManifest(input: {
  missionId: string;
  title: string;
  templateLabel: string;
  atlasVersion: string;
  atlasBuild: string;
  generatedAt: string;
  outputDir: string;
  legacyBriefPath: string;
  context: InferredMissionContext;
}): PackageManifest {
  const { outputDir } = input;

  return {
    schemaVersion: "1.0",
    packageType: "engineering",
    missionId: input.missionId,
    title: input.title,
    templateLabel: input.templateLabel,
    atlasVersion: input.atlasVersion,
    atlasBuild: input.atlasBuild,
    generatedAt: input.generatedAt,
    outputDir,
    entrypoint: buildPackageFilePath(outputDir, "claude-engineering-package.md"),
    legacyBriefPath: input.legacyBriefPath,
    inputRequired: "missionIdOnly",
    inferencePipeline: input.context.pipeline.map((step) => step.id),
    constitutionId: input.context.constitutionId,
    constitutionPath: input.context.constitutionPath,
    decisionFrameworkId: input.context.decisionTrace.frameworkId,
    decisionEngineId:
      input.context.decisionTrace.decisionEngine?.engineId ??
      input.context.decisionTrace.evolution?.engineId ??
      input.context.decisionTrace.frameworkId,
    evolutionEngineId: input.context.decisionTrace.evolution?.engineId ?? input.context.decisionTrace.frameworkId,
    organizationModelId: input.context.decisionTrace.evolution?.organization?.modelId ?? "ATLAS-002",
    branchDirectorIdentityId: "ATLAS-003",
    dependencies: input.context.dependencies.map((dep) => ({
      missionId: dep.missionId,
      title: dep.title,
      relationship: dep.relationship,
      reason: dep.reason,
    })),
    files: {
      manifest: buildPackageFilePath(outputDir, "manifest.json"),
      claudeEntrypoint: buildPackageFilePath(outputDir, "claude-engineering-package.md"),
      architectureBrief: buildPackageFilePath(outputDir, "architecture-brief.md"),
      validationPlan: buildPackageFilePath(outputDir, "validation-plan.md"),
      auditChecklist: buildPackageFilePath(outputDir, "audit-checklist.md"),
      releaseNotes: buildPackageFilePath(outputDir, "release-notes.md"),
    },
  };
}

export function serializePackageManifest(manifest: PackageManifest): string {
  return JSON.stringify(manifest, null, 2);
}

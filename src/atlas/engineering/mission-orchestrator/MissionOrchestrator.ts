import { briefGenerator, setLastGeneratedBrief } from "../brief-generator/BriefGenerator";
import { generateArchitectureBriefDocument } from "./ArchitectureBriefGenerator";
import { generateAuditChecklistDocument } from "./AuditChecklistGenerator";
import { generateClaudeEngineeringPackage } from "./ClaudePackageGenerator";
import { inferMissionContext } from "./MissionKnowledge";
import type {
  EngineeringPackage,
  EngineeringPackageArtifact,
  MissionOrchestratorOptions,
  MissionOrchestratorResult,
} from "./mission.types";
import type { InferredMissionContext } from "./MissionKnowledge";
import { missionRegistry } from "./MissionRegistry";
import { buildPackageManifest, ENGINEERING_PACKAGE_FILENAMES } from "./PackageManifest";
import { resolveMissionId } from "./MissionResolver";
import { generateReleaseNotesDocument } from "./ReleaseNotesGenerator";
import { generateValidationPlanDocument } from "./ValidationPlanGenerator";

function createArtifact(
  filename: string,
  outputDir: string,
  title: string,
  markdown: string,
): EngineeringPackageArtifact {
  return {
    filename,
    relativePath: `${outputDir}/${filename}`,
    title,
    markdown,
  };
}

export function orchestrateMission(missionId: string, options: MissionOrchestratorOptions = {}): MissionOrchestratorResult {
  const resolved = resolveMissionId(missionId);
  if (!resolved.ok) {
    return { ok: false, message: resolved.message };
  }

  const atlasVersion = options.atlasVersion ?? "0.20.0";
  const atlasBuild = options.atlasBuild ?? "atlas-001-evolution";
  const outputDir = options.outputDir ?? `engineering/packages/${resolved.entry.id}`;
  const briefOutputDir = options.briefOutputDir ?? "engineering/briefs";

  const context = inferMissionContext(resolved.entry, missionRegistry.list(), {
    missionRegistered: (id) => missionRegistry.has(id),
  });

  const briefResult = briefGenerator.generate(resolved.entry.card, {
    atlasVersion,
    atlasBuild,
    outputDir: briefOutputDir,
  });

  if (!briefResult.ok || !briefResult.brief) {
    return {
      ok: false,
      message: briefResult.message ?? "Failed to generate architecture brief.",
    };
  }

  const brief = briefResult.brief;
  setLastGeneratedBrief(brief);

  const legacyBriefPath = brief.outputPath;
  const generatedAt = brief.generatedAt;

  const architectureBrief = generateArchitectureBriefDocument({
    context,
    brief,
    atlasVersion,
    atlasBuild,
  });
  const validationPlan = generateValidationPlanDocument(context, atlasVersion, atlasBuild);
  const auditChecklist = generateAuditChecklistDocument(context, atlasVersion, atlasBuild);
  const releaseNotes = generateReleaseNotesDocument(resolved.entry.card, atlasVersion, atlasBuild);
  const claudePackage = generateClaudeEngineeringPackage({
    context,
    atlasVersion,
    atlasBuild,
    generatedAt,
  });

  const manifest = buildPackageManifest({
    missionId: resolved.entry.id,
    title: resolved.entry.card.title,
    templateLabel: brief.templateLabel,
    atlasVersion,
    atlasBuild,
    generatedAt,
    outputDir,
    legacyBriefPath,
    context,
  });

  const artifacts: EngineeringPackageArtifact[] = [
    createArtifact("architecture-brief.md", outputDir, "Architecture Brief", architectureBrief),
    createArtifact("validation-plan.md", outputDir, "Validation Plan", validationPlan),
    createArtifact("audit-checklist.md", outputDir, "Audit Checklist", auditChecklist),
    createArtifact("release-notes.md", outputDir, "Release Notes", releaseNotes),
    createArtifact("claude-engineering-package.md", outputDir, "Claude Engineering Package", claudePackage),
  ];

  return {
    ok: true,
    package: {
      missionId: resolved.entry.id,
      title: resolved.entry.card.title,
      templateLabel: brief.templateLabel,
      generatedAt,
      outputDir,
      brief,
      context,
      artifacts,
      manifest,
      claudePackagePath: manifest.entrypoint,
      manifestPath: manifest.files.manifest,
      releaseNotesPath: manifest.files.releaseNotes,
      legacyBriefPath,
    },
  };
}

export function getPrimaryClaudeArtifact(pkg: EngineeringPackage): EngineeringPackageArtifact | undefined {
  return pkg.artifacts.find((artifact) => artifact.filename === "claude-engineering-package.md");
}

export function summarizeEngineeringPackage(pkg: EngineeringPackage): string[] {
  return [
    `Input · ${pkg.missionId} (Mission ID only)`,
    `Mission · ${pkg.missionId} — ${pkg.title}`,
    `Template · ${pkg.templateLabel}`,
    `Dependencies · ${pkg.context.dependencies.length}`,
    `Package · ${pkg.outputDir}`,
    `Claude entrypoint · ${pkg.claudePackagePath}`,
    `Legacy brief · ${pkg.legacyBriefPath}`,
  ];
}

export function listExpectedPackageFilenames(): readonly string[] {
  return ENGINEERING_PACKAGE_FILENAMES;
}

export type MissionOrchestratorView = {
  lastMission: string;
  lastPackageDir: string;
  claudePackagePath: string;
  briefPath: string;
  releaseNotesPath: string;
  status: "generated" | "idle" | "error";
  generatedAt: string;
};

let lastPackage: EngineeringPackage | null = null;

export function setLastEngineeringPackage(pkg: EngineeringPackage): void {
  lastPackage = pkg;
}

export function getLastEngineeringPackage(): EngineeringPackage | null {
  return lastPackage;
}

export function getInferredMissionContext(missionId: string): InferredMissionContext | null {
  const resolved = resolveMissionId(missionId);
  if (!resolved.ok) return null;
  return inferMissionContext(resolved.entry, missionRegistry.list(), {
    missionRegistered: (id) => missionRegistry.has(id),
  });
}

export function getMissionOrchestratorView(): MissionOrchestratorView {
  if (!lastPackage) {
    return {
      lastMission: "ATLAS-001",
      lastPackageDir: "engineering/packages/ATLAS-001",
      claudePackagePath: "engineering/packages/ATLAS-001/claude-engineering-package.md",
      briefPath: "engineering/briefs/ATLAS-001.md",
      releaseNotesPath: "engineering/packages/ATLAS-001/release-notes.md",
      status: "idle",
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    lastMission: lastPackage.missionId,
    lastPackageDir: lastPackage.outputDir,
    claudePackagePath: lastPackage.claudePackagePath,
    briefPath: lastPackage.legacyBriefPath,
    releaseNotesPath: lastPackage.releaseNotesPath,
    status: "generated",
    generatedAt: lastPackage.generatedAt,
  };
}

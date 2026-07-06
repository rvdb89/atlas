import type { GeneratedBrief } from "../brief-generator/BriefGenerator";
import type { MissionCard } from "../brief-generator/MissionCard";
import type { InferredMissionContext } from "./MissionKnowledge";
import type { PackageManifest } from "./PackageManifest";

export type { InferredMissionContext, MissionDependency, MissionPipelineStep } from "./MissionKnowledge";

export type MissionRegistryEntry = {
  id: string;
  sourcePath: string;
  card: MissionCard;
};

export type MissionResolveResult =
  | { ok: true; entry: MissionRegistryEntry }
  | { ok: false; message: string };

export type EngineeringPackageArtifact = {
  filename: string;
  relativePath: string;
  title: string;
  markdown: string;
};

export type EngineeringPackage = {
  missionId: string;
  title: string;
  templateLabel: string;
  generatedAt: string;
  outputDir: string;
  brief: GeneratedBrief;
  context: InferredMissionContext;
  artifacts: EngineeringPackageArtifact[];
  manifest: PackageManifest;
  claudePackagePath: string;
  manifestPath: string;
  releaseNotesPath: string;
  legacyBriefPath: string;
};

export type MissionOrchestratorResult =
  | { ok: true; package: EngineeringPackage }
  | { ok: false; message: string };

export type MissionOrchestratorOptions = {
  atlasVersion?: string;
  atlasBuild?: string;
  outputDir?: string;
  briefOutputDir?: string;
};

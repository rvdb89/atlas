import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  ENGINEERING_PACKAGE_FILENAMES,
  orchestrateMission,
  serializePackageManifest,
  setLastEngineeringPackage,
  type EngineeringPackage,
} from "@/atlas/engineering/mission-orchestrator";

import { ROOT_DIR, readAtlasVersion } from "./shared";

/**
 * Shared engineering-package writer — extracted from `atlas-mission.ts` so both the
 * manual CLI (`npm run atlas:mission -- <ID>`) and the always-on runtime
 * (`atlas-runtime.ts`) write packages the exact same way, from one place.
 */

function removeStalePackageFiles(packageRoot: string): void {
  if (!existsSync(packageRoot)) return;

  const allowed = new Set<string>(ENGINEERING_PACKAGE_FILENAMES);
  for (const filename of readdirSync(packageRoot)) {
    if (allowed.has(filename)) continue;

    const target = join(packageRoot, filename);
    // Directories here are never stale package artifacts — e.g. proposed-changes/,
    // written by the Execution Engine — and unlinkSync() on a directory throws EPERM.
    // Only ever remove regular files that aren't on the known artifact list.
    if (statSync(target).isDirectory()) continue;
    unlinkSync(target);
  }
}

export function writePackageArtifacts(pkg: EngineeringPackage): void {
  const packageRoot = join(ROOT_DIR, pkg.outputDir);
  mkdirSync(packageRoot, { recursive: true });
  removeStalePackageFiles(packageRoot);

  for (const artifact of pkg.artifacts) {
    const target = join(ROOT_DIR, artifact.relativePath);
    writeFileSync(target, artifact.markdown, "utf8");
  }

  writeFileSync(join(packageRoot, "manifest.json"), serializePackageManifest(pkg.manifest), "utf8");

  const briefPath = join(ROOT_DIR, pkg.legacyBriefPath);
  mkdirSync(join(briefPath, ".."), { recursive: true });
  writeFileSync(briefPath, pkg.brief.markdown, "utf8");

  const latestPackage = {
    schemaVersion: pkg.manifest.schemaVersion,
    inputRequired: pkg.manifest.inputRequired,
    inferencePipeline: pkg.manifest.inferencePipeline,
    missionId: pkg.missionId,
    title: pkg.title,
    templateLabel: pkg.templateLabel,
    atlasVersion: pkg.manifest.atlasVersion,
    atlasBuild: pkg.manifest.atlasBuild,
    generatedAt: pkg.generatedAt,
    outputDir: pkg.outputDir,
    entrypoint: pkg.claudePackagePath,
    legacyBriefPath: pkg.legacyBriefPath,
    releaseNotesPath: pkg.releaseNotesPath,
    dependencies: pkg.manifest.dependencies,
    files: pkg.manifest.files,
  };

  writeFileSync(
    join(ROOT_DIR, "engineering/packages/latest-package.json"),
    JSON.stringify(latestPackage, null, 2),
    "utf8",
  );

  writeFileSync(
    join(ROOT_DIR, "engineering/briefs/latest-brief.json"),
    JSON.stringify(
      {
        lastMission: pkg.missionId,
        lastGeneratedBrief: pkg.legacyBriefPath,
        templateUsed: pkg.templateLabel,
        status: "generated",
        generatedAt: pkg.generatedAt,
        title: pkg.title,
        packageDir: pkg.outputDir,
        claudePackagePath: pkg.claudePackagePath,
        releaseNotesPath: pkg.releaseNotesPath,
        latestPackagePath: "engineering/packages/latest-package.json",
      },
      null,
      2,
    ),
    "utf8",
  );
}

export type MissionPackageSummary = {
  missionId: string;
  title: string;
  generatedAt: string;
  packageDir: string;
  claudePackagePath: string;
  alreadyExisted: boolean;
};

/**
 * BRAIN-001 · Ensures a mission has a real engineering package on disk. If one already
 * exists (from a previous run or a manual `npm run atlas:mission`), it is left untouched
 * and simply reported — this never overwrites work that may already be in progress.
 * Best-effort: any failure returns null and never throws, so a package-generation
 * problem can never break a decision cycle.
 */
export function ensureMissionPackage(missionId: string | null): MissionPackageSummary | null {
  if (!missionId) return null;

  const packageDir = `engineering/packages/${missionId}`;
  const manifestPath = join(ROOT_DIR, packageDir, "manifest.json");

  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
        title?: string;
        generatedAt?: string;
        entrypoint?: string;
      };
      return {
        missionId,
        title: manifest.title ?? missionId,
        generatedAt: manifest.generatedAt ?? "",
        packageDir,
        claudePackagePath: manifest.entrypoint ?? `${packageDir}/claude-engineering-package.md`,
        alreadyExisted: true,
      };
    } catch (error) {
      console.error(
        `  [package] failed to read existing manifest for ${missionId}, will try to regenerate:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  try {
    const { version, build } = readAtlasVersion();
    const result = orchestrateMission(missionId, { atlasVersion: version, atlasBuild: build });
    if (!result.ok) {
      console.error(`  [package] orchestrateMission(${missionId}) failed: ${result.message}`);
      return null;
    }

    writePackageArtifacts(result.package);
    setLastEngineeringPackage(result.package);

    return {
      missionId: result.package.missionId,
      title: result.package.title,
      generatedAt: result.package.generatedAt,
      packageDir: result.package.outputDir,
      claudePackagePath: result.package.claudePackagePath,
      alreadyExisted: false,
    };
  } catch (error) {
    console.error(`  [package] ensureMissionPackage(${missionId}) threw:`, error instanceof Error ? error.message : error);
    return null;
  }
}

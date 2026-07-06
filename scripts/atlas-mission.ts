import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import {
  ENGINEERING_PACKAGE_FILENAMES,
  missionRegistry,
  orchestrateMission,
  registerMissionFromSource,
  serializePackageManifest,
  setLastEngineeringPackage,
  summarizeEngineeringPackage,
  type EngineeringPackage,
} from "@/atlas/engineering/mission-orchestrator";
import { getBranchDirectorTerminology } from "@/atlas/constitution";

import { ROOT_DIR } from "./atlas/shared";

function readAtlasVersion(): { version: string; build: string } {
  const source = readFileSync(join(ROOT_DIR, "src/atlas/version.ts"), "utf8");
  return {
    version: source.match(/ATLAS_VERSION = "([^"]+)"/)?.[1] ?? "unknown",
    build: source.match(/ATLAS_BUILD = "([^"]+)"/)?.[1] ?? "unknown",
  };
}

function loadMissionFilesFromDisk(): void {
  const missionsDir = join(ROOT_DIR, "engineering/missions");
  if (!existsSync(missionsDir)) return;

  for (const filename of readdirSync(missionsDir)) {
    if (!filename.endsWith(".mission")) continue;

    const missionId = filename.replace(/\.mission$/, "").toUpperCase();
    const sourcePath = `engineering/missions/${filename}`;
    const source = readFileSync(join(ROOT_DIR, sourcePath), "utf8");
    registerMissionFromSource(missionId, sourcePath, source);
  }
}

function removeStalePackageFiles(packageRoot: string): void {
  if (!existsSync(packageRoot)) return;

  const allowed = new Set<string>(ENGINEERING_PACKAGE_FILENAMES);
  for (const filename of readdirSync(packageRoot)) {
    if (allowed.has(filename)) continue;
    unlinkSync(join(packageRoot, filename));
  }
}

function writePackageArtifacts(pkg: EngineeringPackage): void {
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

function printUsage(): void {
  console.log("Usage:");
  console.log("  npm run atlas:mission -- BRAIN-004");
  console.log("");
  console.log("Known missions:");
  for (const mission of missionRegistry.list()) {
    console.log(`  - ${mission.id} · ${mission.card.title}`);
  }
  console.log("");
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const missionId = args[0];

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Branch Director · Mission Control"));
  console.log("");

  loadMissionFilesFromDisk();

  if (!missionId) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  console.log(`Mission ID · ${chalk.cyan(missionId.toUpperCase())}`);
  console.log("");

  const { version, build } = readAtlasVersion();
  const result = orchestrateMission(missionId, {
    atlasVersion: version,
    atlasBuild: build,
  });

  if (!result.ok) {
    console.log(chalk.red(result.message));
    console.log("");
    process.exitCode = 1;
    return;
  }

  writePackageArtifacts(result.package);
  setLastEngineeringPackage(result.package);

  console.log(chalk.green(getBranchDirectorTerminology().executionPackageGenerated));
  console.log(chalk.dim("Input · Mission ID only — Atlas inferred all engineering context"));
  console.log("");
  console.log(chalk.bold("Inference pipeline"));
  for (const step of result.package.context.pipeline) {
    console.log(chalk.dim(`  ✓ ${step.label}`));
  }
  console.log("");
  for (const line of summarizeEngineeringPackage(result.package)) {
    console.log(`  ${line}`);
  }
  console.log("");
  console.log(chalk.bold("Package files"));
  for (const filename of ENGINEERING_PACKAGE_FILENAMES) {
    console.log(chalk.dim(`  ${result.package.outputDir}/${filename}`));
  }
  console.log("");
  console.log(chalk.bold("Claude entrypoint"));
  console.log(`  ${result.package.claudePackagePath}`);
  console.log("");
  console.log(chalk.dim("Latest package metadata · engineering/packages/latest-package.json"));
  console.log("");
}

main();

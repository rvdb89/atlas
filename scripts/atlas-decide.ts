import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import { runDecisionFramework } from "@/atlas/constitution";
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

  writeFileSync(
    join(ROOT_DIR, "engineering/packages/latest-package.json"),
    JSON.stringify(
      {
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
        decisionFrameworkId: pkg.manifest.decisionFrameworkId,
      },
      null,
      2,
    ),
    "utf8",
  );
}

function statusColor(status: string): (text: string) => string {
  if (status === "pass") return chalk.green;
  if (status === "warn") return chalk.yellow;
  return chalk.red;
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const intent = args.join(" ").trim();

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Decision Framework"));
  console.log("");

  loadMissionFilesFromDisk();

  if (!intent) {
    console.log("Usage:");
    console.log('  npm run atlas:decide -- "I want Atlas to become better at planning."');
    console.log("");
    process.exitCode = 1;
    return;
  }

  const decision = runDecisionFramework({
    intent,
    missionRegistered: (id) => missionRegistry.has(id),
  });

  console.log(`Intent · ${chalk.cyan(decision.intent)}`);
  console.log("");

  for (const step of decision.steps) {
    const color = statusColor(step.status);
    console.log(color(`✓ ${step.label}`) + chalk.dim(` · ${step.summary}`));
    for (const detail of step.details.slice(0, 3)) {
      console.log(chalk.dim(`    ${detail}`));
    }
  }

  console.log("");
  console.log(chalk.bold("Why this mission"));
  console.log(`  ${decision.selectionRationale}`);
  console.log("");

  if (decision.nextBestMissionId && decision.nextBestMissionId !== decision.selectedMissionId) {
    console.log(chalk.bold("Next best mission"));
    console.log(`  ${decision.nextBestMissionId}`);
    console.log("");
  }

  if (!decision.selectedMissionId) {
    console.log(chalk.yellow("No mission selected — refine intent or add roadmap entry."));
    console.log("");
    process.exitCode = 1;
    return;
  }

  if (!decision.missionRegistered) {
    console.log(chalk.yellow(`Mission ${decision.selectedMissionId} is not registered yet.`));
    console.log("");
    process.exitCode = 1;
    return;
  }

  const { version, build } = readAtlasVersion();
  const result = orchestrateMission(decision.selectedMissionId, {
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

  console.log(chalk.green("Engineering Package generated"));
  console.log(`  ${result.package.claudePackagePath}`);
  console.log("");
  for (const line of summarizeEngineeringPackage(result.package)) {
    console.log(chalk.dim(`  ${line}`));
  }
  console.log("");
}

main();

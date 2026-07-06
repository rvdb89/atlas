import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import { runDecision } from "@/atlas/brain/decision";
import { getBranchDirectorTerminology } from "@/atlas/constitution";
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
    writeFileSync(join(ROOT_DIR, artifact.relativePath), artifact.markdown, "utf8");
  }

  writeFileSync(join(packageRoot, "manifest.json"), serializePackageManifest(pkg.manifest), "utf8");

  const briefPath = join(ROOT_DIR, pkg.legacyBriefPath);
  mkdirSync(join(briefPath, ".."), { recursive: true });
  writeFileSync(briefPath, pkg.brief.markdown, "utf8");

  writeFileSync(
    join(ROOT_DIR, "engineering/packages/latest-package.json"),
    JSON.stringify(
      {
        missionId: pkg.missionId,
        title: pkg.title,
        outputDir: pkg.outputDir,
        entrypoint: pkg.claudePackagePath,
        evolutionEngineId: pkg.manifest.evolutionEngineId,
        generatedAt: pkg.generatedAt,
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
  console.log(chalk.bold.hex("#B85F1D")("Atlas Decision Engine (Evolution path)"));
  console.log("");

  loadMissionFilesFromDisk();

  if (!intent) {
    console.log("Usage:");
    console.log('  npm run atlas:evolve -- "I want Atlas to become better at planning."');
    console.log("");
    process.exitCode = 1;
    return;
  }

  const terms = getBranchDirectorTerminology();
  const decision = runDecision({
    intent,
    missionRegistered: (id) => missionRegistry.has(id),
  });
  const evolution = decision.evolution;

  console.log(`Intent · ${chalk.cyan(evolution.intent)}`);
  console.log("");

  for (const step of evolution.steps) {
    const color = statusColor(step.status);
    console.log(color(`✓ ${step.label}`) + chalk.dim(` · ${step.summary}`));
    for (const detail of step.details.slice(0, 2)) {
      console.log(chalk.dim(`    ${detail}`));
    }
  }

  console.log("");
  console.log(chalk.bold("Evolution answers"));
  console.log(`  Where are we today? · ${evolution.answers.whereAreWeToday}`);
  console.log(`  Where do we want to be? · ${evolution.answers.whereDoWeWantToBe}`);
  console.log(`  Missing capabilities · ${evolution.answers.missingCapabilities.join(", ") || "none"}`);
  console.log(`  Highest value capability · ${evolution.answers.highestValueCapability ?? "none"}`);
  console.log(`  System to evolve · ${evolution.answers.systemToEvolve ?? "none"}`);
  console.log(`  Missions to create · ${evolution.answers.missionsToCreate.join(", ") || "none"}`);
  console.log("");
  console.log(chalk.bold("Why this decision"));
  console.log(`  ${decision.why}`);
  console.log("");

  if (evolution.organization && !evolution.organization.engineeringPackageRequired) {
    console.log(chalk.bold("Branch Director routing"));
    console.log(`  ${evolution.organization.branchDirectorRationale}`);
    console.log("");
    console.log(chalk.green("Operational routing complete"));
      console.log(chalk.dim(terms.noExecutionPackageRequired + " — Atlas coordinates AI Workers directly."));
    console.log("");
    return;
  }

  if (!decision.executionPackageTrigger || !decision.executionPackageMissionId) {
    console.log(chalk.yellow("Cannot generate package — mission not registered."));
    console.log("");
    process.exitCode = 1;
    return;
  }

  const { version, build } = readAtlasVersion();
  const result = orchestrateMission(decision.executionPackageMissionId, { atlasVersion: version, atlasBuild: build });

  if (!result.ok) {
    console.log(chalk.red(result.message));
    process.exitCode = 1;
    return;
  }

  writePackageArtifacts(result.package);
  setLastEngineeringPackage(result.package);

  console.log(chalk.green(terms.executionPackageGenerated));
  console.log(`  ${result.package.claudePackagePath}`);
  console.log("");
}

main();

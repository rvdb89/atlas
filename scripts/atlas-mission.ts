import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import {
  missionRegistry,
  orchestrateMission,
  registerMissionFromSource,
  setLastEngineeringPackage,
  summarizeEngineeringPackage,
  ENGINEERING_PACKAGE_FILENAMES,
} from "@/atlas/engineering/mission-orchestrator";
import { getBranchDirectorTerminology } from "@/atlas/constitution";

import { ROOT_DIR, readAtlasVersion } from "./atlas/shared";
import { writePackageArtifacts } from "./atlas/missionPackage";

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

import "dotenv/config";

import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import { runAutonomousDecision } from "@/atlas/brain/decision";
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
        decisionEngineId: pkg.manifest.decisionEngineId,
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

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const intent = args.join(" ").trim();

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Decision Engine"));
  console.log("");

  loadMissionFilesFromDisk();

  if (!intent) {
    console.log("Usage:");
    console.log('  npm run atlas:decide -- "I want Atlas to become better at planning."');
    console.log("");
    process.exitCode = 1;
    return;
  }

  const terms = getBranchDirectorTerminology();
  const autonomous = await runAutonomousDecision({
    intent,
    missionRegistered: (id) => missionRegistry.has(id),
  });
  const decision = autonomous.ruleBased;

  console.log(`Intent · ${chalk.cyan(decision.intent)}`);
  console.log("");

  for (const step of decision.steps) {
    const color = statusColor(step.status);
    console.log(color(`✓ ${step.label}`) + chalk.dim(` · ${step.summary}`));
    for (const detail of step.details.slice(0, 2)) {
      console.log(chalk.dim(`    ${detail}`));
    }
  }

  console.log("");
  console.log(chalk.bold("Decision reasoning"));
  for (const line of decision.reasoning.slice(0, 6)) {
    console.log(chalk.dim(`  · ${line}`));
  }
  console.log("");
  console.log(chalk.bold("Why this decision"));
  console.log(`  ${decision.why}`);
  console.log("");

  console.log(chalk.bold("Atlas Autonomous Verdict (Claude)"));
  if (autonomous.source === "ai" && autonomous.ai) {
    const ai = autonomous.ai;
    console.log(
      `  Missie · ${ai.selectedMissionId ?? "geen"} · confidence ${(ai.confidence * 100).toFixed(0)}%`,
    );
    console.log(
      ai.agreesWithRuleBased
        ? chalk.green("  Eens met de rule-based aanbeveling")
        : chalk.yellow("  Wijkt af van de rule-based aanbeveling"),
    );
    console.log(chalk.dim(`  ${ai.reasoning}`));
  } else if (autonomous.aiError) {
    console.log(chalk.yellow(`  Claude-call mislukt, terugval op rule-based: ${autonomous.aiError}`));
  } else {
    console.log(chalk.dim("  ANTHROPIC_API_KEY niet geconfigureerd — alleen rule-based beslissing actief."));
  }
  console.log("");

  if (!decision.executionPackageRequired) {
    console.log(chalk.bold("Branch Director routing"));
    console.log(`  ${decision.evolution.organization?.branchDirectorRationale ?? decision.why}`);
    console.log("");
    console.log(chalk.green("Operational routing complete"));
    console.log(chalk.dim(terms.noExecutionPackageRequired + " — Atlas coordinates AI Workers directly."));
    console.log("");
    return;
  }

  console.log(chalk.bold(terms.recommendedNextInitiative));
  console.log(
    `  ${decision.recommendedInitiativeId ?? "none"} · priority ${decision.priorityScore.toFixed(2)}`,
  );
  console.log("");

  if (!decision.executionPackageTrigger || !decision.executionPackageMissionId) {
    console.log(chalk.yellow("Cannot generate package — mission not registered or alignment incomplete."));
    console.log("");
    process.exitCode = 1;
    return;
  }

  const { version, build } = readAtlasVersion();
  const result = orchestrateMission(decision.executionPackageMissionId, {
    atlasVersion: version,
    atlasBuild: build,
  });

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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

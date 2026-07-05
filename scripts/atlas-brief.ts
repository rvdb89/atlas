import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import {
  briefGenerator,
  CURRENT_ENGINEERING_MISSION_CARD,
  parseMissionCard,
  setLastGeneratedBrief,
} from "@/atlas/engineering/brief-generator";

import { ROOT_DIR } from "./atlas/shared";

function readAtlasVersion(): { version: string; build: string } {
  const source = readFileSync(join(ROOT_DIR, "src/atlas/version.ts"), "utf8");
  return {
    version: source.match(/ATLAS_VERSION = "([^"]+)"/)?.[1] ?? "unknown",
    build: source.match(/ATLAS_BUILD = "([^"]+)"/)?.[1] ?? "unknown",
  };
}

function resolveMissionSource(args: string[]): { source: string; label: string } {
  const missionArgIndex = args.findIndex((arg) => arg === "--mission");
  if (missionArgIndex >= 0 && args[missionArgIndex + 1]) {
    const missionPath = args[missionArgIndex + 1];
    const fullPath = join(ROOT_DIR, missionPath);
    return {
      source: readFileSync(fullPath, "utf8"),
      label: missionPath,
    };
  }

  const currentPath = join(ROOT_DIR, "engineering/missions/current.mission");
  if (existsSync(currentPath)) {
    return {
      source: readFileSync(currentPath, "utf8"),
      label: "engineering/missions/current.mission",
    };
  }

  return {
    source: CURRENT_ENGINEERING_MISSION_CARD,
    label: "embedded default mission card",
  };
}

function writeBriefOutput(brief: NonNullable<ReturnType<typeof briefGenerator.generate>["brief"]>): void {
  const outputPath = join(ROOT_DIR, brief.outputPath);
  mkdirSync(join(ROOT_DIR, "engineering/briefs"), { recursive: true });
  writeFileSync(outputPath, brief.markdown, "utf8");

  writeFileSync(
    join(ROOT_DIR, "engineering/briefs/latest-brief.json"),
    JSON.stringify(
      {
        lastMission: brief.missionId,
        lastGeneratedBrief: brief.outputPath,
        templateUsed: brief.templateLabel,
        status: "generated",
        generatedAt: brief.generatedAt,
        title: brief.title,
      },
      null,
      2,
    ),
    "utf8",
  );
}

function main(): void {
  const args = process.argv.slice(2);
  const { source, label } = resolveMissionSource(args);
  const parsed = parseMissionCard(source);

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Mission Brief Generator"));
  console.log("");
  console.log("Mission loaded");
  console.log(chalk.dim(label));
  console.log("");

  if (!parsed.ok || !parsed.card) {
    console.log(chalk.red(parsed.message ?? "Failed to parse mission card"));
    process.exitCode = 1;
    return;
  }

  console.log("Generating Brief...");
  console.log("");

  const { version, build } = readAtlasVersion();
  const result = briefGenerator.generate(parsed.card, {
    atlasVersion: version,
    atlasBuild: build,
  });

  if (!result.ok || !result.brief) {
    console.log(chalk.red(result.message ?? "Brief generation failed"));
    process.exitCode = 1;
    return;
  }

  setLastGeneratedBrief(result.brief);
  writeBriefOutput(result.brief);

  console.log(chalk.green("Brief generated"));
  console.log("");
  console.log(result.brief.outputPath);
  console.log("");
}

main();

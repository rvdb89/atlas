import "dotenv/config";

import chalk from "chalk";

import { missionRegistry } from "@/atlas/engineering/mission-orchestrator";

import { runExecutionEngine } from "./atlas/executionEngine";

/**
 * EXEC-001 · Execution Engine CLI
 *
 * npm run atlas:execute -- <MISSION-ID>
 *
 * Manual, human-triggered entrypoint that turns an already-registered mission's real
 * engineering package into a small, reviewable code proposal. Nothing is written to the
 * working tree — everything lands under
 * engineering/packages/<MISSION-ID>/proposed-changes/ for you to review and apply
 * yourself. See CHANGES.md in that folder for the full breakdown.
 */

function printUsage(): void {
  console.log("Usage:");
  console.log("  npm run atlas:execute -- BRAIN-003");
  console.log("");
  console.log("Known missions:");
  for (const mission of missionRegistry.list()) {
    console.log(`  - ${mission.id} · ${mission.card.title}`);
  }
  console.log("");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const missionId = args[0];

  console.log("");
  console.log(chalk.bold.hex("#38bdf8")("Atlas Execution Engine"));
  console.log(chalk.dim("Draft real code from a mission's engineering package — review-only, nothing auto-applied."));
  console.log("");

  if (!missionId) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  console.log(`Mission ID · ${chalk.cyan(missionId.toUpperCase())}`);
  console.log(chalk.dim("Calling Claude — this can take up to a minute for a real code proposal..."));
  console.log("");

  const result = await runExecutionEngine(missionId);

  if (!result.ok) {
    console.log(chalk.red(result.message));
    console.log("");
    process.exitCode = 1;
    return;
  }

  console.log(chalk.green(`Proposal ready · ${result.files.length} file(s) drafted for ${result.missionId} — ${result.title}`));
  console.log("");

  if (result.contextFiles.length > 0) {
    console.log(chalk.bold(`Real context given to Claude (${result.contextFiles.length} file(s) read from disk)`));
    for (const path of result.contextFiles) {
      console.log(chalk.dim(`  ${path}`));
    }
    console.log("");
  }

  if (result.missingContextPaths.length > 0) {
    console.log(chalk.dim(`Mentioned but not on disk yet (genuinely new): ${result.missingContextPaths.join(", ")}`));
    console.log("");
  }

  console.log(chalk.bold("Summary"));
  console.log(`  ${result.summary}`);
  console.log("");

  if (result.files.length > 0) {
    console.log(chalk.bold("Proposed files (review only — not applied)"));
    for (const file of result.files) {
      console.log(chalk.dim(`  ${file.action} · ${file.path}`));
      console.log(chalk.dim(`    ${file.reason}`));
    }
    console.log("");
  }

  if (result.skippedFiles.length > 0) {
    console.log(chalk.yellow(`Geweigerd door veiligheidscontrole (${result.skippedFiles.length})`));
    for (const file of result.skippedFiles) {
      console.log(chalk.yellow(`  ${file.path} — ${file.reason}`));
    }
    console.log("");
  }

  if (result.risks.length > 0) {
    console.log(chalk.bold("Risks"));
    for (const risk of result.risks) {
      console.log(`  - ${risk}`);
    }
    console.log("");
  }

  console.log(chalk.bold("Follow-up"));
  console.log(`  ${result.followUp}`);
  console.log("");
  console.log(chalk.dim(`Review directory · ${result.reviewDir}`));
  console.log(chalk.dim(`  Open ${result.reviewDir}/CHANGES.md for the full breakdown.`));
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

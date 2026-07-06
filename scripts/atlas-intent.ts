import chalk from "chalk";

import { runEvolution } from "@/atlas/constitution";

function statusColor(status: string): (text: string) => string {
  if (status === "pass") return chalk.green;
  if (status === "warn") return chalk.yellow;
  return chalk.red;
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const intent = args.join(" ").trim();

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Intent → Evolution"));
  console.log("");

  if (!intent) {
    console.log("Usage:");
    console.log('  npm run atlas:intent -- "I want Atlas to become better at planning."');
    console.log("");
    console.log("For full evolution + package:");
    console.log('  npm run atlas:evolve -- "I want Atlas to become better at planning."');
    console.log("");
    process.exitCode = 1;
    return;
  }

  const evolution = runEvolution({ intent });

  console.log(`Intent · ${chalk.cyan(evolution.intent)}`);
  console.log("");

  for (const step of evolution.steps) {
    const color = statusColor(step.status);
    console.log(color(`✓ ${step.label}`) + chalk.dim(` · ${step.summary}`));
  }

  console.log("");
  console.log(chalk.bold("Recommended mission"));
  console.log(`  ${evolution.selectedMissionId ?? "none"}`);
  console.log("");
  console.log(chalk.dim(evolution.answers.whyNextBestStep));
  console.log("");
  console.log(chalk.dim('Run npm run atlas:evolve -- "..." to generate Engineering Package'));
  console.log("");
}

main();

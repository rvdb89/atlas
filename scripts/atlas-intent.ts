import chalk from "chalk";

import { runDecision } from "@/atlas/brain/decision";
import { getBranchDirectorTerminology } from "@/atlas/constitution";

function statusColor(status: string): (text: string) => string {
  if (status === "pass") return chalk.green;
  if (status === "warn") return chalk.yellow;
  return chalk.red;
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const intent = args.join(" ").trim();

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Intent → Decision"));
  console.log("");

  if (!intent) {
    console.log("Usage:");
    console.log('  npm run atlas:intent -- "I want Atlas to become better at planning."');
    console.log("");
    console.log("For full decision + package:");
    console.log('  npm run atlas:decide -- "I want Atlas to become better at planning."');
    console.log("");
    process.exitCode = 1;
    return;
  }

  const decision = runDecision({ intent });
  const terms = getBranchDirectorTerminology();

  console.log(`Intent · ${chalk.cyan(decision.intent)}`);
  console.log("");

  for (const step of decision.steps) {
    const color = statusColor(step.status);
    console.log(color(`✓ ${step.label}`) + chalk.dim(` · ${step.summary}`));
  }

  console.log("");
  console.log(chalk.bold(terms.recommendedNextInitiative));
  console.log(`  ${decision.recommendedInitiativeId ?? "none"}`);
  console.log("");
  console.log(chalk.bold("Why"));
  console.log(chalk.dim(`  ${decision.why}`));
  console.log("");
  console.log(
    chalk.dim(`Run npm run atlas:decide -- "..." to generate ${terms.executionPackage}`),
  );
  console.log("");
}

main();

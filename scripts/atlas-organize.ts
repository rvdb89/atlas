import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import { runDecision } from "@/atlas/brain/decision";
import { getBranchDirectorTerminology } from "@/atlas/constitution";
import { renderOrganizationMarkdown } from "@/atlas/organization";

import { ROOT_DIR } from "./atlas/shared";

const ORG_MODEL_PATH = "engineering/organization/atlas-organizational-model.md";

function statusColor(status: string): (text: string) => string {
  if (status === "pass") return chalk.green;
  if (status === "warn") return chalk.yellow;
  return chalk.red;
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const intent = args.join(" ").trim();

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Organizational Model"));
  console.log(chalk.dim("Branch Director · Atlas"));
  console.log("");

  mkdirSync(join(ROOT_DIR, "engineering/organization"), { recursive: true });
  writeFileSync(join(ROOT_DIR, ORG_MODEL_PATH), renderOrganizationMarkdown(), "utf8");

  if (!intent) {
    console.log("Organizational model written");
    console.log(`  ${ORG_MODEL_PATH}`);
    console.log("");
    console.log("Usage:");
    console.log('  npm run atlas:organize -- "I want Atlas to improve my Instagram growth."');
    console.log("");
    return;
  }

  const decision = runDecision({ intent });
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

  if (evolution.organization) {
    console.log("");
    console.log(chalk.bold("Branch Director rationale"));
    console.log(`  ${evolution.organization.branchDirectorRationale}`);
    console.log("");

    if (!evolution.organization.engineeringPackageRequired) {
      console.log(chalk.green("Operational routing complete"));
      console.log(chalk.dim(getBranchDirectorTerminology().noExecutionPackageRequired + " — Atlas coordinates AI Workers directly."));
      console.log("");
      return;
    }
  }

  console.log("");
  console.log(chalk.dim(`Software work detected — run npm run atlas:decide for ${getBranchDirectorTerminology().executionPackage} generation.`));
  console.log("");
}

main();

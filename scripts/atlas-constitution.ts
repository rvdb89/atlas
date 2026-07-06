import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import {
  ATLAS_CONSTITUTION_PATH,
  getAtlasConstitution,
  renderConstitutionHierarchy,
  renderConstitutionMarkdown,
} from "@/atlas/constitution";

import { ROOT_DIR } from "./atlas/shared";

function main(): void {
  const constitution = getAtlasConstitution();
  const outputPath = join(ROOT_DIR, ATLAS_CONSTITUTION_PATH);
  mkdirSync(join(outputPath, ".."), { recursive: true });

  const markdown = renderConstitutionMarkdown(constitution);
  writeFileSync(outputPath, markdown, "utf8");

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Constitution"));
  console.log("");
  console.log(`Constitution · ${chalk.cyan(constitution.id)} v${constitution.version}`);
  console.log(`North Star · ${constitution.northStar}`);
  console.log("");
  console.log(chalk.bold("Hierarchy"));
  for (const line of renderConstitutionHierarchy().split("\n")) {
    console.log(chalk.dim(`  ${line}`));
  }
  console.log("");
  console.log(chalk.green("Constitution written"));
  console.log(`  ${ATLAS_CONSTITUTION_PATH}`);
  console.log("");
}

main();

import chalk from "chalk";

import { runCommandInherit } from "./atlas/shared";

/** Runtime Lifecycle Management (tooling, buiten sprintteling) · A safe stop followed by a
 * safe start — reuses both commands as-is rather than duplicating their logic. */
function main(): void {
  console.log(chalk.bold.hex("#38bdf8")("Atlas Runtime — restart"));

  try {
    runCommandInherit("npm", ["run", "atlas:runtime:stop"]);
  } catch (error) {
    console.log(
      chalk.yellow("De stop-stap gaf een fout — ga toch door met de start-stap."),
      error instanceof Error ? error.message : error,
    );
  }

  runCommandInherit("npm", ["run", "atlas:runtime:start"]);
}

main();

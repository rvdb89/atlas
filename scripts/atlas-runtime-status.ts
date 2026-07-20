import chalk from "chalk";

import { inspectRuntimeState, printRuntimeUrls } from "./atlas/runtimeLifecycle";

/** Runtime Lifecycle Management (tooling, buiten sprintteling) · Read-only — never mutates
 * anything, never removes a stale PID file (that happens in `atlas:runtime:start`/`:stop`). */
async function main(): Promise<void> {
  const state = await inspectRuntimeState();

  switch (state.kind) {
    case "healthy":
      console.log(chalk.green(`Atlas draait gezond (PID ${state.pid}).`));
      printRuntimeUrls(state.pid);
      return;

    case "running-unhealthy":
      console.log(chalk.yellow(`Proces draait (PID ${state.pid}), maar Executive Memory reageert niet op /health.`));
      console.log(chalk.dim("Mogelijk nog aan het opstarten, of vastgelopen — bekijk het logbestand."));
      return;

    case "stale-pid":
      console.log(chalk.yellow(`PID-bestand bestaat (PID ${state.pid}), maar dat proces draait niet meer.`));
      console.log(chalk.dim("Wordt automatisch opgeruimd bij de volgende `npm run atlas:runtime:start`."));
      return;

    case "ports-occupied-by-unknown-process":
      console.log(chalk.red("Atlas draait niet volgens het eigen PID-bestand, maar onderstaande poort(en) zijn wel bezet:"));
      for (const entry of state.occupied) {
        console.log(chalk.red(`  poort ${entry.port}: PID ${entry.pids.join(", ")} — ${entry.commands.join(" | ") || "onbekend"}`));
      }
      console.log(chalk.dim("Dit is niet per se een Atlas-proces — controleer zelf voor je iets afsluit."));
      return;

    case "not-running":
      console.log(chalk.dim("Atlas draait niet."));
      return;
  }
}

main().catch((error) => {
  console.error(chalk.red("Onverwachte fout bij status-check:"), error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

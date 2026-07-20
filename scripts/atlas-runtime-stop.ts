import chalk from "chalk";

import { inspectRuntimeState, isProcessAlive, removePidFile } from "./atlas/runtimeLifecycle";

/** Runtime Lifecycle Management (tooling, buiten sprintteling) · Only ever signals the exact
 * PID recorded in .atlas/runtime.pid — never touches a process just because it happens to be
 * listening on 8791/8792 (unlike scripts/atlas/shared.ts's killPortProcesses(), deliberately
 * not used here). */
async function main(): Promise<void> {
  const state = await inspectRuntimeState();

  if (state.kind === "not-running") {
    console.log(chalk.dim("Atlas draait niet — niets te stoppen."));
    return;
  }

  if (state.kind === "ports-occupied-by-unknown-process") {
    console.log(
      chalk.yellow(
        "Er is geen PID-bestand van Atlas Runtime, dus ik stop hier niets — de bezette poort(en) horen niet aantoonbaar bij Atlas.",
      ),
    );
    console.log(chalk.dim("Zie `npm run atlas:runtime:status` voor details. Sluit dat proces zelf handmatig af indien gewenst."));
    return;
  }

  if (state.kind === "stale-pid") {
    console.log(chalk.dim(`Verouderd PID-bestand (PID ${state.pid} bestaat niet meer) — opgeruimd.`));
    removePidFile();
    return;
  }

  // "healthy" or "running-unhealthy" — either way, a real, live process this tooling started.
  const pid = state.pid;
  console.log(chalk.dim(`Atlas Runtime stoppen (PID ${pid})…`));

  try {
    process.kill(pid, "SIGTERM");
  } catch (error) {
    console.log(chalk.yellow(`Kon geen SIGTERM sturen naar PID ${pid}: ${error instanceof Error ? error.message : error}`));
    removePidFile();
    return;
  }

  const stopped = await waitUntilDead(pid, 5000);
  if (!stopped) {
    console.log(chalk.yellow(`PID ${pid} reageerde niet binnen 5s op SIGTERM — stuur SIGKILL als laatste redmiddel.`));
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // already gone between the check and here — fine
    }
  }

  // Safety net: the runtime's own shutdown handler already removes this on a graceful
  // SIGTERM (see atlas-runtime.ts), but a SIGKILL bypasses that handler entirely.
  removePidFile();
  console.log(chalk.green("Atlas Runtime gestopt."));
}

async function waitUntilDead(pid: number, timeoutMs: number): Promise<boolean> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (!isProcessAlive(pid)) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return !isProcessAlive(pid);
}

main().catch((error) => {
  console.error(chalk.red("Onverwachte fout bij stoppen:"), error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

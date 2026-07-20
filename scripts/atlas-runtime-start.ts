import "dotenv/config";

import { spawn } from "node:child_process";
import { openSync } from "node:fs";

import chalk from "chalk";

import { ROOT_DIR } from "./atlas/shared";
import {
  LOG_FILE,
  ensureAtlasDir,
  inspectRuntimeState,
  printRuntimeUrls,
  removePidFile,
  waitForExecutiveMemoryHealth,
  writePid,
} from "./atlas/runtimeLifecycle";

/**
 * Runtime Lifecycle Management (tooling, buiten sprintteling — zie CTO-impactanalyse).
 *
 * Idempotent start: reuses an already-healthy Atlas Runtime instead of trying to bind the
 * same ports twice (the EADDRINUSE this whole thing exists to prevent). Never kills anything
 * — if something looks wrong, it reports and exits non-zero rather than guessing.
 *
 * Daemonizes on a genuine cold start: the spawned runtime is detached and unref()'d, so this
 * command returns control to the terminal immediately, and `atlas:runtime:status/stop/restart`
 * can be run later from any other terminal session. `npm run atlas:runtime` / `:once` /
 * `:no-watch` remain unchanged, foreground, low-level commands.
 */
async function main(): Promise<void> {
  console.log(chalk.bold.hex("#38bdf8")("Atlas Runtime — start"));

  const state = await inspectRuntimeState();

  if (state.kind === "healthy") {
    console.log(chalk.green("Atlas draait al gezond — bestaande runtime wordt hergebruikt."));
    printRuntimeUrls(state.pid);
    return;
  }

  if (state.kind === "running-unhealthy") {
    console.log(
      chalk.yellow(
        `Er draait al een proces (PID ${state.pid}) waarvan de Executive Memory health-check niet reageert.`,
      ),
    );
    console.log(
      chalk.yellow(
        "Ik start geen tweede instantie naast een proces dat er al is. Controleer handmatig, of draai eerst: npm run atlas:runtime:stop",
      ),
    );
    process.exitCode = 1;
    return;
  }

  if (state.kind === "ports-occupied-by-unknown-process") {
    console.log(chalk.red("Poort(en) zijn bezet door een proces dat Atlas Runtime niet zelf heeft gestart:"));
    for (const entry of state.occupied) {
      console.log(chalk.red(`  poort ${entry.port}: PID ${entry.pids.join(", ")} — ${entry.commands.join(" | ") || "onbekend"}`));
    }
    console.log(chalk.red("Ik start hier niets automatisch. Controleer en sluit dit proces zelf af als het niet meer nodig is."));
    process.exitCode = 1;
    return;
  }

  if (state.kind === "stale-pid") {
    console.log(chalk.dim(`Verouderd PID-bestand gevonden (PID ${state.pid} bestaat niet meer) — opgeruimd.`));
    removePidFile();
  }

  console.log(chalk.dim("Geen actieve Atlas Runtime gevonden — nieuwe instantie wordt gestart op de achtergrond…"));

  ensureAtlasDir();
  const logFd = openSync(LOG_FILE, "a");
  const child = spawn("npx", ["tsx", "scripts/atlas-runtime.ts", "--no-watch"], {
    cwd: ROOT_DIR,
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.unref();

  if (!child.pid) {
    console.log(chalk.red("Kon het runtimeproces niet starten — geen PID ontvangen."));
    process.exitCode = 1;
    return;
  }

  writePid(child.pid);

  const healthy = await waitForExecutiveMemoryHealth(10_000);
  if (!healthy) {
    console.log(
      chalk.yellow(
        `Proces gestart (PID ${child.pid}), maar Executive Memory reageerde niet binnen 10s. Bekijk het logbestand voor details.`,
      ),
    );
    process.exitCode = 1;
    return;
  }

  console.log(chalk.green("Atlas Runtime gestart."));
  printRuntimeUrls(child.pid);
}

main().catch((error) => {
  console.error(chalk.red("Onverwachte fout bij starten:"), error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

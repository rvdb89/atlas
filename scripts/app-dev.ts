import "dotenv/config";

import { spawn, type ChildProcess } from "node:child_process";

import chalk from "chalk";

import { APP_PORT, APP_URL, ROOT_DIR, waitForUrl } from "./atlas/shared";
import { formatAppRecoveryFailure, recoverAppPort } from "./atlas/os/appPortRecovery";

const CLEAR_CACHE = process.argv.includes("--clear");
const SKIP_RECOVERY = process.argv.includes("--no-recovery");

function failLaunch(message: string, detail?: string): never {
  console.log("");
  console.log(chalk.red(message));
  if (detail) {
    console.log("");
    console.log(detail);
  }
  console.log("");
  process.exit(1);
}

async function launchApp(): Promise<void> {
  console.log("");
  console.log(chalk.cyan("Atlas App launcher"));
  console.log(chalk.dim(`Poort ${APP_PORT} · Studio draait apart op poort 8083`));
  console.log("");

  if (!SKIP_RECOVERY) {
    const recovered = await recoverAppPort((message) => {
      console.log(chalk.yellow("↻"), message);
    });
    if (!recovered.ok) {
      failLaunch("Atlas App kon niet starten — poortconflict", formatAppRecoveryFailure(recovered));
    }
    console.log("");
  }

  const args = ["expo", "start", "--port", String(APP_PORT)];
  if (CLEAR_CACHE) {
    args.push("--clear");
  }

  const child = spawn("npx", args, {
    cwd: ROOT_DIR,
    stdio: "inherit",
    env: {
      ...process.env,
      BROWSER: "none",
      EXPO_NO_TELEMETRY: "1",
    },
  });

  void reportWhenReady(child);

  const shutdown = (code = 0) => {
    child.kill("SIGTERM");
    process.exit(code);
  };

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
  child.on("exit", (code) => process.exit(code ?? 0));
}

async function reportWhenReady(child: ChildProcess): Promise<void> {
  const ready = await waitForUrl(`${APP_URL}/`, 120_000);
  if (child.exitCode != null) {
    return;
  }

  if (ready) {
    console.log("");
    console.log(chalk.green("✔"), `Atlas App ready at ${APP_URL}`);
    console.log(chalk.dim("Press Ctrl+C to stop the app."));
    console.log(chalk.dim("Atlas Studio blijft apart beschikbaar via npm run atlas."));
    console.log("");
    return;
  }

  console.log(chalk.yellow("⚠ Atlas App start duurt langer dan verwacht"));
}

launchApp().catch((error) => {
  failLaunch("Atlas App kon niet starten.", error instanceof Error ? error.message : String(error));
});

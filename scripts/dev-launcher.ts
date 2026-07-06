import "dotenv/config";

import { spawn, type ChildProcess } from "node:child_process";

import chalk from "chalk";

import { ROOT_DIR } from "./atlas/shared";

const START_BOTH = process.argv.includes("--both");

function spawnProcess(command: string, args: string[], label: string): ChildProcess {
  return spawn(command, args, {
    cwd: ROOT_DIR,
    stdio: "inherit",
    env: process.env,
  });
}

function launchBoth(): void {
  console.log("");
  console.log(chalk.cyan("Atlas Dev launcher"));
  console.log(chalk.dim("Starting Atlas Studio (8083) and Atlas App (8081)…"));
  console.log("");

  const atlas = spawnProcess("npx", ["tsx", "scripts/atlas-dev.ts", "--no-open"], "Atlas Studio");
  const app = spawnProcess("npx", ["tsx", "scripts/app-dev.ts", "--no-recovery"], "Atlas App");

  const shutdown = () => {
    atlas.kill("SIGTERM");
    app.kill("SIGTERM");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  const handleExit = (name: string) => (code: number | null) => {
    if (code && code !== 0) {
      console.log(chalk.yellow(`⚠ ${name} stopped (${code})`));
    }
  };

  atlas.on("exit", handleExit("Atlas Studio"));
  app.on("exit", handleExit("Atlas App"));

  app.on("exit", (code) => {
    atlas.kill("SIGTERM");
    process.exit(code ?? 0);
  });
}

function launchAppOnly(): void {
  const child = spawnProcess(
    "npx",
    ["tsx", "scripts/app-dev.ts", "--clear"],
    "Atlas App",
  );

  child.on("exit", (code) => process.exit(code ?? 0));
}

if (START_BOTH) {
  launchBoth();
} else {
  launchAppOnly();
}

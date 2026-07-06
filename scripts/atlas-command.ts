import "dotenv/config";

import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import boxen from "boxen";
import chalk from "chalk";

import { ATLAS_DEV_API_PORT } from "@/atlas/config/ports";
import { ATLAS_PORT, openBrowser, ROOT_DIR } from "./atlas/shared";
import { printInspectorReport } from "./atlas/os/inspector";

type PaletteAction = {
  label: string;
  run: () => Promise<void> | void;
};

function runNpmScript(script: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn("npm", ["run", script], {
      cwd: ROOT_DIR,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => resolve(code ?? 0));
  });
}

function openRoute(path: string): void {
  openBrowser(`http://localhost:${ATLAS_PORT}${path}`);
}

const ACTIONS: PaletteAction[] = [
  {
    label: "Start Studio",
    run: async () => {
      await runNpmScript("atlas");
    },
  },
  {
    label: "Run Health",
    run: async () => {
      await runNpmScript("atlas:health");
    },
  },
  {
    label: "Run Doctor",
    run: async () => {
      await runNpmScript("atlas:doctor");
    },
  },
  {
    label: "Run Workflow",
    run: () => openRoute("/studio/proof-of-power"),
  },
  {
    label: "Open Command Center",
    run: () => openRoute("/studio/command-center"),
  },
  {
    label: "Open Proof Of Power",
    run: () => openRoute("/studio/proof-of-power"),
  },
  {
    label: "Open Health Dashboard",
    run: () => openRoute("/studio/health"),
  },
  {
    label: "Open GitHub",
    run: async () => {
      await runNpmScript("atlas:doctor");
      openBrowser("https://github.com/");
    },
  },
  {
    label: "Open Claude Logs",
    run: () => openRoute("/studio/command-center"),
  },
  {
    label: "Clear Cache",
    run: async () => {
      await runNpmScript("atlas:clean");
    },
  },
  {
    label: "Restart Atlas",
    run: async () => {
      await fetch(`http://127.0.0.1:${ATLAS_DEV_API_PORT}/atlas/restart`, { method: "POST" }).catch(() => undefined);
      await runNpmScript("atlas");
    },
  },
  {
    label: "Inspect Atlas",
    run: () => {
      printInspectorReport();
    },
  },
];

async function main(): Promise<void> {
  console.log(
    boxen(chalk.bold.hex("#B85F1D")("Atlas Command Palette"), {
      padding: 1,
      borderColor: "#B85F1D",
      borderStyle: "round",
    }),
  );
  console.log("");

  ACTIONS.forEach((action, index) => {
    console.log(`${chalk.cyan(String(index + 1).padStart(2, "0"))} · ${action.label}`);
  });

  console.log("");
  const rl = createInterface({ input, output });
  const answer = await rl.question(chalk.bold("Select action (number): "));
  rl.close();

  const index = Number(answer) - 1;
  const action = ACTIONS[index];
  if (!action) {
    console.log(chalk.red("Invalid selection"));
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log(chalk.dim(`Running · ${action.label}`));
  console.log("");
  await action.run();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

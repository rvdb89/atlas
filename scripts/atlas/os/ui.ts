import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import logUpdate from "log-update";

import { ATLAS_OS_TAGLINE } from "./constants";
import { readAtlasVersion, ROOT_DIR } from "../shared";

export function renderAtlasBootScreen(options: {
  workspace: string;
  environment: string;
}): void {
  console.log("");
  console.log(chalk.hex("#B85F1D")("██████████████████████████"));
  console.log("");

  const title = figlet.textSync("ATLAS", { font: "Standard", horizontalLayout: "fitted" });
  console.log(gradient(["#B85F1D", "#7A6652", "#2B2118"])(title));
  console.log("");
  console.log(chalk.dim(ATLAS_OS_TAGLINE));

  const { version, build } = readAtlasVersion();
  console.log(chalk.white(`Version ${version}`));
  console.log("");
  console.log(chalk.hex("#B85F1D")("██████████████████████████"));
  console.log("");

  const info = boxen(
    [
      `${chalk.bold("Project:")}\n${chalk.cyan("doughbert-app")}`,
      `${chalk.bold("Workspace:")}\n${chalk.cyan(options.workspace)}`,
      `${chalk.bold("Environment:")}\n${chalk.cyan(options.environment)}`,
      `${chalk.bold("Build:")}\n${chalk.cyan(build)}`,
    ].join("\n\n"),
    {
      padding: 1,
      borderColor: "#B85F1D",
      borderStyle: "round",
      dimBorder: false,
    },
  );

  console.log(info);
  console.log(chalk.dim(`Root · ${ROOT_DIR}`));
  console.log("");
}

export function renderPreviousSession(options: {
  branch?: string;
  lastCommitShort?: string;
  lastRouteLabel?: string;
}): void {
  if (!options.branch && !options.lastRouteLabel) return;

  console.log(chalk.bold("Vorige sessie"));
  console.log(chalk.dim("─────────────"));

  if (options.branch) {
    console.log(`${chalk.bold("Branch:")} ${options.branch}`);
  }
  if (options.lastCommitShort) {
    console.log(`${chalk.bold("Laatste commit:")} ${options.lastCommitShort}`);
  }
  if (options.lastRouteLabel) {
    console.log(`${chalk.bold("Laatste geopende scherm:")} ${options.lastRouteLabel}`);
  }
  console.log("");
}

export function statusLine(label: string, ok: boolean, detail?: string): string {
  const icon = ok ? chalk.green("✔") : chalk.red("✖");
  return `${icon} ${label}${detail ? chalk.dim(` · ${detail}`) : ""}`;
}

export function watchEvent(message: string): void {
  console.log(chalk.cyan("◆"), chalk.white(message));
}

export function healthDelta(message: string): void {
  console.log(chalk.yellow("△"), message);
}

export function bootComplete(seconds: number): void {
  console.log("");
  console.log(chalk.green.bold(`Atlas booted in ${seconds.toFixed(2)} sec`));
  console.log("");
}

export function performancePanel(stats: Record<string, string | number>): void {
  const body = Object.entries(stats)
    .map(([key, value]) => `${chalk.bold(key)} · ${chalk.cyan(String(value))}`)
    .join("\n");

  console.log(
    boxen(body, {
      title: "Performance",
      titleAlignment: "center",
      padding: 1,
      borderColor: "#7A6652",
      borderStyle: "round",
    }),
  );
  console.log("");
}

export function doctorSolution(level: "ok" | "warning" | "error", label: string, detail?: string, fix?: string): void {
  const icon = level === "ok" ? chalk.green("✔") : level === "warning" ? chalk.yellow("⚠") : chalk.red("✖");
  console.log(`${icon} ${chalk.bold(label)}${detail ? chalk.dim(` — ${detail}`) : ""}`);
  if (fix) {
    console.log(chalk.dim(`   → ${fix}`));
  }
}

export function createLiveLogger() {
  const lines: string[] = [];

  return {
    log(line: string) {
      lines.push(line);
      logUpdate(lines.join("\n"));
    },
    done() {
      logUpdate.done();
      for (const line of lines) {
        console.log(line);
      }
    },
    clear() {
      lines.length = 0;
      logUpdate.clear();
    },
  };
}

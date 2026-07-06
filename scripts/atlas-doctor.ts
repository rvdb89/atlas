import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import boxen from "boxen";
import chalk from "chalk";

import {
  checkAnthropicKeyStatus,
  checkDependenciesInstalled,
  checkEnvFile,
  checkNodeAndNpm,
  checkRouteFiles,
  commandExists,
  readAtlasVersion,
  ROOT_DIR,
  runCommand,
} from "./atlas/shared";
import { doctorSolution } from "./atlas/os/ui";

type DoctorResult = {
  level: "ok" | "warning" | "error";
  label: string;
  detail?: string;
  fix?: string;
};

function checkPackageScript(name: string): boolean {
  const pkg = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf8")) as {
    scripts?: Record<string, string>;
  };
  return Boolean(pkg.scripts?.[name]);
}

function main(): void {
  const { version, build } = readAtlasVersion();

  console.log(
    boxen(
      [
        chalk.bold.hex("#B85F1D")("Atlas Doctor"),
        "",
        `Version ${version}`,
        `Build ${build}`,
      ].join("\n"),
      { padding: 1, borderColor: "#B85F1D", borderStyle: "round" },
    ),
  );
  console.log("");

  const results: DoctorResult[] = [];
  const runtime = checkNodeAndNpm();

  results.push({
    level: runtime.ok ? "ok" : "error",
    label: "Node",
    detail: runtime.ok ? runtime.node : "missing",
    fix: runtime.ok ? undefined : "Install Node.js LTS from https://nodejs.org/",
  });

  results.push({
    level: runtime.ok ? "ok" : "error",
    label: "npm",
    detail: runtime.ok ? runtime.npm : "missing",
    fix: runtime.ok ? undefined : "Install npm via Node.js installer",
  });

  results.push({
    level: checkDependenciesInstalled() ? "ok" : "error",
    label: "Packages",
    detail: checkDependenciesInstalled() ? "installed" : "missing",
    fix: checkDependenciesInstalled() ? undefined : "npm install",
  });

  const env = checkEnvFile();
  results.push({
    level: env.exists ? "ok" : "error",
    label: ".env",
    detail: env.exists ? "found" : "missing",
    fix: env.exists ? undefined : "cp .env.example .env",
  });

  const anthropic = checkAnthropicKeyStatus();
  results.push({
    level: anthropic === "configured" ? "ok" : "warning",
    label: "Claude key",
    detail: anthropic === "configured" ? "configured" : "missing",
    fix:
      anthropic === "configured"
        ? undefined
        : "Open https://console.anthropic.com/ and add ANTHROPIC_API_KEY to .env",
  });

  results.push({
    level: existsSync(join(ROOT_DIR, "node_modules/expo")) ? "ok" : "error",
    label: "Expo",
    detail: existsSync(join(ROOT_DIR, "node_modules/expo")) ? "installed" : "missing",
    fix: existsSync(join(ROOT_DIR, "node_modules/expo")) ? undefined : "npm install",
  });

  results.push({
    level: existsSync(join(ROOT_DIR, "node_modules/typescript")) ? "ok" : "error",
    label: "TypeScript",
    detail: existsSync(join(ROOT_DIR, "node_modules/typescript")) ? "installed" : "missing",
    fix: existsSync(join(ROOT_DIR, "node_modules/typescript")) ? undefined : "npm install",
  });

  for (const script of ["atlas", "atlas:command", "atlas:inspect", "atlas:health", "atlas:doctor", "atlas:audit", "atlas:brief", "atlas:mission"]) {
    results.push({
      level: checkPackageScript(script) ? "ok" : "error",
      label: `Script ${script}`,
      detail: checkPackageScript(script) ? "present" : "missing",
      fix: checkPackageScript(script) ? undefined : "Update package.json scripts",
    });
  }

  if (existsSync(join(ROOT_DIR, ".git"))) {
    try {
      const status = runCommand("git", ["status", "--porcelain"]);
      results.push({
        level: status ? "warning" : "ok",
        label: "Git",
        detail: status ? "uncommitted changes" : "clean",
        fix: status ? "git status" : undefined,
      });

      const remote = runCommand("git", ["remote", "-v"]);
      results.push({
        level: remote.includes("github.com") ? "ok" : "warning",
        label: "GitHub remote",
        detail: remote ? "configured" : "missing",
        fix: remote ? undefined : "git remote add origin <your-repo-url>",
      });
    } catch {
      results.push({ level: "warning", label: "Git", detail: "unavailable" });
    }
  }

  for (const route of checkRouteFiles()) {
    results.push({
      level: route.ok ? "ok" : "error",
      label: `Route ${route.route.replace("src/app", "")}`,
      detail: route.ok ? "exists" : "missing",
      fix: route.ok ? undefined : "Restore Atlas studio route file",
    });
  }

  results.push({
    level: commandExists("lsof") ? "ok" : "warning",
    label: "Port tooling",
    detail: commandExists("lsof") ? "lsof available" : "limited",
    fix: commandExists("lsof") ? undefined : "Install lsof for auto recovery on macOS",
  });

  console.log(chalk.bold("Diagnostics"));
  console.log(chalk.dim("───────────"));
  console.log("");

  for (const result of results) {
    doctorSolution(result.level, result.label, result.detail, result.fix);
  }

  const errors = results.filter((entry) => entry.level === "error").length;
  const warnings = results.filter((entry) => entry.level === "warning").length;

  console.log("");
  console.log(
    chalk.dim(`Summary · ${results.length - errors - warnings} OK · ${warnings} warning(s) · ${errors} error(s)`),
  );

  if (errors > 0) process.exitCode = 1;
}

main();

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { printStatus, ROOT_DIR, runCommand } from "./atlas/shared";

const SECRET_PATTERNS = [
  /sk-ant-[a-zA-Z0-9-_]+/,
  /ANTHROPIC_API_KEY\s*=\s*['"]?sk-/,
  /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9-_]{20,}/i,
  /console\.(log|debug|info)\([^)]*(apiKey|api_key|secret|token)[^)]*\)/i,
];

function getStagedFiles(): string[] {
  try {
    const output = runCommand("git", ["diff", "--cached", "--name-only"]);
    return output ? output.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}

function scanFile(relativePath: string): string[] {
  const warnings: string[] = [];
  const fullPath = join(ROOT_DIR, relativePath);

  try {
    const content = readFileSync(fullPath, "utf8");
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        warnings.push(`${relativePath} matches ${pattern.source}`);
      }
    }
  } catch {
    // ignore unreadable files
  }

  return warnings;
}

function main(): void {
  console.log("");
  console.log("Atlas Commit Check");
  console.log("──────────────────");
  console.log("Pre-commit report only — no commit will be created.");
  console.log("");

  let hasErrors = false;
  let hasWarnings = false;

  console.log("TypeScript");
  try {
    execSync(
      "npx tsc --noEmit && npx tsc --noEmit -p scripts/tsconfig.json && npx tsc --noEmit -p tsconfig.test.json",
      {
        cwd: ROOT_DIR,
        stdio: "pipe",
        encoding: "utf8",
      },
    );
    printStatus("ok", "TypeScript", "clean");
  } catch (error) {
    hasErrors = true;
    printStatus("error", "TypeScript", "failed");
    const message = error instanceof Error ? error.message : String(error);
    console.log(message.split("\n").slice(0, 12).join("\n"));
  }

  console.log("");
  console.log("Tests");
  try {
    execSync("npx tsx --test", { cwd: ROOT_DIR, stdio: "pipe", encoding: "utf8" });
    printStatus("ok", "Tests", "passed");
  } catch (error) {
    hasErrors = true;
    printStatus("error", "Tests", "failed");
    const stdout = (error as { stdout?: string }).stdout ?? "";
    console.log(stdout.split("\n").slice(-20).join("\n"));
  }

  console.log("");
  console.log("Atlas health");
  try {
    execSync("npm run atlas:health", { cwd: ROOT_DIR, stdio: "pipe", encoding: "utf8" });
    printStatus("ok", "Atlas health", "passed");
  } catch (error) {
    hasErrors = true;
    printStatus("error", "Atlas health", "failed");
    const stdout = (error as { stdout?: string }).stdout ?? "";
    console.log(stdout.split("\n").slice(-20).join("\n"));
  }

  console.log("");
  console.log("Git status");
  try {
    const status = runCommand("git", ["status", "--short"]);
    if (!status) {
      printStatus("ok", "Working tree", "no changes");
    } else {
      hasWarnings = true;
      printStatus("warning", "Working tree", "uncommitted changes present");
      console.log(status);
    }
  } catch {
    hasWarnings = true;
    printStatus("warning", "Git", "not available");
  }

  console.log("");
  console.log("Staged file scan");
  const staged = getStagedFiles();
  if (staged.length === 0) {
    printStatus("warning", "Staged files", "none");
  } else {
    printStatus("ok", "Staged files", `${staged.length} file(s)`);

    if (staged.some((file) => file === ".env" || file.endsWith("/.env"))) {
      hasErrors = true;
      printStatus("error", ".env staged", "Never commit .env");
    }

    for (const file of staged) {
      const warnings = scanFile(file);
      for (const warning of warnings) {
        hasWarnings = true;
        printStatus("warning", "Secret pattern", warning);
      }
    }
  }

  console.log("");
  if (hasErrors) {
    printStatus("error", "Commit check", "fix errors before committing");
    process.exitCode = 1;
  } else if (hasWarnings) {
    printStatus("warning", "Commit check", "review warnings before committing");
  } else {
    printStatus("ok", "Commit check", "ready to commit");
  }
  console.log("");
}

main();

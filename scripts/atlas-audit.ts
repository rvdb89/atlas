import chalk from "chalk";

import {
  auditorEngine,
  bootstrapAtlasAuditor,
  createAuditReportPath,
  printAuditCliSummary,
} from "@/atlas/auditor";

import { collectAuditContext, ROOT_DIR, writeAuditReportFile } from "./atlas/audit-context";

function parseArgs(argv: string[]): { strict: boolean } {
  return {
    strict: argv.includes("--strict"),
  };
}

function printCheck(label: string, passed: boolean): void {
  console.log(passed ? `✔ ${label}` : `⚠ ${label}`);
}

function main(): void {
  const { strict } = parseArgs(process.argv.slice(2));
  bootstrapAtlasAuditor();

  console.log("");
  console.log(chalk.bold.hex("#B85F1D")("Atlas Auditor"));
  console.log("");
  console.log(`Running checks${strict ? " (strict mode)" : ""}...`);
  console.log("");

  const context = collectAuditContext({ strict });
  const reportPath = createAuditReportPath(ROOT_DIR);
  const relativeReportPath = reportPath.replace(`${ROOT_DIR}/`, "");
  const result = auditorEngine.runAudit(context, { reportPath: relativeReportPath, strict });
  const report = result.report;
  const markdown = auditorEngine.renderReport(report);

  writeAuditReportFile(reportPath, markdown, report);

  const securityPassed = report.ruleResults
    .filter((entry) => entry.category === "security")
    .every((entry) => entry.passed);
  const architecturePassed = report.ruleResults
    .filter((entry) => ["architecture", "compliance"].includes(entry.category))
    .every((entry) => entry.passed);
  const northStarPassed = report.ruleResults
    .filter((entry) => entry.category === "north-star")
    .every((entry) => entry.passed);

  printCheck("Git status", context.git.available);
  printCheck("TypeScript", context.build.typescriptOk);
  printCheck("Health", context.build.healthOk);
  printCheck("Security", securityPassed);
  printCheck("Architecture rules", architecturePassed);
  printCheck("North Star alignment", northStarPassed);
  printCheck("Quality scoring", report.qualityScores.overall > 0);

  printAuditCliSummary(report, (line) => {
    if (line === undefined) {
      console.log("");
      return;
    }
    console.log(line);
  });

  console.log(chalk.bold("Report:"));
  console.log(relativeReportPath);
  console.log("");

  if (report.recommendation === "BLOCKED") {
    process.exitCode = 1;
  }
}

main();

import "dotenv/config";

import chalk from "chalk";

import { applyProposedChanges } from "./atlas/applyEngine";
// Sprint 1.3 — Tom (Engineering): this CLI is a separate, short-lived process — it opens its
// own SqlitePersistenceAdapter instance pointed at the exact same on-disk database file
// atlas-runtime.ts uses (EXECUTIVE_MEMORY_DB_FILE now lives in ./atlas/shared — never import
// atlas-runtime.ts itself from here, it runs `main()` unconditionally at import time). Same
// SqlitePersistenceAdapter class Sprint 0.1 already established — not a new persistence
// client, not an HTTP self-call.
import { EXECUTIVE_MEMORY_DB_FILE } from "./atlas/shared";
import { SqlitePersistenceAdapter } from "@/atlas/executive-memory/server/SqlitePersistenceAdapter";
import { ExecutiveMemoryService } from "@/atlas/executive-memory/server/ExecutiveMemoryService";
import { createEngineeringAttributionReporter } from "@/atlas/team/EngineeringAttributionReporter";

/**
 * EXEC-001 · Apply Engine CLI
 *
 * npm run atlas:apply -- <MISSION-ID>
 *
 * Applies an already-reviewed Execution Engine proposal
 * (engineering/packages/<MISSION-ID>/proposed-changes/) to the real working tree, then
 * archives the proposal folder. This is the manual counterpart to the automatic apply
 * that fires when you approve the matching item in Atlas Control's CEO Inbox — both call
 * the exact same underlying function.
 */

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const missionId = args[0];

  console.log("");
  console.log(chalk.bold.hex("#38bdf8")("Atlas Apply Engine"));
  console.log(chalk.dim("Apply a reviewed code proposal to the real working tree."));
  console.log("");

  if (!missionId) {
    console.log("Usage:");
    console.log("  npm run atlas:apply -- EXEC-001");
    console.log("");
    process.exitCode = 1;
    return;
  }

  // Sprint 1.3 — Tom (Engineering): optional/additive — applyProposedChanges() behaves
  // identically with or without a reporter. Opened and closed within this single CLI
  // invocation, same lifecycle as any other one-shot script touching Executive Memory.
  const executiveMemoryAdapter = new SqlitePersistenceAdapter(EXECUTIVE_MEMORY_DB_FILE);
  const executiveMemoryService = new ExecutiveMemoryService(executiveMemoryAdapter);
  const engineeringAttributionReporter = createEngineeringAttributionReporter(executiveMemoryService);

  const result = await applyProposedChanges(missionId, engineeringAttributionReporter);
  executiveMemoryAdapter.close();

  if (!result.ok) {
    console.log(chalk.red(result.message));
    console.log("");
    process.exitCode = 1;
    return;
  }

  console.log(chalk.green(`Applied ${result.applied.length} file(s) for ${result.missionId}`));
  console.log("");
  for (const file of result.applied) {
    console.log(chalk.dim(`  ${file.action} · ${file.path} (${file.bytesWritten} bytes)`));
  }
  console.log("");

  if (result.skipped.length > 0) {
    console.log(chalk.yellow(`Overgeslagen (${result.skipped.length})`));
    for (const file of result.skipped) {
      console.log(chalk.yellow(`  ${file.path} — ${file.reason}`));
    }
    console.log("");
  }

  console.log(chalk.dim(`Voorstel gearchiveerd naar ${result.archivedTo}`));

  if (result.validation) {
    console.log("");
    if (result.validation.typecheckOk) {
      console.log(chalk.green("TypeScript: schoon (app + scripts + tests)."));
    } else {
      console.log(chalk.red("TypeScript: fouten gevonden na toepassen —"));
      console.log(chalk.red(result.validation.typecheckSummary));
    }
    if (result.validation.testsOk !== undefined) {
      if (result.validation.testsOk) {
        console.log(chalk.green(`Tests: ${result.validation.testSummary ?? "geslaagd."}`));
      } else {
        console.log(chalk.red("Tests: gefaald na toepassen —"));
        console.log(chalk.red(result.validation.testSummary ?? ""));
      }
    }
    console.log(chalk.dim(result.validation.stageNote));
    console.log("");
    console.log(chalk.bold("Voorgesteld commit-bericht:"));
    console.log(chalk.dim(result.validation.suggestedCommitMessage));
    console.log("");
    console.log(chalk.dim(`Klaar om te committen: git commit -F engineering/packages/${result.missionId}/${result.archivedTo.split("/").pop()}/COMMIT_MESSAGE.txt`));
    if (result.fixMission) {
      console.log("");
      console.log(
        chalk.cyan(
          `Herstel-voorstel klaar: ${result.fixMission.fixMissionId} — bekijk ${result.fixMission.reviewDir}/CHANGES.md en keur goed via de CEO Inbox of \`npm run atlas:apply -- ${result.fixMission.fixMissionId}\`.`,
        ),
      );
    }
  } else {
    console.log(chalk.dim("Controleer nu `git diff` en run je typecheck/tests voordat je commit."));
  }
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

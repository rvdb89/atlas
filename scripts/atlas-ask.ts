import "dotenv/config";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import chalk from "chalk";

import { missionRegistry, registerMissionFromSource } from "@/atlas/engineering/mission-orchestrator";

import { ROOT_DIR } from "./atlas/shared";
import { writeCeoInstruction } from "./atlas/ceoInstructions";

/**
 * CONTENT-001 · CEO Instruction CLI
 *
 * npm run atlas:ask -- CONTENT-001 "Vul de recept-kennisartikelen aan"
 *
 * This is an internal/optional verification tool — the CEO never needs to run this. The
 * normal path is: tell Atlas (via chat) what you want, Atlas either points at an existing
 * mission ID or writes a new engineering/missions/<ID>.mission file for the specific
 * request, then queues the instruction the same way this script does. Either way, the
 * always-on runtime (npm run atlas:runtime) picks it up on its very next cycle — no CLI
 * step required for the human. A future in-app "Ask Atlas" text field would call the exact
 * same writeCeoInstruction() function this script calls.
 */

function loadMissionFilesFromDisk(): void {
  const missionsDir = join(ROOT_DIR, "engineering/missions");
  if (!existsSync(missionsDir)) return;

  for (const filename of readdirSync(missionsDir)) {
    if (!filename.endsWith(".mission")) continue;
    const missionId = filename.replace(/\.mission$/, "").toUpperCase();
    const sourcePath = `engineering/missions/${filename}`;
    const source = readFileSync(join(ROOT_DIR, sourcePath), "utf8");
    registerMissionFromSource(missionId, sourcePath, source);
  }
}

function printUsage(): void {
  console.log("Usage:");
  console.log('  npm run atlas:ask -- CONTENT-001 "Vul de recept-kennisartikelen aan"');
  console.log("");
  console.log("Known missions:");
  for (const mission of missionRegistry.list()) {
    console.log(`  - ${mission.id} · ${mission.card.title}`);
  }
  console.log("");
}

async function main(): Promise<void> {
  loadMissionFilesFromDisk();

  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const missionId = args[0];
  const intent = args.slice(1).join(" ").trim();

  console.log("");
  console.log(chalk.bold.hex("#38bdf8")("Atlas CEO Instruction Queue"));
  console.log(chalk.dim("Forces a mission to the top of the next runtime cycle — no capability-gap ranking, no debate."));
  console.log("");

  if (!missionId) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const normalized = missionId.trim().toUpperCase();
  if (!missionRegistry.has(normalized)) {
    console.log(chalk.red(`Mission "${normalized}" is niet geregistreerd.`));
    console.log(chalk.dim(`Voeg eerst engineering/missions/${normalized}.mission toe, run dit commando dan opnieuw.`));
    console.log("");
    printUsage();
    process.exitCode = 1;
    return;
  }

  const card = missionRegistry.get(normalized)?.card;
  const instruction = writeCeoInstruction({
    missionId: normalized,
    intent: intent || `Voer mission ${normalized} uit.`,
    title: card?.title,
  });

  console.log(chalk.green(`Instructie opgeslagen · ${instruction.missionId}${card ? ` — ${card.title}` : ""}`));
  console.log(chalk.dim(`  intent: ${instruction.intent}`));
  console.log("");
  console.log(chalk.dim("De always-on runtime (npm run atlas:runtime) pakt dit op de volgende cyclus op."));
  console.log(chalk.dim("Zodra Claude een voorstel klaar heeft, verschijnt het in de CEO Inbox — Approve is de enige vervolgstap."));
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

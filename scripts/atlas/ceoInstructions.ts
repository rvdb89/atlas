import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { ROOT_DIR } from "./shared";

/**
 * CONTENT-001 · CEO Instruction Queue
 *
 * The always-on runtime already knows how to autonomously pick, package, draft, and
 * (after a CEO Inbox "Approve" click) apply a mission — see EXEC-001/BRAIN-002/BRAIN-003.
 * That loop is driven purely by capability-gap ranking, though: nobody can just *say*
 * "update the Pain de Campagne article" and have it happen next.
 *
 * This is the missing piece: a single-slot pending instruction, written here (today, by
 * Atlas/Claude directly from a chat conversation with the CEO; tomorrow, trivially, by an
 * in-app text field calling the same function) and read by atlas-runtime.ts at the top of
 * every cycle. When present, it force-selects the named mission — bypassing capability-gap
 * ranking and the AI verdict's ability to "disagree" — because an explicit human instruction
 * is a command, not a suggestion to be second-guessed. The mission itself must already be
 * registered (a real .mission file under engineering/missions/), since Atlas never invents
 * missions out of thin air — it registers real mission cards, drafts real diffs, and always
 * still requires an explicit CEO Inbox Approve before anything reaches the working tree.
 *
 * Cleared automatically once the referenced mission's execution proposal state reaches
 * "applied" — at that point the request is fully resolved and the runtime reverts to normal
 * capability-gap-based prioritization on its own.
 */

const CEO_INSTRUCTION_PATH = join(ROOT_DIR, "reports", "runtime", "ceo-instruction.json");

export type CeoInstruction = {
  missionId: string;
  /** Free-text intent shown in reasoning/roadmap context — not just the raw mission ID. */
  intent: string;
  /** Human-readable title, so the dashboard never has to show a bare mission ID. */
  title?: string;
  createdAt: string;
};

export function readPendingCeoInstruction(): CeoInstruction | null {
  if (!existsSync(CEO_INSTRUCTION_PATH)) return null;

  try {
    const raw = JSON.parse(readFileSync(CEO_INSTRUCTION_PATH, "utf8")) as Partial<CeoInstruction>;
    if (!raw.missionId || typeof raw.missionId !== "string") return null;

    return {
      missionId: raw.missionId.trim().toUpperCase(),
      intent: typeof raw.intent === "string" && raw.intent.trim() ? raw.intent.trim() : `Voer mission ${raw.missionId} uit.`,
      title: typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : undefined,
      createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeCeoInstruction(input: { missionId: string; intent: string; title?: string }): CeoInstruction {
  mkdirSync(dirname(CEO_INSTRUCTION_PATH), { recursive: true });

  const instruction: CeoInstruction = {
    missionId: input.missionId.trim().toUpperCase(),
    intent: input.intent.trim(),
    title: input.title?.trim(),
    createdAt: new Date().toISOString(),
  };

  writeFileSync(CEO_INSTRUCTION_PATH, JSON.stringify(instruction, null, 2), "utf8");
  return instruction;
}

export function clearCeoInstruction(): void {
  if (existsSync(CEO_INSTRUCTION_PATH)) {
    unlinkSync(CEO_INSTRUCTION_PATH);
  }
}

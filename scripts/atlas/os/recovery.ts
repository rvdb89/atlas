import { unlinkSync } from "node:fs";
import { join } from "node:path";

import { ATLAS_RESTART_SIGNAL } from "./constants";
import {
  ATLAS_PORT,
  detectDevProcesses,
  getPortPids,
  isPortInUse,
  killPortProcesses,
  ROOT_DIR,
  runCommand,
} from "../shared";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function killPattern(pattern: string): number {
  if (process.platform === "win32") return 0;
  try {
    runCommand("pkill", ["-f", pattern]);
    return 1;
  } catch {
    return 0;
  }
}

export function killStaleDevProcesses(): string[] {
  const actions: string[] = [];
  const patterns = ["expo start", "metro", "@expo/cli"];

  for (const pattern of patterns) {
    if (killPattern(pattern) > 0) {
      actions.push(`Stopped ${pattern}`);
    }
  }

  return actions;
}

export async function autoRecover(onStatus: (message: string) => void): Promise<boolean> {
  const portBusy = isPortInUse(ATLAS_PORT);
  const devProcesses = detectDevProcesses();

  if (!portBusy && devProcesses.length === 0) {
    return true;
  }

  onStatus("Vorige Atlas instance gevonden.");

  if (devProcesses.length > 0) {
    onStatus("Stopping Metro…");
    killPattern("metro");
    onStatus("Stopping Expo…");
    killPattern("expo start");
    killPattern("@expo/cli");
  }

  if (portBusy) {
    onStatus(`Port ${ATLAS_PORT} bezet — vrijmaken…`);
    const pids = getPortPids(ATLAS_PORT);
    killPortProcesses(ATLAS_PORT);
    await sleep(800);

    if (isPortInUse(ATLAS_PORT) && pids.length > 0) {
      for (const pid of pids) {
        try {
          process.kill(pid, "SIGKILL");
        } catch {
          // ignore
        }
      }
      await sleep(400);
    }
  }

  const signalPath = join(ROOT_DIR, ATLAS_RESTART_SIGNAL);
  try {
    unlinkSync(signalPath);
  } catch {
    // ignore
  }

  return !isPortInUse(ATLAS_PORT);
}

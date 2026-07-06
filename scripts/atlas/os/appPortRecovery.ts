import { APP_PORT } from "@/atlas/config/ports";

import {
  describePortUsage,
  getPortPids,
  getProcessCommands,
  isPortInUse,
  killPortProcesses,
} from "../shared";
import type { PortConflict, RecoveryResult } from "./portRecovery";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const APP_PROCESS_PATTERNS = [
  /expo start/i,
  /\bmetro\b/i,
  /@expo\/cli/i,
  /react-native/i,
];

const ATLAS_PROCESS_PATTERNS = [
  /atlas-dev/i,
  /scripts\/atlas-dev/i,
  /scripts\/app-dev/i,
  /atlas\/os\/dev-server/i,
];

function isAppRelatedCommand(command: string): boolean {
  if (ATLAS_PROCESS_PATTERNS.some((pattern) => pattern.test(command))) {
    return false;
  }

  if (/expo start.*--port[= ](8083|8084)\b/i.test(command)) {
    return false;
  }

  return APP_PROCESS_PATTERNS.some((pattern) => pattern.test(command));
}

async function inspectPortConflict(port: number): Promise<PortConflict> {
  const pids = getPortPids(port);
  const commands = getProcessCommands(pids);
  const atlasRelated = commands.some((command) =>
    ATLAS_PROCESS_PATTERNS.some((pattern) => pattern.test(command)),
  );

  return {
    port,
    pids,
    commands,
    atlasRelated: atlasRelated || commands.some(isAppRelatedCommand),
  };
}

function formatPortConflict(conflict: PortConflict): string {
  const lines = [
    `Poort ${conflict.port} is bezet door een ander proces.`,
    "",
    "Procesdetails:",
  ];

  for (let index = 0; index < conflict.pids.length; index += 1) {
    const pid = conflict.pids[index];
    const command = conflict.commands[index] ?? "onbekend commando";
    lines.push(`  PID ${pid} · ${command}`);
  }

  if (conflict.pids.length === 0) {
    lines.push(`  ${describePortUsage(conflict.port)}`);
  }

  lines.push(
    "",
    "Atlas App kan dit proces niet automatisch stoppen.",
    "Maak de poort handmatig vrij en start opnieuw met npm start.",
    `Tip: lsof -nP -iTCP:${conflict.port} -sTCP:LISTEN`,
  );

  return lines.join("\n");
}

async function freePort(port: number, onStatus: (message: string) => void): Promise<RecoveryResult> {
  if (!isPortInUse(port)) {
    return { ok: true };
  }

  const conflict = await inspectPortConflict(port);

  if (!conflict.atlasRelated) {
    return {
      ok: false,
      message: formatPortConflict(conflict),
      conflict,
    };
  }

  onStatus(`Poort ${port} bezet — oude App instance stoppen…`);
  killPortProcesses(port);
  await sleep(800);

  if (isPortInUse(port)) {
    for (const pid of conflict.pids) {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // ignore
      }
    }
    await sleep(400);
  }

  if (isPortInUse(port)) {
    const remaining = await inspectPortConflict(port);
    return {
      ok: false,
      message: formatPortConflict(remaining),
      conflict: remaining,
    };
  }

  return { ok: true };
}

export async function recoverAppPort(onStatus: (message: string) => void): Promise<RecoveryResult> {
  if (!isPortInUse(APP_PORT)) {
    return { ok: true };
  }

  onStatus("Vorige App instance gevonden.");
  return freePort(APP_PORT, onStatus);
}

export function formatAppRecoveryFailure(result: Extract<RecoveryResult, { ok: false }>): string {
  return result.message;
}

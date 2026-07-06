import { ATLAS_DEV_API_PORT, ATLAS_STUDIO_PORT } from "@/atlas/config/ports";

import {
  describePortUsage,
  getPortPids,
  getProcessCommands,
  isPortInUse,
  killPortProcesses,
  probeAtlasDevApi,
  runCommand,
} from "../shared";

export type PortConflict = {
  port: number;
  pids: number[];
  commands: string[];
  atlasRelated: boolean;
};

export type RecoveryResult =
  | { ok: true }
  | { ok: false; message: string; conflict?: PortConflict };

const ATLAS_PROCESS_PATTERNS = [
  /atlas-dev/i,
  /scripts\/atlas-dev/i,
  /atlas\/os\/dev-server/i,
  /expo start.*--port[= ]8083\b/i,
  /\bmetro\b/i,
  /@expo\/cli/i,
];

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

function isAtlasRelatedCommand(command: string): boolean {
  if (/expo start.*--port[= ]8081\b/i.test(command)) {
    return false;
  }

  return ATLAS_PROCESS_PATTERNS.some((pattern) => pattern.test(command));
}

async function inspectPortConflict(port: number): Promise<PortConflict> {
  const pids = getPortPids(port);
  const commands = getProcessCommands(pids);
  let atlasRelated = commands.some(isAtlasRelatedCommand);

  if (port === ATLAS_DEV_API_PORT && !atlasRelated) {
    atlasRelated = await probeAtlasDevApi(port);
  }

  return { port, pids, commands, atlasRelated };
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
    "Atlas Studio kan dit proces niet automatisch stoppen.",
    "Maak de poort handmatig vrij en start opnieuw met npm run atlas.",
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

  onStatus(`Poort ${port} bezet — oude Atlas Studio instance stoppen…`);

  if (port === ATLAS_DEV_API_PORT) {
    killPattern("scripts/atlas-dev");
    killPattern("atlas-dev.ts");
  }

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

export async function autoRecover(onStatus: (message: string) => void): Promise<RecoveryResult> {
  const devApiBusy = isPortInUse(ATLAS_DEV_API_PORT);
  const runtimeBusy = isPortInUse(ATLAS_STUDIO_PORT);

  if (!devApiBusy && !runtimeBusy) {
    return { ok: true };
  }

  onStatus("Vorige Atlas Studio instance gevonden.");

  const devApiResult = await freePort(ATLAS_DEV_API_PORT, onStatus);
  if (!devApiResult.ok) {
    return devApiResult;
  }

  const runtimeResult = await freePort(ATLAS_STUDIO_PORT, onStatus);
  if (!runtimeResult.ok) {
    return runtimeResult;
  }

  return { ok: true };
}

export function formatRecoveryFailure(result: Extract<RecoveryResult, { ok: false }>): string {
  return result.message;
}

/** @deprecated Port-scoped recovery replaced global stale-process cleanup. */
export function killStaleDevProcesses(): string[] {
  return [];
}

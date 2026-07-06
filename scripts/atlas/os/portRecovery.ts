import { ATLAS_DEV_API_PORT } from "./constants";
import {
  ATLAS_PORT,
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
  /expo start/i,
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

export function killStaleDevProcesses(): string[] {
  const actions: string[] = [];
  const patterns = ["expo start", "metro", "@expo/cli", "scripts/atlas-dev"];

  for (const pattern of patterns) {
    if (killPattern(pattern) > 0) {
      actions.push(`Stopped ${pattern}`);
    }
  }

  return actions;
}

function isAtlasRelatedCommand(command: string): boolean {
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
    `Port ${conflict.port} is already in use by another process.`,
    "",
    "Process details:",
  ];

  for (let index = 0; index < conflict.pids.length; index += 1) {
    const pid = conflict.pids[index];
    const command = conflict.commands[index] ?? "unknown command";
    lines.push(`  PID ${pid} · ${command}`);
  }

  if (conflict.pids.length === 0) {
    lines.push(`  ${describePortUsage(conflict.port)}`);
  }

  lines.push(
    "",
    "Atlas cannot stop this process automatically.",
    "Free the port manually, then run npm run atlas again.",
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

  onStatus(`Port ${port} bezet — oude Atlas instance stoppen…`);

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
  const runtimeBusy = isPortInUse(ATLAS_PORT);

  if (!devApiBusy && !runtimeBusy) {
    const staleActions = killStaleDevProcesses();
    if (staleActions.length > 0) {
      onStatus("Oude Atlas dev processen gevonden — opruimen…");
      for (const action of staleActions) {
        onStatus(action);
      }
      await sleep(400);
    }
    return { ok: true };
  }

  onStatus("Vorige Atlas instance gevonden.");

  const staleActions = killStaleDevProcesses();
  for (const action of staleActions) {
    onStatus(action);
  }

  const devApiResult = await freePort(ATLAS_DEV_API_PORT, onStatus);
  if (!devApiResult.ok) {
    return devApiResult;
  }

  const runtimeResult = await freePort(ATLAS_PORT, onStatus);
  if (!runtimeResult.ok) {
    return runtimeResult;
  }

  return { ok: true };
}

export function formatRecoveryFailure(result: Extract<RecoveryResult, { ok: false }>): string {
  return result.message;
}

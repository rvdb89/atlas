import { spawn, type ChildProcess } from "node:child_process";

import { ATLAS_PORT, ROOT_DIR } from "../shared";

const ATLAS_NOISE = [
  /expo/i,
  /metro/i,
  /react-native/i,
  /bundled/i,
  /webpack/i,
  /QR/i,
];

const ATLAS_EVENTS = [
  { pattern: /error/i, label: "Runtime error detected" },
  { pattern: /warning/i, label: "Runtime warning detected" },
];

export type ExpoProcessController = {
  child: ChildProcess;
  restart: () => ChildProcess;
  stop: () => void;
};

export function startAtlasRuntime(options?: { silent?: boolean }): ExpoProcessController {
  let child = spawnExpo(options?.silent ?? true);

  return {
    child,
    restart: () => {
      child.kill("SIGTERM");
      child = spawnExpo(options?.silent ?? true);
      return child;
    },
    stop: () => {
      child.kill("SIGTERM");
    },
  };
}

function spawnExpo(silent: boolean): ChildProcess {
  const child = spawn(
    "npx",
    ["expo", "start", "--web", "--port", String(ATLAS_PORT)],
    {
      cwd: ROOT_DIR,
      stdio: silent ? ["ignore", "pipe", "pipe"] : "inherit",
      env: {
        ...process.env,
        CI: "1",
        EXPO_NO_TELEMETRY: "1",
      },
    },
  );

  if (silent && child.stdout && child.stderr) {
    child.stdout.on("data", (chunk: Buffer) => {
      filterOutput(chunk.toString("utf8"));
    });
    child.stderr.on("data", (chunk: Buffer) => {
      filterOutput(chunk.toString("utf8"));
    });
  }

  child.on("error", () => {
    // surfaced via health checks
  });

  return child;
}

function filterOutput(line: string): void {
  const trimmed = line.trim();
  if (!trimmed) return;

  for (const event of ATLAS_EVENTS) {
    if (event.pattern.test(trimmed)) {
      console.log(`◆ Atlas runtime · ${event.label}`);
      return;
    }
  }

  if (ATLAS_NOISE.some((pattern) => pattern.test(trimmed))) {
    return;
  }
}

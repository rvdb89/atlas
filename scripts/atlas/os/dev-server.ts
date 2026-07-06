import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ATLAS_DEV_API_PORT, ATLAS_RESTART_SIGNAL } from "./constants";
import { autoRecover, formatRecoveryFailure } from "./portRecovery";
import { readSession, updateSessionRoute, writeSession } from "./session";
import { ROOT_DIR } from "../shared";
import type { CeoAdjustOptionId } from "@/atlas/studio/ceo-workflow/ceoWorkflow.types";
import { mapDebriefContinueError } from "@/atlas/studio/ceo-workflow/BranchDirectorDebrief";
import {
  approveCeoWorkflowRelease,
  adjustAfterDebrief,
  continueAfterDebrief,
  getCeoWorkflowState,
  runCeoWorkflowPipeline,
} from "../ceo-workflow/handlers";

export type AtlasDevServerHandlers = {
  onRestart?: () => void;
  onRouteChange?: (path: string, label?: string) => void;
};

export class AtlasPortInUseError extends Error {
  readonly port: number;
  readonly detail: string;

  constructor(port: number, detail: string) {
    super(`Port ${port} is already in use`);
    this.name = "AtlasPortInUseError";
    this.port = port;
    this.detail = detail;
  }
}

let server: Server | null = null;

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function bindDevServer(handlers: AtlasDevServerHandlers): Promise<Server> {
  return new Promise((resolve, reject) => {
    const nextServer = createServer(async (request, response) => {
      if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
      }

      const url = new URL(request.url ?? "/", `http://localhost:${ATLAS_DEV_API_PORT}`);

      if (request.method === "GET" && url.pathname === "/atlas/session") {
        sendJson(response, 200, readSession());
        return;
      }

      if (request.method === "GET" && url.pathname === "/atlas/health") {
        sendJson(response, 200, { ok: true, service: "atlas-dev-api" });
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/session/route") {
        const body = await readBody(request);
        const payload = JSON.parse(body || "{}") as { path?: string; label?: string };
        if (!payload.path) {
          sendJson(response, 400, { error: "path required" });
          return;
        }

        const session = updateSessionRoute(payload.path, payload.label);
        handlers.onRouteChange?.(payload.path, payload.label);
        sendJson(response, 200, session);
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/restart") {
        const signalPath = join(ROOT_DIR, ATLAS_RESTART_SIGNAL);
        writeFileSync(signalPath, `${Date.now()}\n`, "utf8");
        handlers.onRestart?.();
        sendJson(response, 202, { ok: true, message: "restart queued" });
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/notify") {
        sendJson(response, 200, { ok: true });
        return;
      }

      if (request.method === "GET" && url.pathname === "/atlas/ceo-workflow/state") {
        sendJson(response, 200, { workflow: getCeoWorkflowState() });
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/ceo-workflow/run") {
        try {
          const body = await readBody(request);
          const payload = JSON.parse(body || "{}") as { intent?: string };
          if (!payload.intent?.trim()) {
            sendJson(response, 400, { error: "intent required" });
            return;
          }

          const workflow = await runCeoWorkflowPipeline(payload.intent.trim());
          sendJson(response, 200, { workflow });
        } catch (error) {
          sendJson(response, 500, {
            error: error instanceof Error ? error.message : "CEO workflow failed",
          });
        }
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/ceo-workflow/approve") {
        try {
          const body = await readBody(request);
          const payload = JSON.parse(body || "{}") as { commitMessage?: string };
          const workflow = await approveCeoWorkflowRelease(payload.commitMessage);
          sendJson(response, 200, { workflow });
        } catch (error) {
          sendJson(response, 500, {
            error: error instanceof Error ? error.message : "CEO approval failed",
          });
        }
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/ceo-workflow/debrief/continue") {
        try {
          const workflow = await continueAfterDebrief();
          sendJson(response, 200, { workflow });
        } catch (error) {
          sendJson(response, 500, {
            error: mapDebriefContinueError(error instanceof Error ? error.message : undefined),
          });
        }
        return;
      }

      if (request.method === "POST" && url.pathname === "/atlas/ceo-workflow/debrief/adjust") {
        try {
          const body = await readBody(request);
          const payload = JSON.parse(body || "{}") as { option?: string; feedback?: string };
          if (!payload.option) {
            sendJson(response, 400, { error: "option required" });
            return;
          }
          const workflow = await adjustAfterDebrief(payload.option as CeoAdjustOptionId, payload.feedback);
          sendJson(response, 200, { workflow });
        } catch (error) {
          sendJson(response, 500, {
            error: error instanceof Error ? error.message : "Adjust workflow failed",
          });
        }
        return;
      }

      sendJson(response, 404, { error: "not found" });
    });

    nextServer.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        reject(new AtlasPortInUseError(ATLAS_DEV_API_PORT, `Atlas dev API port ${ATLAS_DEV_API_PORT} is already in use`));
        return;
      }
      reject(error);
    });

    nextServer.listen(ATLAS_DEV_API_PORT, "127.0.0.1", () => {
      server = nextServer;
      resolve(nextServer);
    });
  });
}

export async function startAtlasDevServer(handlers: AtlasDevServerHandlers = {}): Promise<Server> {
  if (server) return server;

  try {
    return await bindDevServer(handlers);
  } catch (error) {
    if (!(error instanceof AtlasPortInUseError)) {
      throw error;
    }

    const recovered = await autoRecover((message) => {
      console.log(`↻ ${message}`);
    });

    if (!recovered.ok) {
      throw new AtlasPortInUseError(ATLAS_DEV_API_PORT, formatRecoveryFailure(recovered));
    }

    return bindDevServer(handlers);
  }
}

export function stopAtlasDevServer(): void {
  if (!server) return;
  server.close();
  server = null;
}

export function watchRestartSignal(onRestart: () => void): NodeJS.Timeout {
  const signalPath = join(ROOT_DIR, ATLAS_RESTART_SIGNAL);
  return setInterval(() => {
    if (!existsSync(signalPath)) return;
    try {
      unlinkSync(signalPath);
    } catch {
      // ignore
    }
    onRestart();
  }, 500);
}

export function getDevApiBaseUrl(): string {
  return `http://127.0.0.1:${ATLAS_DEV_API_PORT}`;
}

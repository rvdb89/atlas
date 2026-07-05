import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ATLAS_DEV_API_PORT, ATLAS_RESTART_SIGNAL } from "./constants";
import { readSession, updateSessionRoute, writeSession } from "./session";
import { ROOT_DIR } from "../shared";

export type AtlasDevServerHandlers = {
  onRestart?: () => void;
  onRouteChange?: (path: string, label?: string) => void;
};

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

export function startAtlasDevServer(handlers: AtlasDevServerHandlers = {}): Server {
  if (server) return server;

  server = createServer(async (request, response) => {
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

    sendJson(response, 404, { error: "not found" });
  });

  server.listen(ATLAS_DEV_API_PORT, "127.0.0.1");
  return server;
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

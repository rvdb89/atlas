import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { applyProposedChanges } from "./applyEngine";

/**
 * EXEC-001 · Apply Bridge
 *
 * A tiny, local-only HTTP server that lets Atlas Control's CEO Inbox "Approve" button
 * trigger the same apply logic as `npm run atlas:apply -- <MISSION-ID>` — without ever
 * exposing anything beyond this machine. Intended to be started once by
 * atlas-runtime.ts alongside the background decision loop; the loop itself never calls
 * applyProposedChanges directly, so applying code always requires an explicit click or
 * manual CLI call.
 *
 * Safety model:
 *  - Binds to 127.0.0.1 only — never reachable from outside the local machine.
 *  - Only exposes POST /apply, which re-runs the same allowlist-validated Apply Engine
 *    used by the manual CLI. No other endpoint, no filesystem browsing, no arbitrary paths.
 */

export const APPLY_BRIDGE_PORT = 8791;
export const APPLY_BRIDGE_HOST = "127.0.0.1";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) });
  res.end(payload);
}

async function handleApply(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const raw = await readBody(req);
    const parsed = raw ? (JSON.parse(raw) as { missionId?: unknown }) : {};
    const missionId = typeof parsed.missionId === "string" ? parsed.missionId.trim() : "";

    if (!missionId) {
      sendJson(res, 400, { ok: false, message: "missionId is verplicht in de request body." });
      return;
    }

    const result = applyProposedChanges(missionId);
    sendJson(res, result.ok ? 200 : 422, result);
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error instanceof Error ? error.message : String(error) });
  }
}

/** Starts the local-only apply-bridge. Call once from atlas-runtime.ts at startup —
 * never from the background decision loop itself. Returns the underlying server so the
 * caller can close it on shutdown if needed. */
export function startApplyBridge(): ReturnType<typeof createServer> {
  const server = createServer((req, res) => {
    if (req.method === "POST" && req.url === "/apply") {
      void handleApply(req, res);
      return;
    }
    sendJson(res, 404, { ok: false, message: "Not found. Only POST /apply is supported." });
  });

  server.listen(APPLY_BRIDGE_PORT, APPLY_BRIDGE_HOST, () => {
    console.log(`[atlas] Apply bridge listening on http://${APPLY_BRIDGE_HOST}:${APPLY_BRIDGE_PORT}/apply (local-only)`);
  });

  return server;
}

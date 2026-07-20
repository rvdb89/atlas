import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import type { ExecutiveMemoryValue } from "../contract";
import type { ExecutiveMemoryService } from "./ExecutiveMemoryService";

/**
 * Node-only HTTP transport for Executive Memory. Deliberately thin: every route just parses
 * the request and calls the matching ExecutiveMemoryService method — no domain logic lives
 * here. If this adapter were ever replaced by a different transport, nothing in
 * ExecutiveMemoryService or the SQLite adapter would need to change.
 *
 * Binds to 0.0.0.0 (not 127.0.0.1, unlike the existing 8791 apply-bridge) because a physical
 * mobile device on the same network needs to reach this — 127.0.0.1 on a phone refers to the
 * phone itself. See ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 5, risk 1.
 */

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,PATCH,DELETE,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

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

function errorStatus(error: unknown): number {
  return error instanceof SyntaxError ? 400 : 500;
}

export function createExecutiveMemoryHttpAdapter(service: ExecutiveMemoryService): Server {
  return createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    const url = new URL(request.url ?? "/", "http://executive-memory.local");
    const segments = url.pathname.split("/").filter(Boolean);

    try {
      if (request.method === "GET" && segments[0] === "health") {
        sendJson(response, 200, { ok: true, service: "executive-memory" });
        return;
      }

      // /documents/:namespace/:key
      if (segments[0] === "documents" && segments.length === 3) {
        const [, namespace, key] = segments;

        if (request.method === "GET") {
          const doc = await service.load(namespace, key);
          sendJson(response, doc ? 200 : 404, doc ?? { error: "not found" });
          return;
        }

        if (request.method === "PUT") {
          const body = JSON.parse((await readBody(request)) || "{}") as { value?: ExecutiveMemoryValue };
          const result = await service.save(namespace, key, body.value ?? null);
          sendJson(response, 200, result);
          return;
        }

        if (request.method === "PATCH") {
          const body = JSON.parse((await readBody(request)) || "{}") as { patch?: ExecutiveMemoryValue };
          const result = await service.update(namespace, key, (body.patch ?? {}) as Partial<ExecutiveMemoryValue>);
          sendJson(response, 200, result);
          return;
        }

        if (request.method === "DELETE") {
          const result = await service.delete(namespace, key);
          sendJson(response, 200, result);
          return;
        }
      }

      // /documents/:namespace
      if (segments[0] === "documents" && segments.length === 2 && request.method === "GET") {
        const [, namespace] = segments;
        const result = await service.list(namespace);
        sendJson(response, 200, result);
        return;
      }

      // /actions/:namespace
      if (segments[0] === "actions" && segments.length === 2) {
        const [, namespace] = segments;

        if (request.method === "POST") {
          const body = JSON.parse((await readBody(request)) || "{}") as { type?: string; payload?: ExecutiveMemoryValue };
          if (!body.type) {
            sendJson(response, 400, { error: "type required" });
            return;
          }
          const result = await service.appendAction(namespace, body.type, body.payload ?? null);
          sendJson(response, 200, result);
          return;
        }

        if (request.method === "GET") {
          const since = url.searchParams.get("since") ?? undefined;
          const limitParam = url.searchParams.get("limit");
          const limit = limitParam ? Number(limitParam) : undefined;
          const result = await service.listActions(namespace, { since, limit });
          sendJson(response, 200, result);
          return;
        }
      }

      sendJson(response, 404, { error: "not found" });
    } catch (error) {
      sendJson(response, errorStatus(error), {
        error: error instanceof Error ? error.message : "Executive Memory request failed",
      });
    }
  });
}

export function startExecutiveMemoryHttpAdapter(
  service: ExecutiveMemoryService,
  port: number,
  host = "0.0.0.0",
): Promise<Server> {
  const server = createExecutiveMemoryHttpAdapter(service);
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve(server));
  });
}

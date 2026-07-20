/**
 * Public barrel for Executive Memory — the only officially supported import path from
 * `src/app/**` or any other Expo-bundled code.
 *
 * This file re-exports exactly two things: the protocol-independent contract, and the HTTP
 * client. It deliberately does NOT re-export anything from `./server/` — that code depends on
 * `node:sqlite` / `node:http` and must never reach the web or native bundle. See
 * ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 1, "Hoe imports worden gescheiden".
 *
 * Node-only callers (the always-on runtime, CLI scripts, tests) import directly from
 * `./server/...` instead of this barrel, and talk to ExecutiveMemoryService in-process —
 * they never need this HTTP client at all.
 */

export type {
  ExecutiveMemoryActionLogEntry,
  ExecutiveMemoryContract,
  ExecutiveMemoryDocument,
  ExecutiveMemoryDocumentMeta,
  ExecutiveMemoryKey,
  ExecutiveMemoryNamespace,
  ExecutiveMemoryValue,
  ListActionsOptions,
} from "./contract";
export { ExecutiveMemoryUnavailableError } from "./contract";

export { ExecutiveMemoryHttpClient } from "./client/ExecutiveMemoryHttpClient";

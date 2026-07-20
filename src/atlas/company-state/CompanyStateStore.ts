import { ExecutiveMemoryHttpClient, ExecutiveMemoryUnavailableError } from "@/atlas/executive-memory";

import type { CompanyModels } from "./types";
import { createMockCompanyModels } from "./mock/mockCompanyModels";

/**
 * Persistence for CEO decisions (approvals, adjustments, etc.).
 *
 * Sprint 0.2 · Previously: browser localStorage, web-only (Platform.OS === "web"). Now:
 * Executive Memory (Sprint 0.1) via ExecutiveMemoryHttpClient — same storage path for web
 * and mobile, no platform branch left. See ATLAS_SPRINT_0.2_IMPLEMENTATION_PLAN.md, in
 * particular ADR-0.2-01, for why the public functions below stay synchronous and why writes
 * to Executive Memory are fire-and-forget rather than awaited.
 *
 * The in-memory `models` singleton remains the only source of truth for the running session
 * (ADR-0.2-01, point 2) — Executive Memory is a durability/restore layer underneath it, never
 * the thing consulted for "what is true right now".
 */
const NAMESPACE = "company-state";
const KEY = "default";

/** Sprint 0.2 · The pre-migration, web-only localStorage key. Read at most once — the very
 * first time Executive Memory has no document yet — to carry over any still-pending CEO
 * decisions from before this sprint. Never written to again after this file. */
const LEGACY_LOCAL_STORAGE_KEY = "atlas.company-state.v1";

let models: CompanyModels = createMockCompanyModels();
let hydrationPromise: Promise<void> | null = null;

function readExecutiveMemoryBaseUrl(): string {
  try {
    // Lazy require keeps this file safe to import from a plain Node context too (mirrors
    // src/atlas/config/env.ts's existing pattern for anthropicApiKey) — CompanyStateStore.ts
    // isn't imported from any Node script today, but there's no reason to make that an
    // unstated assumption.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Constants = require("expo-constants").default as {
      expoConfig?: { extra?: { executiveMemoryBaseUrl?: string } };
    };
    const fromExpo = Constants.expoConfig?.extra?.executiveMemoryBaseUrl;
    if (fromExpo) return fromExpo;
  } catch {
    // fall through — not running inside Expo (e.g. a plain Node test)
  }

  const fromProcess = typeof process !== "undefined" ? process.env?.EXECUTIVE_MEMORY_BASE_URL : undefined;
  return fromProcess || "http://localhost:8792";
}

const client = new ExecutiveMemoryHttpClient(readExecutiveMemoryBaseUrl());

/** One-time cleanup: the original demo seed shipped 7 fabricated CEO Inbox items
 * (ids `inbox-*`) that the CEO already approved/deferred before Atlas Control was wired
 * to real triggers. Real triggers use their own id scheme (`pkg-*`, `audit-warnings`,
 * `override-*`), so this only ever strips the old fabricated entries — it never touches
 * anything Atlas generated from real activity. Independent of where the data came from, so
 * it survives the Sprint 0.2 storage swap unchanged. */
function stripFabricatedApprovals(models: CompanyModels): CompanyModels {
  const hasFabricated = models.approvals.some((approval) => approval.id.startsWith("inbox-"));
  if (!hasFabricated) return models;

  return {
    ...models,
    approvals: models.approvals.filter((approval) => !approval.id.startsWith("inbox-")),
  };
}

/** Sprint 0.2 · Reads any still-present pre-migration localStorage data. Web-only by
 * construction (native has no `window`), read at most once, and only ever as a fallback when
 * Executive Memory has nothing yet — see ensureCompanyStateHydrated() below. */
function readLegacyLocalStorage(): CompanyModels | null {
  if (typeof window === "undefined" || !window.localStorage) return null;

  try {
    const raw = window.localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CompanyModels;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.agents)) return null;
    return stripFabricatedApprovals(parsed);
  } catch {
    return null;
  }
}

/** ADR-0.2-01 · Best-effort background persistence — never awaited by callers. A failed write
 * is logged and never blocks or reverts the in-memory mutation that already happened; the
 * next successful write carries the then-current, full snapshot forward. */
function persist(next: CompanyModels): void {
  void client.save(NAMESPACE, KEY, next as unknown as Record<string, unknown>).catch((error: unknown) => {
    console.warn(
      "[executive-memory] Company State kon niet worden opgeslagen — de sessie werkt door in het geheugen.",
      error instanceof ExecutiveMemoryUnavailableError ? error.message : error,
    );
  });
}

/** Restores any persisted CEO decisions once. Safe to call repeatedly; only reads once. Fails
 * open: if Executive Memory is unreachable, the session keeps working on the in-memory mock
 * seed, exactly like before Sprint 0.2 when localStorage was unavailable. */
export function ensureCompanyStateHydrated(): Promise<void> {
  if (!hydrationPromise) {
    hydrationPromise = (async () => {
      try {
        const remote = await client.load(NAMESPACE, KEY);
        if (remote) {
          models = stripFabricatedApprovals(remote.value as CompanyModels);
          return;
        }

        // Executive Memory has nothing yet — one-time migration from the old,
        // web-only localStorage, if there's anything there worth carrying over.
        const legacy = readLegacyLocalStorage();
        if (legacy) {
          models = legacy;
          persist(models);
        }
      } catch (error) {
        console.warn(
          "[executive-memory] Company State kon niet worden geladen — sessie start met de laatst bekende staat.",
          error instanceof ExecutiveMemoryUnavailableError ? error.message : error,
        );
      }
    })();
  }
  return hydrationPromise;
}

export function getCompanyModels(): CompanyModels {
  return models;
}

export function replaceCompanyModels(next: CompanyModels): CompanyModels {
  models = next;
  persist(models);
  return models;
}

/** Clears persisted decisions and restores the mock seed — useful for a "reset demo" action. */
export function resetCompanyModels(): CompanyModels {
  models = createMockCompanyModels();
  persist(models);
  return models;
}

export function updateCompanyModels(updater: (current: CompanyModels) => CompanyModels): CompanyModels {
  models = updater(models);
  persist(models);
  return models;
}

import { Platform } from "react-native";

import type { CompanyModels } from "./types";
import { createMockCompanyModels } from "./mock/mockCompanyModels";

/**
 * Persistence for CEO decisions (approvals, adjustments, etc.).
 *
 * The in-memory `models` singleton would otherwise reset to the mock seed on every page
 * reload — meaning approved/deferred CEO Inbox items came back every time the dashboard
 * was refreshed. We persist to `localStorage` on web (the only platform this runs on
 * today) so decisions survive reloads, and fail open (in-memory only) everywhere else.
 */
const STORAGE_KEY = "atlas.company-state.v1";

let models: CompanyModels = createMockCompanyModels();
let hydrationPromise: Promise<void> | null = null;

function hasWebStorage(): boolean {
  return Platform.OS === "web" && typeof window !== "undefined" && !!window.localStorage;
}

/** One-time cleanup: the original demo seed shipped 7 fabricated CEO Inbox items
 * (ids `inbox-*`) that the CEO already approved/deferred before Atlas Control was wired
 * to real triggers. Real triggers use their own id scheme (`pkg-*`, `audit-warnings`,
 * `override-*`), so this only ever strips the old fabricated entries — it never touches
 * anything Atlas generated from real activity. */
function stripFabricatedApprovals(models: CompanyModels): CompanyModels {
  const hasFabricated = models.approvals.some((approval) => approval.id.startsWith("inbox-"));
  if (!hasFabricated) return models;

  return {
    ...models,
    approvals: models.approvals.filter((approval) => !approval.id.startsWith("inbox-")),
  };
}

function readStorage(): CompanyModels | null {
  if (!hasWebStorage()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CompanyModels;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.agents)) return null;
    return stripFabricatedApprovals(parsed);
  } catch {
    return null;
  }
}

function writeStorage(next: CompanyModels): void {
  if (!hasWebStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — the session keeps working in-memory, just won't persist.
  }
}

/** Restores any persisted CEO decisions once. Safe to call repeatedly; only reads once. */
export function ensureCompanyStateHydrated(): Promise<void> {
  if (!hydrationPromise) {
    hydrationPromise = Promise.resolve().then(() => {
      const stored = readStorage();
      if (stored) {
        models = stored;
      }
    });
  }
  return hydrationPromise;
}

export function getCompanyModels(): CompanyModels {
  return models;
}

export function replaceCompanyModels(next: CompanyModels): CompanyModels {
  models = next;
  writeStorage(models);
  return models;
}

/** Clears persisted decisions and restores the mock seed — useful for a "reset demo" action. */
export function resetCompanyModels(): CompanyModels {
  models = createMockCompanyModels();
  if (hasWebStorage()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return models;
}

export function updateCompanyModels(updater: (current: CompanyModels) => CompanyModels): CompanyModels {
  models = updater(models);
  writeStorage(models);
  return models;
}

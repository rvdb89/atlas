import { loadCompanyState } from "@/atlas/company-state";

import { mapCompanyStateToControlView } from "./controlViewMapper";
import type { ControlLoadResult, ControlSnapshot } from "./types";

let cachedView: ControlSnapshot | null = null;

/** Loads Atlas Control view from the Company State Engine — read-only visualization. */
export async function loadControlSnapshot(): Promise<ControlLoadResult> {
  const result = await loadCompanyState({ source: "mock" });
  cachedView = mapCompanyStateToControlView(result.state, result.source);
  return {
    source: result.source,
    snapshot: cachedView,
  };
}

export function getCachedControlSnapshot(): ControlSnapshot | null {
  return cachedView;
}

export function cacheControlView(snapshot: ControlSnapshot): ControlSnapshot {
  cachedView = snapshot;
  return snapshot;
}

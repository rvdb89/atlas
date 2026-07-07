import { createMockControlSnapshot } from "./mockControlData";
import type { ControlLoadResult } from "./types";

/** Replace mock body with live aggregators when CONTROL data sources are wired. */
export async function loadControlSnapshot(): Promise<ControlLoadResult> {
  return {
    source: "mock",
    snapshot: createMockControlSnapshot(),
  };
}

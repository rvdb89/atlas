import { unlinkSync } from "node:fs";
import { join } from "node:path";

import { ATLAS_RESTART_SIGNAL } from "./constants";
import { autoRecover, formatRecoveryFailure, killStaleDevProcesses, type RecoveryResult } from "./portRecovery";
import { ROOT_DIR } from "../shared";

export { autoRecover, formatRecoveryFailure, killStaleDevProcesses, type RecoveryResult };

export async function recoverAtlasPorts(onStatus: (message: string) => void): Promise<RecoveryResult> {
  const result = await autoRecover(onStatus);

  const signalPath = join(ROOT_DIR, ATLAS_RESTART_SIGNAL);
  try {
    unlinkSync(signalPath);
  } catch {
    // ignore
  }

  return result;
}

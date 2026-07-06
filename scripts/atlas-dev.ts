import "dotenv/config";

import { AtlasPortInUseError } from "./atlas/os/dev-server";
import { formatRecoveryFailure } from "./atlas/os/recovery";
import { launchAtlasOs } from "./atlas/os/launcher";

const WEB_ONLY = process.argv.includes("--web-only");
const SKIP_BROWSER = process.argv.includes("--no-open");
const SKIP_RECOVERY = process.argv.includes("--no-recovery");

launchAtlasOs({
  webOnly: WEB_ONLY,
  skipBrowser: SKIP_BROWSER,
  skipRecovery: SKIP_RECOVERY,
}).catch((error) => {
  console.error("");
  if (error instanceof AtlasPortInUseError) {
    console.error("Atlas kon niet starten — poortconflict");
    console.error("");
    console.error(error.detail);
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  console.error("");
  process.exit(1);
});

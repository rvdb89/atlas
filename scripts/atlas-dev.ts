import "dotenv/config";

import { launchAtlasOs } from "./atlas/os/launcher";

const WEB_ONLY = process.argv.includes("--web-only");
const SKIP_BROWSER = process.argv.includes("--no-open");
const SKIP_RECOVERY = process.argv.includes("--no-recovery");

launchAtlasOs({
  webOnly: WEB_ONLY,
  skipBrowser: SKIP_BROWSER,
  skipRecovery: SKIP_RECOVERY,
}).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

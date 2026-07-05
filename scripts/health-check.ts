import { bootstrapAtlas } from "../src/atlas/bootstrap";
import {
  printAtlasHealthChecks,
  runAtlasHealthChecks,
  runAtlasStartupChecks,
} from "../src/atlas/diagnostics";

function main(): void {
  bootstrapAtlas();
  runAtlasStartupChecks();

  const checks = runAtlasHealthChecks();
  const ok = printAtlasHealthChecks(checks);

  if (!ok) {
    process.exitCode = 1;
  }
}

main();

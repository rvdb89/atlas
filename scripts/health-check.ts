import "dotenv/config";

import { runAtlasHealthReport } from "./atlas/health-report";

process.exitCode = runAtlasHealthReport() ? 0 : 1;

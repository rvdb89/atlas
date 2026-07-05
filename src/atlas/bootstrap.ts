import { registerModule, activateModule } from "./publishing/plugin/registry";
import { bootstrapAtlasAi } from "./ai/bootstrap";
import { bootstrapAtlasIntelligence } from "./intelligence/bootstrap";
import { bootstrapAtlasEntity } from "./entity/bootstrap";
import { bootstrapAtlasStudio } from "./studio/core/bootstrap";
import { runAtlasStartupChecks } from "./diagnostics/startupChecks";
import { registerCoreWorkflows } from "./workflows/registry";
import { registerDoughbertIntelligenceProviders } from "@/modules/doughbert/intelligence/providers";
import { doughbertModule } from "@/modules/doughbert";

let bootstrapped = false;

/** Bootstrap Project Atlas with the active vertical module(s). */
export function bootstrapAtlas(options?: { moduleId?: string }) {
  if (bootstrapped) {
    return;
  }

  bootstrapAtlasAi();
  bootstrapAtlasEntity();
  bootstrapAtlasStudio();
  bootstrapAtlasIntelligence({ defaultModuleId: options?.moduleId ?? "doughbert" });
  registerCoreWorkflows();
  registerModule(doughbertModule);
  activateModule(options?.moduleId ?? "doughbert");
  registerDoughbertIntelligenceProviders();

  const startupIssues = runAtlasStartupChecks({ reset: true });
  if (startupIssues.length > 0 && typeof __DEV__ !== "undefined" && __DEV__) {
    console.warn(
      `[Atlas Startup] ${startupIssues.length} issue(s) detected:`,
      startupIssues.map((issue) => issue.message),
    );
  }

  bootstrapped = true;
}

/** @deprecated Use bootstrapAtlas */
export const bootstrapDoughbertDomain = bootstrapAtlas;

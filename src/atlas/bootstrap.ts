import { registerModule, activateModule } from "./publishing/plugin/registry";
import { bootstrapAtlasAi } from "./ai/bootstrap";
import { doughbertModule } from "@/modules/doughbert";

let bootstrapped = false;

/** Bootstrap Project Atlas with the active vertical module(s). */
export function bootstrapAtlas(options?: { moduleId?: string }) {
  if (bootstrapped) {
    return;
  }

  bootstrapAtlasAi();
  registerModule(doughbertModule);
  activateModule(options?.moduleId ?? "doughbert");
  bootstrapped = true;
}

/** @deprecated Use bootstrapAtlas */
export const bootstrapDoughbertDomain = bootstrapAtlas;

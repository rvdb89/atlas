import { bootstrapAiProviders } from "./providers/bootstrap";
import { registerDoughbertAiHandlers } from "@/modules/doughbert/ai/handlers";

let bootstrapped = false;

export function bootstrapAtlasAi(): void {
  if (bootstrapped) return;
  bootstrapAiProviders();
  registerDoughbertAiHandlers();
  bootstrapped = true;
}

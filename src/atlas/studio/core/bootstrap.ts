import { seedStudioEntities } from "./mockData";

let bootstrapped = false;

export function bootstrapAtlasStudio(): void {
  if (bootstrapped) return;
  seedStudioEntities();
  bootstrapped = true;
}

export function isAtlasStudioBootstrapped(): boolean {
  return bootstrapped;
}

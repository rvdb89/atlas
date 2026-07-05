import {
  bootstrapLocalMemoryProvider,
  registerPlannedMemoryProviders,
} from "./MemoryRegistry";

let bootstrapped = false;

export function bootstrapAtlasMemory(): void {
  if (bootstrapped) return;

  bootstrapLocalMemoryProvider();
  registerPlannedMemoryProviders();

  bootstrapped = true;
}

export function isAtlasMemoryBootstrapped(): boolean {
  return bootstrapped;
}

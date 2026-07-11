import { missionRegistry, createRegistryEntry } from "./MissionRegistry";
import type { MissionRegistryEntry, MissionResolveResult } from "./mission.types";

// Optional trailing letter suffix (e.g. ENG-006B) — the roadmap generates these
// for closely-related sub-initiatives. Found blocking real execution: a valid,
// registered mission (ENG-006B.mission existed) was rejected here before it ever
// reached the registry lookup below.
const MISSION_ID_PATTERN = /^[A-Z]{2,12}-\d{3,4}[A-Z]?$/;

export function normalizeMissionId(id: string): string {
  return id.trim().toUpperCase();
}

export function isValidMissionId(id: string): boolean {
  return MISSION_ID_PATTERN.test(normalizeMissionId(id));
}

export function resolveMissionId(id: string): MissionResolveResult {
  const normalized = normalizeMissionId(id);

  if (!normalized) {
    return { ok: false, message: "Mission ID is required." };
  }

  if (!isValidMissionId(normalized)) {
    return {
      ok: false,
      message: `Invalid mission ID "${id}". Expected format like BRAIN-004 or ENG-006.`,
    };
  }

  const entry = missionRegistry.get(normalized);
  if (!entry) {
    return {
      ok: false,
      message: `Mission "${normalized}" is not registered. Known missions: ${missionRegistry.list().map((item) => item.id).join(", ") || "none"}.`,
    };
  }

  return { ok: true, entry };
}

export function registerMissionFromSource(id: string, sourcePath: string, source: string): MissionResolveResult {
  const entry = createRegistryEntry(id, sourcePath, source);
  if (!entry) {
    return {
      ok: false,
      message: `Failed to parse mission card for "${id}".`,
    };
  }

  missionRegistry.register(entry);
  return { ok: true, entry };
}

export function resolveMissionEntry(entry: MissionRegistryEntry): MissionResolveResult {
  return { ok: true, entry };
}

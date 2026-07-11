import { File, Paths } from "expo-file-system";

import type { StarterFeeding, StarterProfile } from "@/types/starter";

/**
 * Local, on-device persistence for the user's own starter — the first feature in this app
 * that needs to remember something personal to the user rather than serving static baking
 * content. Uses expo-file-system's universal File/Paths API (already a dependency of this
 * project, works on web and native) instead of adding a new package — every read/write is
 * wrapped defensively, so a platform quirk or corrupt file degrades to "no starter yet"
 * rather than crashing the screen; the app still works for the current session even if a
 * write silently fails, it just won't survive a restart.
 */

const STARTER_FILENAME = "doughbert-starter.json";

function starterFile(): File {
  return new File(Paths.document, STARTER_FILENAME);
}

function isValidFeeding(value: unknown): value is StarterFeeding {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.id === "string" && typeof entry.fedAt === "string";
}

export function loadStarterProfile(): StarterProfile | null {
  try {
    const file = starterFile();
    if (!file.exists) return null;

    const parsed = JSON.parse(file.textSync()) as Partial<StarterProfile> | null;
    if (!parsed || typeof parsed.name !== "string" || !parsed.name.trim()) return null;

    return {
      name: parsed.name,
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
      feedings: Array.isArray(parsed.feedings) ? parsed.feedings.filter(isValidFeeding) : [],
    };
  } catch {
    return null;
  }
}

/** Returns whether the write actually reached disk — the caller still updates its own
 * in-memory state regardless, so the feature keeps working for this session either way. */
export function saveStarterProfile(profile: StarterProfile): boolean {
  try {
    const file = starterFile();
    if (!file.exists) {
      file.create();
    }
    file.write(JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

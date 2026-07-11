import type { StarterFeeding, StarterProfile } from "@/types/starter";

export type StarterFreshness = "vers" | "actief" | "hongerig";

const HOUR_MS = 60 * 60 * 1000;
const MAX_FEEDINGS_KEPT = 50;

export function latestFeeding(profile: StarterProfile): StarterFeeding | null {
  return profile.feedings[0] ?? null;
}

/** Simple, honest freshness read — no health science claims, just "how long since fed". */
export function getFreshness(profile: StarterProfile, now: number = Date.now()): StarterFreshness {
  const latest = latestFeeding(profile);
  if (!latest) return "hongerig";

  const hoursSinceFed = (now - Date.parse(latest.fedAt)) / HOUR_MS;
  if (hoursSinceFed < 8) return "vers";
  if (hoursSinceFed < 24) return "actief";
  return "hongerig";
}

export function formatRelativeDutch(iso: string, now: number = Date.now()): string {
  const diffMs = Math.max(0, now - Date.parse(iso));
  const minutes = Math.round(diffMs / 60_000);

  if (minutes < 1) return "zojuist";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minuut" : "minuten"} geleden`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} uur geleden`;

  const days = Math.round(hours / 24);
  return `${days} ${days === 1 ? "dag" : "dagen"} geleden`;
}

export function addFeeding(
  profile: StarterProfile,
  fedAtIso: string = new Date().toISOString(),
): StarterProfile {
  return {
    ...profile,
    feedings: [{ id: `feed-${Date.now()}`, fedAt: fedAtIso }, ...profile.feedings].slice(
      0,
      MAX_FEEDINGS_KEPT,
    ),
  };
}

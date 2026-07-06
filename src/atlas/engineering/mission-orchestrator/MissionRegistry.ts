import type { MissionCard } from "../brief-generator/MissionCard";
import { CURRENT_ENGINEERING_MISSION_CARD, EXAMPLE_MISSION_CARD, parseMissionCard } from "../brief-generator/MissionCard";
import type { MissionRegistryEntry } from "./mission.types";

export type MissionRegistrySource = {
  id: string;
  sourcePath: string;
  source: string;
};

const EMBEDDED_MISSION_SOURCES: MissionRegistrySource[] = [
  {
    id: "ATLAS-000",
    sourcePath: "engineering/missions/ATLAS-000.mission",
    source: `Mission:
ATLAS-000

Title:
Atlas Constitution

Goal:
Atlas must understand WHY it exists before deciding WHAT to build. The Constitution becomes the highest source of truth.

Focus:
Constitution module
North Star and principles
Capabilities and systems
Roadmap and mission derivation
Intent resolver

Constraints:
No Doughbert logic in Atlas core
TypeScript compiles clean

Success:
Human intent maps to missions via Constitution — Atlas determines the rest.`,
  },
  {
    id: "BRAIN-004",
    sourcePath: "engineering/missions/BRAIN-004.mission",
    source: EXAMPLE_MISSION_CARD,
  },
  {
    id: "ENG-002",
    sourcePath: "engineering/missions/current.mission",
    source: CURRENT_ENGINEERING_MISSION_CARD,
  },
  {
    id: "ENG-006B",
    sourcePath: "engineering/missions/ENG-006B.mission",
    source: `Mission:
ENG-006B

Title:
Engineering Package Structure

Goal:
Mission Orchestrator genereert een compleet Engineering Package vanuit alleen een Mission ID.

Focus:
Engineering Package folder
Package manifest
Claude entrypoint
Architecture brief inference
Validation plan
Audit checklist
Release notes stub

Constraints:
Geen breaking changes
npm run atlas:brief blijft werken
ChatGPT schrijft nooit meer Architecture Briefs

Success:
npm run atlas:mission BRAIN-004 levert het volledige Engineering Package zonder extra ChatGPT instructies.`,
  },
];

function normalizeMissionId(id: string): string {
  return id.trim().toUpperCase();
}

function entryFromSource(source: MissionRegistrySource): MissionRegistryEntry | null {
  const parsed = parseMissionCard(source.source);
  if (!parsed.ok || !parsed.card) return null;

  return {
    id: normalizeMissionId(parsed.card.mission),
    sourcePath: source.sourcePath,
    card: parsed.card,
  };
}

export function createRegistryEntry(id: string, sourcePath: string, source: string): MissionRegistryEntry | null {
  const parsed = parseMissionCard(source);
  if (!parsed.ok || !parsed.card) return null;

  const normalized = normalizeMissionId(id || parsed.card.mission);
  if (normalizeMissionId(parsed.card.mission) !== normalized) {
    return null;
  }

  return {
    id: normalized,
    sourcePath,
    card: parsed.card,
  };
}

export function buildEmbeddedMissionRegistry(): MissionRegistryEntry[] {
  const entries: MissionRegistryEntry[] = [];

  for (const source of EMBEDDED_MISSION_SOURCES) {
    const entry = entryFromSource(source);
    if (entry) entries.push(entry);
  }

  return entries;
}

export class MissionRegistry {
  private readonly entries = new Map<string, MissionRegistryEntry>();

  constructor(initialEntries: MissionRegistryEntry[] = buildEmbeddedMissionRegistry()) {
    for (const entry of initialEntries) {
      this.register(entry);
    }
  }

  register(entry: MissionRegistryEntry): void {
    this.entries.set(normalizeMissionId(entry.id), entry);
  }

  has(id: string): boolean {
    return this.entries.has(normalizeMissionId(id));
  }

  get(id: string): MissionRegistryEntry | undefined {
    return this.entries.get(normalizeMissionId(id));
  }

  list(): MissionRegistryEntry[] {
    return [...this.entries.values()].sort((left, right) => left.id.localeCompare(right.id));
  }
}

export const missionRegistry = new MissionRegistry();

export function listKnownMissionIds(): string[] {
  return missionRegistry.list().map((entry) => entry.id);
}

export function getMissionCardById(id: string): MissionCard | undefined {
  return missionRegistry.get(id)?.card;
}

export type StudioRouteItem = {
  id: string;
  emoji: string;
  title: string;
  route: string;
  description: string;
};

/**
 * Primary Atlas Control navigation — daily command center first.
 *
 * ADR-001 (`ATLAS_ARCHITECTURE_DECISIONS.md`, Sprint 4.1): "Atlas Control" (`/studio/control`,
 * `id: "control"`) is the transitional CEO surface, not the canonical one — see
 * `src/atlas/studio/ceoSurface.ts`. This array is left structurally unchanged by that
 * decision; only the meaning of the "control" entry is now explicit.
 */
export const ATLAS_STUDIO_NAV: StudioRouteItem[] = [
  { id: "control", emoji: "◆", title: "Atlas Control", route: "/studio/control", description: "CEO operating system" },
  { id: "entities", emoji: "⬡", title: "Entities", route: "/studio/entities", description: "Entity catalog" },
  { id: "ai", emoji: "✦", title: "AI Studio", route: "/studio/ai-studio", description: "Run AI tasks" },
  { id: "intelligence", emoji: "◎", title: "Intelligence", route: "/studio/intelligence", description: "Insights & gaps" },
  { id: "publishing", emoji: "→", title: "Publishing", route: "/studio/publishing", description: "Draft to live" },
  { id: "assets", emoji: "▢", title: "Assets", route: "/studio/assets", description: "Media & visuals" },
  { id: "quality", emoji: "✓", title: "Quality", route: "/studio/quality", description: "Scores & review" },
  { id: "health", emoji: "♥", title: "Health", route: "/studio/health", description: "Atlas diagnostics" },
  { id: "settings", emoji: "⚙", title: "Settings", route: "/studio/settings", description: "Studio config" },
];

/**
 * Secondary routes — still available, not primary daily flow.
 *
 * ADR-001 (`ATLAS_ARCHITECTURE_DECISIONS.md`, Sprint 4.1): "atlas"/"room" both point at
 * `RoomScreen.tsx`, the canonical CEO surface (`src/atlas/studio/ceoSurface.ts`). This
 * duplicate pair of entries for one screen is known, pre-existing nav debt, named in the
 * ADR's "left unresolved for Sprint 4.2" list — not restructured here to keep this change
 * to annotation only.
 */
export const ATLAS_STUDIO_SECONDARY_NAV: StudioRouteItem[] = [
  { id: "atlas", emoji: "◈", title: "Atlas", route: "/atlas", description: "Atlas Space · first living prototype" },
  { id: "room", emoji: "◈", title: "Atlas Space", route: "/room", description: "Prototype 1 · spatial Atlas" },
  { id: "ceo", emoji: "★", title: "CEO Workflow", route: "/studio/ceo-workflow", description: "Secondary · legacy release flow" },
  { id: "mission", emoji: "◉", title: "Mission Control", route: "/studio", description: "Secondary · OS widgets" },
  { id: "command", emoji: "⌘", title: "Command Center", route: "/studio/command-center", description: "Secondary · diagnostics cockpit" },
  { id: "proof", emoji: "⚡", title: "Proof of Power", route: "/studio/proof-of-power", description: "End-to-end demo" },
];

export const ATLAS_STUDIO_ALL_NAV: StudioRouteItem[] = [
  ...ATLAS_STUDIO_NAV,
  ...ATLAS_STUDIO_SECONDARY_NAV,
];

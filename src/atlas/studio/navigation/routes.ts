export type StudioRouteItem = {
  id: string;
  emoji: string;
  title: string;
  route: string;
  description: string;
};

/** Primary Atlas Control navigation — daily command center first. */
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

/** Secondary routes — still available, not primary daily flow. */
export const ATLAS_STUDIO_SECONDARY_NAV: StudioRouteItem[] = [
  { id: "ceo", emoji: "★", title: "CEO Workflow", route: "/studio/ceo-workflow", description: "Secondary · legacy release flow" },
  { id: "mission", emoji: "◉", title: "Mission Control", route: "/studio", description: "Secondary · OS widgets" },
  { id: "command", emoji: "⌘", title: "Command Center", route: "/studio/command-center", description: "Secondary · diagnostics cockpit" },
  { id: "proof", emoji: "⚡", title: "Proof of Power", route: "/studio/proof-of-power", description: "End-to-end demo" },
];

export const ATLAS_STUDIO_ALL_NAV: StudioRouteItem[] = [
  ...ATLAS_STUDIO_NAV,
  ...ATLAS_STUDIO_SECONDARY_NAV,
];

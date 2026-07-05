export type StudioRouteItem = {
  id: string;
  emoji: string;
  title: string;
  route: string;
  description: string;
};

/** Domain-independent Atlas Studio navigation. */
export const ATLAS_STUDIO_NAV: StudioRouteItem[] = [
  { id: "mission", emoji: "◉", title: "Mission Control", route: "/studio", description: "Atlas OS cockpit" },
  { id: "command", emoji: "⌘", title: "Command Center", route: "/studio/command-center", description: "Central cockpit" },
  { id: "entities", emoji: "⬡", title: "Entities", route: "/studio/entities", description: "Entity catalog" },
  { id: "ai", emoji: "✦", title: "AI Studio", route: "/studio/ai-studio", description: "Run AI tasks" },
  { id: "proof", emoji: "⚡", title: "Proof of Power", route: "/studio/proof-of-power", description: "End-to-end demo" },
  { id: "intelligence", emoji: "◎", title: "Intelligence", route: "/studio/intelligence", description: "Insights & gaps" },
  { id: "publishing", emoji: "→", title: "Publishing", route: "/studio/publishing", description: "Draft to live" },
  { id: "assets", emoji: "▢", title: "Assets", route: "/studio/assets", description: "Media & visuals" },
  { id: "quality", emoji: "✓", title: "Quality", route: "/studio/quality", description: "Scores & review" },
  { id: "settings", emoji: "⚙", title: "Settings", route: "/studio/settings", description: "Studio config" },
  { id: "health", emoji: "♥", title: "Health", route: "/studio/health", description: "Atlas diagnostics" },
];

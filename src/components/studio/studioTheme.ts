export const STUDIO_COLORS = {
  cream: "#F7F1E8",
  warmWhite: "#FFFDF8",
  card: "#F8F0E6",
  brown: "#2B2118",
  secondary: "#7A6652",
  accent: "#B85F1D",
  accentSoft: "#B86B38",
  success: "#4A7C59",
  warning: "#C4841D",
  danger: "#A94442",
};

export type StudioNavItem = {
  id: string;
  emoji: string;
  title: string;
  route: string;
  description: string;
};

export const STUDIO_NAV_ITEMS: StudioNavItem[] = [
  {
    id: "dashboard",
    emoji: "📊",
    title: "Dashboard",
    route: "/studio",
    description: "Redactie-overzicht",
  },
  {
    id: "knowledge",
    emoji: "📚",
    title: "Knowledge",
    route: "/studio/knowledge",
    description: "Knowledge drafts",
  },
  {
    id: "recipes",
    emoji: "🍞",
    title: "Recipes",
    route: "/studio/recipes",
    description: "Recept drafts",
  },
  {
    id: "tips",
    emoji: "💡",
    title: "Tips",
    route: "/studio/tips",
    description: "Tip drafts",
  },
  {
    id: "assets",
    emoji: "🖼",
    title: "Assets",
    route: "/studio/assets",
    description: "Visual briefs",
  },
  {
    id: "ai-studio",
    emoji: "✨",
    title: "AI Studio",
    route: "/studio/ai-studio",
    description: "Bulk generatie",
  },
  {
    id: "quality",
    emoji: "✅",
    title: "Quality",
    route: "/studio/quality",
    description: "Proof & Doughbert",
  },
  {
    id: "publish",
    emoji: "🚀",
    title: "Publish",
    route: "/studio/publish",
    description: "Editor-in-Chief",
  },
];

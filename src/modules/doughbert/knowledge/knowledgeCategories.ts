import type {
  KnowledgeBiteCategory,
  KnowledgeBiteCategoryRegistry,
} from "@/types/knowledgeBite";

export const knowledgeCategories: KnowledgeBiteCategoryRegistry = {
  brood: {
    id: "brood",
    emoji: "🍞",
    title: "Broden",
    description: "Soorten brood, deeg en achtergrond.",
    order: 1,
  },
  pizza: {
    id: "pizza",
    emoji: "🍕",
    title: "Pizza",
    description: "Pizzastijlen, deeg en baktechnieken.",
    order: 2,
  },
  "meel-bloem": {
    id: "meel-bloem",
    emoji: "🌾",
    title: "Meel & Bloem",
    description: "Bloemsoorten, gluten en wateropname.",
    order: 3,
  },
  starter: {
    id: "starter",
    emoji: "🫙",
    title: "Starter",
    description: "Voeden, onderhouden en begrijpen.",
    order: 4,
  },
  hydratatie: {
    id: "hydratatie",
    emoji: "💧",
    title: "Hydratatie",
    description: "Water, deegstructuur en baker's percentage.",
    order: 5,
  },
  fermentatie: {
    id: "fermentatie",
    emoji: "⏱",
    title: "Fermentatie",
    description: "Bulk, narijs, proof en timing.",
    order: 6,
  },
  technieken: {
    id: "technieken",
    emoji: "👐",
    title: "Technieken",
    description: "Vouwen, vormen en bakken.",
    order: 7,
  },
  temperaturen: {
    id: "temperaturen",
    emoji: "🌡",
    title: "Temperaturen",
    description: "Deeg-, water- en oventemperaturen.",
    order: 8,
  },
  bakwetenschap: {
    id: "bakwetenschap",
    emoji: "🔬",
    title: "Bakwetenschap",
    description: "De wetenschap achter het deeg.",
    order: 9,
  },
};

export const knowledgeCategoryList: KnowledgeBiteCategory[] = Object.values(
  knowledgeCategories,
).sort((a, b) => a.order - b.order);

export function getKnowledgeCategory(id: KnowledgeBiteCategory["id"]) {
  return knowledgeCategories[id];
}

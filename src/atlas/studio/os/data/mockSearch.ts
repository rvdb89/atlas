import type { StudioOsSearchResult } from "../types";

const MOCK_ENTITIES = [
  { id: "entity-1", title: "Country Loaf", route: "/studio/entities/country-loaf" },
  { id: "entity-2", title: "Pain de Campagne", route: "/studio/entities/pain-de-campagne" },
  { id: "entity-3", title: "Sourdough Starter Guide", route: "/studio/entities/starter-guide" },
];

const MOCK_RECIPES = [
  { id: "recipe-1", title: "Baguette", route: "/studio/entities" },
  { id: "recipe-2", title: "Focaccia", route: "/studio/entities" },
  { id: "recipe-3", title: "Brioche", route: "/studio/entities" },
];

const MOCK_KNOWLEDGE = [
  { id: "knowledge-1", title: "Flour Guide", route: "/studio/intelligence" },
  { id: "knowledge-2", title: "Hydration Basics", route: "/studio/intelligence" },
];

const MOCK_MODULES = [
  { id: "module-1", title: "Doughbert", route: "/studio/publishing" },
];

const MOCK_WORKFLOWS = [
  { id: "workflow-1", title: "Proof of Power", route: "/studio/proof-of-power" },
  { id: "workflow-2", title: "Publishing Pipeline", route: "/studio/publishing" },
];

const MOCK_PROVIDERS = [
  { id: "provider-1", title: "Claude", route: "/studio/command-center" },
  { id: "provider-2", title: "OpenAI", route: "/studio/command-center" },
  { id: "provider-3", title: "Gemini", route: "/studio/command-center" },
];

const MOCK_ASSETS = [
  { id: "asset-1", title: "Hero Visual Pack", route: "/studio/assets" },
  { id: "asset-2", title: "Recipe Card Template", route: "/studio/assets" },
];

function filterMock(
  items: Array<{ id: string; title: string; route: string }>,
  group: string,
  query: string,
): StudioOsSearchResult[] {
  return items
    .filter((item) => item.title.toLowerCase().includes(query))
    .map((item) => ({
      id: `${group}-${item.id}`,
      title: item.title,
      subtitle: group,
      group,
      route: item.route,
    }));
}

export function searchMockEntities(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_ENTITIES, "Entities", query);
}

export function searchMockRecipes(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_RECIPES, "Recipes", query);
}

export function searchMockKnowledge(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_KNOWLEDGE, "Knowledge", query);
}

export function searchMockModules(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_MODULES, "Modules", query);
}

export function searchMockWorkflows(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_WORKFLOWS, "Workflows", query);
}

export function searchMockProviders(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_PROVIDERS, "Providers", query);
}

export function searchMockAssets(query: string): StudioOsSearchResult[] {
  return filterMock(MOCK_ASSETS, "Assets", query);
}

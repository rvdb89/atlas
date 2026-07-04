export type TipCategoryId =
  | "brood"
  | "pizza"
  | "starter"
  | "temperatuur"
  | "oven-bakken"
  | "plakken-voorkomen"
  | "snelle-reddingen";

export interface TipCategory {
  id: TipCategoryId;
  emoji: string;
  title: string;
  description: string;
  order: number;
}

/**
 * Minimal data object for a practical tip.
 * Add one entry to tips.ts — no new components required.
 */
export interface TipDefinition {
  id: string;
  categoryId: TipCategoryId;
  text: string;
  order: number;
}

export interface Tip {
  id: string;
  categoryId: TipCategoryId;
  text: string;
  order: number;
}

export type TipCategoryRegistry = Record<TipCategoryId, TipCategory>;

export type TipRegistry = Record<string, Tip>;

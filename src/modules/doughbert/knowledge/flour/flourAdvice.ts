import type { KnowledgeBiteAdviceRow } from "@/types/knowledgeBite";

/** Default French flour guidance table for Meel & Bloem Knowledge Bites. */
export const FRENCH_FLOUR_DOUGHBERT_ADVICE: KnowledgeBiteAdviceRow[] = [
  { goal: "Meest luchtig brood", choice: "T65" },
  { goal: "Beste allrounder", choice: "T80" },
  { goal: "Meer smaak", choice: "T110" },
  { goal: "Rustiek karakter", choice: "T130" },
  { goal: "Maximale voedingswaarde", choice: "T150" },
];

/**
 * Returns the default French flour advice table, with optional per-goal overrides.
 *
 * @example
 * frenchFlourDoughbertAdvice({ "Beste allrounder": "T80 + T65" })
 */
export function frenchFlourDoughbertAdvice(
  overrides: Partial<Record<string, string>> = {},
): KnowledgeBiteAdviceRow[] {
  return FRENCH_FLOUR_DOUGHBERT_ADVICE.map((row) => ({
    goal: row.goal,
    choice: overrides[row.goal] ?? row.choice,
  }));
}

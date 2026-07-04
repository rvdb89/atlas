import { bakePlan, getActiveRecipe } from "../recipes/bakePlan";
import { calculateBulkHours } from "./fermentation";

export function generatePlan() {
  const recipe = getActiveRecipe();

  const bulkHours = calculateBulkHours(
    recipe.fermentation.baseBulkHours,
    bakePlan.schedule.roomTemperature,
    recipe.fermentation.factor,
  );

  return {
    recipeName: recipe.name,
    roomTemperature: bakePlan.schedule.roomTemperature,
    loaves: bakePlan.batch.loaves,
    bulkHours,
    waterAdvice:
      bakePlan.schedule.roomTemperature >= 25
        ? "Gebruik koud water."
        : bakePlan.schedule.roomTemperature <= 19
          ? "Gebruik lauwwarm water."
          : "Gebruik water op kamertemperatuur.",
  };
}

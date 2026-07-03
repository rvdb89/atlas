import type { FlourMix, Recipe } from "@/types/recipe";

import { getRecipe, getRecipeBySlug } from "./recipes";

export const bakePlan = {
  recipeSlug: "landbrood",

  recipe: {
    name: "",
    category: "",
    hydration: 0,
    starterPercentage: 0,
    bulkFactor: 1,
    coldProofHours: 0,
    flour: {
      t65: 0,
      wholeWheat: 0,
      rye: 0,
    } satisfies FlourMix,
  },

  schedule: {
    enjoyDate: "",
    enjoyTime: "",
    roomTemperature: 21,
  },

  batch: {
    loaves: 1,
    doughWeightPerLoaf: 500,
  },

  planner: {
    starterFeedTime: "",
    autolyseTime: "",
    mixTime: "",
    stretchFoldTimes: [] as string[],
    bulkEndTime: "",
    shapeTime: "",
    coldProofStart: "",
    bakeTime: "",
  },
};

export function applyRecipeToBakePlan(recipe: Recipe) {
  bakePlan.recipeSlug = recipe.slug;
  bakePlan.recipe.name = recipe.name;
  bakePlan.recipe.category = recipe.category;
  bakePlan.recipe.hydration = recipe.hydration;
  bakePlan.recipe.starterPercentage = recipe.starterPercentage;
  bakePlan.recipe.bulkFactor = recipe.fermentation.factor;
  bakePlan.recipe.coldProofHours = recipe.fermentation.coldProofMin;
  bakePlan.recipe.flour = { ...recipe.flour };
}

export function getActiveRecipe(): Recipe {
  return getRecipeBySlug(bakePlan.recipeSlug) ?? getRecipe("landbrood");
}

import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("country-loaf");

export default function CountryLoafScreen() {
  return <RecipeDetail recipe={recipe} />;
}

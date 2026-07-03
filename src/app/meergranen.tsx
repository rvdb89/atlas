import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("meergranen");

export default function MeergranenScreen() {
  return <RecipeDetail recipe={recipe} />;
}

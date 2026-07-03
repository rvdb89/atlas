import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("volkoren");

export default function VolkorenScreen() {
  return <RecipeDetail recipe={recipe} />;
}

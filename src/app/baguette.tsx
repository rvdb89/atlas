import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("baguette");

export default function BaguetteScreen() {
  return <RecipeDetail recipe={recipe} />;
}

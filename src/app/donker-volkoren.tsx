import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("donker-volkoren");

export default function DonkerVolkorenScreen() {
  return <RecipeDetail recipe={recipe} />;
}

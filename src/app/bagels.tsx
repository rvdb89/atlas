import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("bagels");

export default function BagelsScreen() {
  return <RecipeDetail recipe={recipe} />;
}

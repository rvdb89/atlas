import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("focaccia");

export default function FocacciaScreen() {
  return <RecipeDetail recipe={recipe} />;
}

import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("brioche");

export default function BriocheScreen() {
  return <RecipeDetail recipe={recipe} />;
}

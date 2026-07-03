import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("roman-pizza-teglia");

export default function RomanPizzaTegliaScreen() {
  return <RecipeDetail recipe={recipe} />;
}

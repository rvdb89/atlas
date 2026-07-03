import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("detroit-style-pizza");

export default function DetroitStylePizzaScreen() {
  return <RecipeDetail recipe={recipe} />;
}

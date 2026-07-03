import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("new-york-style-pizza");

export default function NewYorkStylePizzaScreen() {
  return <RecipeDetail recipe={recipe} />;
}

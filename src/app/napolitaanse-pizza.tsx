import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("napolitaanse-pizza");

export default function NapolitaansePizzaScreen() {
  return <RecipeDetail recipe={recipe} />;
}

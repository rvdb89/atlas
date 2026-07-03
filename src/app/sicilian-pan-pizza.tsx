import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("sicilian-pan-pizza");

export default function SicilianPanPizzaScreen() {
  return <RecipeDetail recipe={recipe} />;
}

import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("wit-busbrood");

export default function WitBusbroodScreen() {
  return <RecipeDetail recipe={recipe} />;
}

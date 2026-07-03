import RecipeDetail from "@/components/RecipeDetail";
import { getRecipe } from "@/data/recipes";

const recipe = getRecipe("pain-de-campagne");

export default function PainDeCampagneScreen() {
  return <RecipeDetail recipe={recipe} />;
}

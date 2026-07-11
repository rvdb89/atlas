import ScreenLayout from "@/components/ScreenLayout";
import RecipeCard from "@/components/RecipeCard";
import { getRecipesByCategory } from "@/data/recipes";

const breadRecipes = getRecipesByCategory("Brood");

export default function BreadScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Brood"
      subtitle="Kies het brood dat we samen gaan maken."
    >
      {breadRecipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          index={index}
          isLast={index === breadRecipes.length - 1}
        />
      ))}
    </ScreenLayout>
  );
}

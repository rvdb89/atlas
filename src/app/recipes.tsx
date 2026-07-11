import ScreenLayout from "@/components/ScreenLayout";
import RecipeCard from "@/components/RecipeCard";
import { recipeList } from "@/data/recipes";

export default function RecipesScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Recepten"
      subtitle="Ontdek en bewaar recepten."
    >
      {recipeList.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          index={index}
          isLast={index === recipeList.length - 1}
        />
      ))}
    </ScreenLayout>
  );
}

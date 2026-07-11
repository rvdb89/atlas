import ScreenLayout from "@/components/ScreenLayout";
import RecipeCard from "@/components/RecipeCard";
import { getRecipesByCategory } from "@/data/recipes";

const pizzaRecipes = getRecipesByCategory("Pizza");

export default function PizzaScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Pizza"
      subtitle="Kies de stijl die bij jouw bakavond past."
    >
      {pizzaRecipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          index={index}
          isLast={index === pizzaRecipes.length - 1}
        />
      ))}
    </ScreenLayout>
  );
}

import DraftList from "@/components/studio/DraftList";
import StudioLayout from "@/components/studio/StudioLayout";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";

export default function StudioRecipesScreen() {
  const { drafts } = usePublicationStore();
  const recipeDrafts = drafts.filter((draft) => draft.contentType === "recipe");

  return (
    <StudioLayout
      title="Recipes"
      subtitle="Recept-drafts van ✍️ Baker + visuals van 🎨 Canvas."
    >
      <DraftList
        drafts={recipeDrafts}
        emptyMessage="Nog geen recept-drafts. Genereer via AI Studio."
      />
    </StudioLayout>
  );
}

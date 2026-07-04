import DraftList from "@/components/studio/DraftList";
import StudioLayout from "@/components/studio/StudioLayout";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";

export default function StudioKnowledgeScreen() {
  const { drafts } = usePublicationStore();
  const knowledgeDrafts = drafts.filter(
    (draft) =>
      draft.contentType === "article" ||
      draft.contentType === "ingredient" ||
      draft.contentType === "science" ||
      draft.contentType === "technique" ||
      draft.contentType === "guide",
  );

  return (
    <StudioLayout
      title="Knowledge"
      subtitle="Knowledge drafts van ✍️ Baker — wachten op 🎯 Editor-in-Chief."
    >
      <DraftList
        drafts={knowledgeDrafts}
        emptyMessage="Nog geen Knowledge drafts. Start bulk generatie in AI Studio."
      />
    </StudioLayout>
  );
}

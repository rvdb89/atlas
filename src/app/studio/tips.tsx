import DraftList from "@/components/studio/DraftList";
import StudioLayout from "@/components/studio/StudioLayout";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";

export default function StudioTipsScreen() {
  const { drafts } = usePublicationStore();
  const tipDrafts = drafts.filter((draft) => draft.contentType === "tip");

  return (
    <StudioLayout
      title="Tips"
      subtitle="Tips van ✍️ Baker — kort, praktisch, in Doughbert-stijl."
    >
      <DraftList
        drafts={tipDrafts}
        emptyMessage="Nog geen tip-drafts."
      />
    </StudioLayout>
  );
}

import DraftList from "@/components/studio/DraftList";
import StudioLayout from "@/components/studio/StudioLayout";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";

export default function StudioPublishScreen() {
  const { drafts } = usePublicationStore();
  const approved = drafts.filter((draft) => draft.reviewStatus === "approved");
  const published = drafts.filter((draft) => draft.reviewStatus === "published");

  return (
    <StudioLayout
      title="Publish"
      subtitle="Goedgekeurde drafts publiceren naar de live Doughbert bibliotheek."
    >
      <DraftList
        drafts={approved}
        emptyMessage="Geen goedgekeurde drafts — review eerst in Quality."
      />

      {published.length > 0 ? (
        <>
          <DraftList drafts={published} emptyMessage="" />
        </>
      ) : null}
    </StudioLayout>
  );
}

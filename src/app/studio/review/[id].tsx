import { useLocalSearchParams } from "expo-router";
import { useReducer } from "react";
import { StyleSheet, Text, View } from "react-native";

import { getContentPayload, getValidationReport } from "@/ai/types";
import QualityScoreCard from "@/components/studio/QualityScoreCard";
import BakingScoreCard from "@/components/studio/BakingScoreCard";
import ReviewPanel from "@/components/studio/ReviewPanel";
import StudioLayout from "@/components/studio/StudioLayout";
import { STUDIO_COLORS } from "@/components/studio/studioTheme";
import { publicationStore } from "@/studio/store/publicationStore";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

export default function StudioReviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { drafts } = usePublicationStore();
  const [, refresh] = useReducer((value) => value + 1, 0);

  const draft =
    typeof id === "string"
      ? drafts.find((item) => item.id === id) ?? publicationStore.getDraft(id)
      : undefined;

  if (!draft) {
    return (
      <StudioLayout title="Review" subtitle="Draft niet gevonden." backTo="/studio/quality">
        <Text style={styles.missing}>Deze draft bestaat niet meer in de review queue.</Text>
      </StudioLayout>
    );
  }

  const content = getContentPayload(draft) as KnowledgeArticleInput | undefined;

  return (
    <StudioLayout
      title="Preview & Review"
      subtitle={draft.title}
      backTo="/studio/quality"
    >
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>{draft.title}</Text>
        <Text style={styles.previewSubtitle}>{draft.subtitle}</Text>
        <Text style={styles.previewBody}>
          {content?.content?.summary ?? "Geen samenvatting beschikbaar."}
        </Text>
      </View>

      <QualityScoreCard report={draft.qualityReport} />

      <View style={styles.spacer} />

      <BakingScoreCard report={getValidationReport(draft)} />

      {draft.linkGraph && draft.linkGraph.nodes.length > 0 ? (
        <View style={styles.links}>
          <Text style={styles.linksTitle}>🔗 Atlas · automatische links</Text>
          {draft.linkGraph.nodes.slice(0, 6).map((node) => (
            <Text key={node.slug} style={styles.linkItem}>
              → {node.title}
            </Text>
          ))}
        </View>
      ) : null}

      <ReviewPanel draft={draft} onUpdated={refresh} />
    </StudioLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    marginBottom: 16,
  },

  previewTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  previewSubtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 23,
    color: STUDIO_COLORS.secondary,
  },

  previewBody: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },

  links: {
    marginVertical: 16,
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 20,
    padding: 16,
  },

  linksTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  linkItem: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
  },

  missing: {
    fontSize: 16,
    color: STUDIO_COLORS.secondary,
  },

  spacer: {
    height: 16,
  },
});

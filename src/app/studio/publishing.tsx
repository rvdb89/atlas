import { StyleSheet, Text, View } from "react-native";

import {
  StudioCard,
  StudioEmptyState,
  StudioPipelineBanner,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap } from "@/atlas/studio/hooks";
import { studioDataService } from "@/atlas/studio/services/studioDataService";

const STAGES = ["draft", "review", "published", "archived"] as const;

export default function StudioPublishingScreen() {
  useStudioBootstrap();
  const items = studioDataService.listPublishingItems();

  return (
    <StudioScreen
      title="Publishing"
      subtitle="Move content through draft, review, published, and archived stages."
    >
      <StudioPipelineBanner />

      <View style={styles.flowRow}>
        {STAGES.map((stage, index) => (
          <View key={stage} style={styles.flowItem}>
            <Text style={styles.flowStage}>{stage}</Text>
            {index < STAGES.length - 1 ? <Text style={styles.flowArrow}>→</Text> : null}
          </View>
        ))}
      </View>

      {STAGES.map((stage) => {
        const stageItems = items.filter((item) => item.stage === stage);
        return (
          <View key={stage}>
            <StudioSectionTitle>{`${stage} · ${stageItems.length}`}</StudioSectionTitle>
            {stageItems.length === 0 ? (
              <StudioCard compact>
                <Text style={styles.empty}>No items in {stage}.</Text>
              </StudioCard>
            ) : (
              stageItems.map((item) => (
                <StudioCard key={item.id} compact>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>Updated {new Date(item.updatedAt).toLocaleString()}</Text>
                </StudioCard>
              ))
            )}
          </View>
        );
      })}

      {items.length === 0 ? (
        <StudioEmptyState
          title="No publishing items yet"
          message="Generate drafts in AI Studio or through the publishing pipeline to populate this view."
        />
      ) : null}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  flowRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  flowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  flowStage: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
    textTransform: "uppercase",
  },

  flowArrow: {
    fontSize: 14,
    color: STUDIO_COLORS.secondary,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  meta: {
    marginTop: 4,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  empty: {
    fontSize: 14,
    color: STUDIO_COLORS.secondary,
  },
});

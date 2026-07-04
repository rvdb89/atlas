import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getValidationReport } from "@/ai/types";
import type { PublicationDraft } from "@/atlas/publishing/types";
import BakingScoreCard from "./BakingScoreCard";
import { STUDIO_COLORS } from "./studioTheme";

type DraftListProps = {
  drafts: PublicationDraft[];
  emptyMessage?: string;
};

export default function DraftList({ drafts, emptyMessage }: DraftListProps) {
  if (drafts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {emptyMessage ?? "Nog geen drafts — start in AI Studio."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {drafts.map((draft) => (
        <Pressable
          key={draft.id}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => router.push(`/studio/review/${draft.id}` as Href)}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{draft.title}</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <Text style={styles.subtitle}>{draft.subtitle}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{draft.contentType}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.meta}>{draft.reviewStatus}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.meta}>{draft.visuals.length} assets</Text>
          </View>
          <View style={styles.scoreWrap}>
            <BakingScoreCard report={getValidationReport(draft)} compact />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },

  card: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  pressed: {
    opacity: 0.92,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  arrow: {
    fontSize: 24,
    fontWeight: "900",
    color: STUDIO_COLORS.accentSoft,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },

  meta: {
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  metaDot: {
    color: STUDIO_COLORS.accentSoft,
  },

  scoreWrap: {
    marginTop: 12,
  },

  empty: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    color: STUDIO_COLORS.secondary,
    textAlign: "center",
  },
});

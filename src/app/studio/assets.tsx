import { StyleSheet, Text, View } from "react-native";

import StudioLayout from "@/components/studio/StudioLayout";
import { STUDIO_COLORS } from "@/components/studio/studioTheme";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";

export default function StudioAssetsScreen() {
  const { drafts } = usePublicationStore();
  const assets = drafts.flatMap((draft) =>
    draft.visuals.map((asset) => ({ ...asset, draftTitle: draft.title })),
  );

  return (
    <StudioLayout
      title="Assets"
      subtitle="Visual briefs van 🎨 Canvas — klaar voor AI image generation."
    >
      <View style={styles.list}>
        {assets.length === 0 ? (
          <Text style={styles.empty}>Nog geen visual briefs. Genereer content in AI Studio.</Text>
        ) : (
          assets.map((asset) => (
            <View key={asset.id} style={styles.card}>
              <Text style={styles.role}>
                {asset.role} · {asset.label}
              </Text>
              <Text style={styles.draft}>{asset.draftTitle}</Text>
              <Text style={styles.prompt}>{asset.prompt}</Text>
              <Text style={styles.status}>{asset.status}</Text>
            </View>
          ))
        )}
      </View>
    </StudioLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },

  card: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  role: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  draft: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  prompt: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },

  status: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },

  empty: {
    fontSize: 16,
    lineHeight: 24,
    color: STUDIO_COLORS.secondary,
  },
});

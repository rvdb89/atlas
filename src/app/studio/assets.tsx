import { StyleSheet, Text } from "react-native";

import {
  StudioCard,
  StudioEmptyState,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap } from "@/atlas/studio/hooks";
import { studioDataService } from "@/atlas/studio/services/studioDataService";

export default function StudioAssetsScreen() {
  useStudioBootstrap();
  const assets = studioDataService.listAssets();

  return (
    <StudioScreen title="Assets" subtitle="Hero images, diagrams, galleries, and generated visual placeholders.">
      {assets.length === 0 ? (
        <StudioEmptyState
          title="No assets yet"
          message="Visual briefs appear here after publishing pipeline runs or AI visual tasks complete."
        />
      ) : (
        assets.map((asset) => (
          <StudioCard key={asset.id} compact>
            <Text style={styles.role}>
              {asset.kind} · {asset.role}
            </Text>
            <Text style={styles.title}>{asset.label}</Text>
            <Text style={styles.source}>{asset.sourceTitle}</Text>
            {asset.prompt ? <Text style={styles.prompt}>{asset.prompt}</Text> : null}
            <Text style={styles.status}>{asset.status}</Text>
          </StudioCard>
        ))
      )}

      <StudioSectionTitle>Asset types</StudioSectionTitle>
      <StudioCard>
        <Text style={styles.body}>Hero · Diagram · Gallery · Generated visual · Infographic</Text>
      </StudioCard>
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  role: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  source: {
    marginTop: 4,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
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

  body: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },
});

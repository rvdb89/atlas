import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import {
  StudioCard,
  StudioEmptyState,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap } from "@/atlas/studio/hooks";
import { studioDataService } from "@/atlas/studio/services/studioDataService";

export default function StudioEntityDetailScreen() {
  useStudioBootstrap();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entity = id ? studioDataService.getEntity(String(id)) : undefined;

  if (!entity) {
    return (
      <StudioScreen title="Entity" subtitle="Entity detail" backTo="/studio/entities">
        <StudioEmptyState title="Entity not found" message="This entity may have been removed or not yet seeded." />
      </StudioScreen>
    );
  }

  return (
    <StudioScreen title={entity.title} subtitle={`${entity.entityType} · ${entity.domain}`} backTo="/studio/entities">
      <StudioCard title="Metadata">
        <DetailRow label="Slug" value={entity.slug} />
        <DetailRow label="Category" value={entity.category} />
        <DetailRow label="Status" value={entity.status} />
        <DetailRow label="Visibility" value={entity.visibility} />
        <DetailRow label="Version" value={`v${entity.version}`} />
        <DetailRow label="Updated" value={new Date(entity.updatedAt).toLocaleString()} />
      </StudioCard>

      <StudioSectionTitle>Attributes</StudioSectionTitle>
      <StudioCard>
        {Object.keys(entity.attributes).length === 0 ? (
          <Text style={styles.emptyInline}>No attributes recorded.</Text>
        ) : (
          Object.entries(entity.attributes).map(([key, value]) => (
            <DetailRow key={key} label={key} value={String(value)} />
          ))
        )}
      </StudioCard>

      <StudioSectionTitle>Relations</StudioSectionTitle>
      <StudioCard>
        {entity.relations.length === 0 ? (
          <Text style={styles.emptyInline}>No relations yet.</Text>
        ) : (
          entity.relations.map((relation) => (
            <DetailRow
              key={relation.id}
              label={relation.kind}
              value={relation.targetSlug ?? relation.targetId}
            />
          ))
        )}
      </StudioCard>

      <StudioSectionTitle>Media</StudioSectionTitle>
      <StudioCard>
        {entity.media.length === 0 ? (
          <Text style={styles.emptyInline}>No media attached.</Text>
        ) : (
          entity.media.map((item) => (
            <DetailRow key={item.id} label={item.role ?? item.kind} value={item.alt ?? item.url ?? item.id} />
          ))
        )}
      </StudioCard>

      <StudioSectionTitle>Quality</StudioSectionTitle>
      <StudioCard>
        <DetailRow
          label="Score"
          value={
            typeof entity.metadata.qualityScore === "number"
              ? `${entity.metadata.qualityScore}/100`
              : "Not scored yet"
          }
        />
      </StudioCard>

      <StudioSectionTitle>History</StudioSectionTitle>
      <StudioCard>
        <Text style={styles.placeholder}>Revision history and audit trail will appear here in a future release.</Text>
      </StudioCard>
    </StudioScreen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: STUDIO_COLORS.border,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  value: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
  },

  emptyInline: {
    fontSize: 15,
    color: STUDIO_COLORS.secondary,
  },

  placeholder: {
    fontSize: 14,
    lineHeight: 21,
    color: STUDIO_COLORS.secondary,
  },
});

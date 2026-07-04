import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  StudioCard,
  StudioChip,
  StudioEmptyState,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap, useStudioEntities } from "@/atlas/studio/hooks";

export default function StudioEntitiesScreen() {
  useStudioBootstrap();
  const {
    entities,
    search,
    setSearch,
    entityType,
    setEntityType,
    status,
    setStatus,
    domain,
    setDomain,
    entityTypes,
    domains,
  } = useStudioEntities();

  return (
    <StudioScreen title="Entities" subtitle="Browse and manage the Atlas entity catalog." backTo="/studio">
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search entities…"
        placeholderTextColor={STUDIO_COLORS.secondary}
        style={styles.search}
      />

      <StudioSectionTitle>Filter by type</StudioSectionTitle>
      <View style={styles.chips}>
        <StudioChip label="All" active={!entityType} onPress={() => setEntityType(undefined)} />
        {entityTypes.map((type) => (
          <StudioChip
            key={type}
            label={type}
            active={entityType === type}
            onPress={() => setEntityType(type)}
          />
        ))}
      </View>

      <StudioSectionTitle>Filter by status</StudioSectionTitle>
      <View style={styles.chips}>
        <StudioChip label="All" active={!status} onPress={() => setStatus(undefined)} />
        {["draft", "published", "archived", "deprecated"].map((value) => (
          <StudioChip
            key={value}
            label={value}
            active={status === value}
            onPress={() => setStatus(value)}
          />
        ))}
      </View>

      <StudioSectionTitle>Filter by module</StudioSectionTitle>
      <View style={styles.chips}>
        <StudioChip label="All" active={!domain} onPress={() => setDomain(undefined)} />
        {domains.map((value) => (
          <StudioChip key={value} label={value} active={domain === value} onPress={() => setDomain(value)} />
        ))}
      </View>

      <StudioSectionTitle>{`${entities.length} entities`}</StudioSectionTitle>

      {entities.length === 0 ? (
        <StudioEmptyState
          title="No entities found"
          message="Adjust your filters or seed data from the active module catalog."
        />
      ) : (
        entities.map((entity) => (
          <Pressable
            key={entity.id}
            onPress={() => router.push(`/studio/entities/${entity.id}` as Href)}
          >
            <StudioCard compact>
              <Text style={styles.entityTitle}>{entity.title}</Text>
              <Text style={styles.meta}>
                {entity.entityType} · {entity.domain} · {entity.status}
              </Text>
              <Text style={styles.meta}>{entity.category}</Text>
            </StudioCard>
          </Pressable>
        ))
      )}
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: STUDIO_COLORS.brown,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    marginBottom: 8,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  entityTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  meta: {
    marginTop: 4,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },
});

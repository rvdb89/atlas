import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { KnowledgeBiteCard } from "@/components/knowledge/KnowledgeCards";
import { BakeryColors } from "@/constants/theme";
import { knowledgeBiteList } from "@/data/knowledgeBites";
import { searchKnowledgeBites } from "@/utils/knowledgeSearch";
import type { KnowledgeBite } from "@/types/knowledgeBite";

type KnowledgeExplorerProps = {
  returnTo?: string;
  onOpenBite: (bite: KnowledgeBite) => void;
};

export default function KnowledgeExplorer({
  returnTo: _returnTo,
  onOpenBite,
}: KnowledgeExplorerProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchKnowledgeBites(query, knowledgeBiteList),
    [query],
  );

  const showResults = query.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Knowledge Explorer</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Zoek titel, categorie, tags..."
        placeholderTextColor="#A8947E"
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {showResults ? (
        <View style={styles.results}>
          <Text style={styles.meta}>
            {results.length} {results.length === 1 ? "resultaat" : "resultaten"}
          </Text>

          <View style={styles.list}>
            {results.map((bite) => (
              <KnowledgeBiteCard key={bite.id} bite={bite} onPress={() => onOpenBite(bite)} />
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.hint}>
          Typ om te zoeken in titels, categorieën, tags en samenvattingen.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: BakeryColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  input: {
    backgroundColor: BakeryColors.warmWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.12)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: BakeryColors.brown,
  },

  hint: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: BakeryColors.textSecondary,
  },

  results: {
    marginTop: 16,
    gap: 14,
  },

  meta: {
    fontSize: 13,
    fontWeight: "700",
    color: BakeryColors.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  list: {
    gap: 14,
  },
});

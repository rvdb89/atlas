import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { KnowledgeBiteCategoryId } from "@/types/knowledgeBite";
import {
  CATEGORY_GENERATION_PRESETS,
  studioService,
} from "@/studio/services/studioService";
import { getPipelineFlowLabel } from "@/studio/aiTeam";
import { STUDIO_COLORS } from "./studioTheme";

type BulkGeneratePanelProps = {
  onGenerated?: () => void;
};

export default function BulkGeneratePanel({ onGenerated }: BulkGeneratePanelProps) {
  const [categoryId, setCategoryId] =
    useState<KnowledgeBiteCategoryId>("brood");
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const preset = CATEGORY_GENERATION_PRESETS[categoryId];

  async function handleGenerate() {
    const parsedCount = Math.min(20, Math.max(1, Number.parseInt(count, 10) || 5));
    const topics = preset.topics.slice(0, parsedCount);

    setLoading(true);
    setMessage("");

    try {
      const drafts = await studioService.generateCategory({
        label: preset.label,
        contentType: preset.contentType,
        categoryId,
        topics,
      });

      setMessage(`${drafts.length} drafts gegenereerd — review in Quality.`);
      onGenerated?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Generatie mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.label}>Categorie</Text>
      <View style={styles.chips}>
        {(Object.keys(CATEGORY_GENERATION_PRESETS) as KnowledgeBiteCategoryId[]).map(
          (id) => (
            <Pressable
              key={id}
              style={[styles.chip, categoryId === id && styles.chipActive]}
              onPress={() => setCategoryId(id)}
            >
              <Text style={[styles.chipText, categoryId === id && styles.chipTextActive]}>
                {CATEGORY_GENERATION_PRESETS[id].label}
              </Text>
            </Pressable>
          ),
        )}
      </View>

      <Text style={styles.label}>Aantal (max 20)</Text>
      <TextInput
        value={count}
        onChangeText={setCount}
        keyboardType="number-pad"
        style={styles.input}
        placeholder="5"
        placeholderTextColor="#A8947E"
      />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFDF8" />
        ) : (
          <Text style={styles.buttonText}>Generate {count} artikelen</Text>
        )}
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Text style={styles.hint}>{getPipelineFlowLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    gap: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.card,
  },

  chipActive: {
    backgroundColor: STUDIO_COLORS.accent,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },

  chipTextActive: {
    color: STUDIO_COLORS.warmWhite,
  },

  input: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: STUDIO_COLORS.brown,
  },

  button: {
    marginTop: 4,
    backgroundColor: STUDIO_COLORS.accent,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.9,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: STUDIO_COLORS.warmWhite,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.success,
  },

  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },
});

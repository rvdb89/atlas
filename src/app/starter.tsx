import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import StarterAvatar from "@/components/starter/StarterAvatar";
import { BakeryColors, BakeryFonts, Spacing } from "@/constants/theme";
import {
  loadStarterProfile,
  saveStarterProfile,
} from "@/modules/doughbert/starter/starterStorage";
import {
  addFeeding,
  formatRelativeDutch,
  getFreshness,
  latestFeeding,
} from "@/modules/doughbert/starter/starterUtils";
import type { StarterProfile } from "@/types/starter";

const HISTORY_LIMIT = 10;

export default function StarterScreen() {
  // `undefined` = nog aan het laden, `null` = geladen maar (nog) geen starter.
  const [profile, setProfile] = useState<StarterProfile | null | undefined>(
    undefined,
  );
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    setProfile(loadStarterProfile());
  }, []);

  const freshness = useMemo(
    () => (profile ? getFreshness(profile) : null),
    [profile],
  );

  function handleCreate() {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;

    const created: StarterProfile = {
      name: trimmed,
      createdAt: new Date().toISOString(),
      feedings: [],
    };

    setProfile(created);
    saveStarterProfile(created);
  }

  function handleFeed() {
    if (!profile) return;

    const updated = addFeeding(profile);
    setProfile(updated);
    saveStarterProfile(updated);
  }

  return (
    <ScreenLayout title="Mijn Starter" onBack={() => router.back()}>
      {profile === undefined ? (
        <Text style={styles.helperText}>Even laden…</Text>
      ) : profile === null ? (
        <View style={styles.onboarding}>
          <Text style={styles.helperText}>
            Je hebt nog geen starter toegevoegd. Geef je starter een naam om
            hem te gaan bijhouden.
          </Text>

          <TextInput
            value={nameDraft}
            onChangeText={setNameDraft}
            placeholder="Bijv. Herman"
            placeholderTextColor={BakeryColors.navInactive}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleCreate}
          />

          <Pressable
            style={[
              styles.primaryButton,
              !nameDraft.trim() && styles.primaryButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={!nameDraft.trim()}
          >
            <Text style={styles.primaryButtonText}>Maak mijn starter aan</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <StarterAvatar name={profile.name} freshness={freshness!} />

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Laatst gevoed</Text>
            <Text style={styles.cardValue}>
              {latestFeeding(profile)
                ? formatRelativeDutch(latestFeeding(profile)!.fedAt)
                : "Nog niet gevoed"}
            </Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleFeed}>
            <Text style={styles.primaryButtonText}>Nu gevoed ✓</Text>
          </Pressable>

          {profile.feedings.length > 0 ? (
            <View style={styles.history}>
              <Text style={styles.historyTitle}>Voedingsgeschiedenis</Text>
              {profile.feedings.slice(0, HISTORY_LIMIT).map((feeding) => (
                <View key={feeding.id} style={styles.historyRow}>
                  <Text style={styles.historyDot}>•</Text>
                  <Text style={styles.historyText}>
                    {formatRelativeDutch(feeding.fedAt)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  helperText: {
    marginTop: 10,
    fontFamily: BakeryFonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: BakeryColors.textSecondary,
  },

  onboarding: {
    marginTop: 10,
  },

  input: {
    marginTop: Spacing.four,
    borderWidth: 1,
    borderColor: BakeryColors.navInactive,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 17,
    color: BakeryColors.brown,
    backgroundColor: BakeryColors.warmWhite,
  },

  primaryButton: {
    marginTop: Spacing.four,
    backgroundColor: BakeryColors.orange,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  primaryButtonDisabled: {
    opacity: 0.4,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: BakeryColors.warmWhite,
  },

  card: {
    marginTop: Spacing.four,
    backgroundColor: BakeryColors.card,
    borderRadius: 18,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },

  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: BakeryColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  cardValue: {
    marginTop: 4,
    fontFamily: BakeryFonts.display,
    fontSize: 20,
    fontWeight: "700",
    color: BakeryColors.brown,
  },

  history: {
    marginTop: Spacing.five,
    marginBottom: Spacing.three,
  },

  historyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BakeryColors.brown,
    marginBottom: Spacing.two,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  historyDot: {
    color: BakeryColors.orangeAccent,
    fontSize: 16,
    marginRight: 10,
  },

  historyText: {
    fontSize: 15,
    color: BakeryColors.textSecondary,
  },
});

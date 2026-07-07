import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStudioBootstrap } from "../hooks/useStudioBootstrap";
import {
  AgentsSection,
  ApprovalsSection,
  BranchDirectorAdviceSection,
  BugsBlockersSection,
  BusinessesSection,
  ExecutiveOverviewSection,
  PlatformHealthSection,
} from "./ControlModules";
import { loadControlSnapshot } from "./controlDataService";
import { CONTROL_COLORS } from "./theme";
import type { ControlSnapshot } from "./types";

export default function ControlScreen() {
  useStudioBootstrap();
  const insets = useSafeAreaInsets();
  const [snapshot, setSnapshot] = useState<ControlSnapshot | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadControlSnapshot()
      .then((result) => setSnapshot(result.snapshot))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Robbert AI · Command Center</Text>
          <Text style={styles.title}>Atlas Control</Text>
          <Text style={styles.subtitle}>
            Your daily operating dashboard — company health, agents, approvals, blockers, and Branch Director advice in one place.
          </Text>
        </View>

        {loading || !snapshot ? (
          <View style={styles.loading}>
            <ActivityIndicator color={CONTROL_COLORS.accent} />
            <Text style={styles.loadingText}>Loading Atlas Control…</Text>
          </View>
        ) : (
          <>
            <ExecutiveOverviewSection snapshot={snapshot} />
            <BranchDirectorAdviceSection snapshot={snapshot} />

            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <AgentsSection snapshot={snapshot} />
                <PlatformHealthSection snapshot={snapshot} />
              </View>
              <View style={styles.column}>
                <BusinessesSection snapshot={snapshot} />
                <BugsBlockersSection snapshot={snapshot} />
              </View>
            </View>

            <ApprovalsSection snapshot={snapshot} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CONTROL_COLORS.bg,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center",
  },

  hero: {
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  title: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: CONTROL_COLORS.textMuted,
    maxWidth: 760,
  },

  loading: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: CONTROL_COLORS.textMuted,
  },

  twoColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },

  column: {
    flex: 1,
    minWidth: 320,
  },
});

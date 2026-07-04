import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PageNav from "@/components/PageNav";
import { STUDIO_COLORS } from "./studioTheme";

type StudioLayoutProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  children: ReactNode;
};

export default function StudioLayout({
  title,
  subtitle,
  backTo = "/studio",
  children,
}: StudioLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 20) + 12,
          paddingBottom: Math.max(insets.bottom, 20) + 40,
          paddingHorizontal: 24,
        }}
      >
        <PageNav backTo={backTo} />

        <View style={styles.badgeRow}>
          <Text style={styles.badge}>Digitale redactie</Text>
          <Pressable onPress={() => router.replace("/")}>
            <Text style={styles.homeLink}>🏠 Home</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: STUDIO_COLORS.cream,
  },

  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  badge: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    backgroundColor: STUDIO_COLORS.warmWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },

  homeLink: {
    fontSize: 16,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
    color: STUDIO_COLORS.secondary,
  },
});

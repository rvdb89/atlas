import { router, type Href } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PageNav from "@/components/PageNav";
import { STUDIO_COLORS, STUDIO_SPACING } from "../core/theme";
import { ATLAS_STUDIO_NAV } from "../navigation/routes";
import StudioNavRail from "./StudioNavRail";

type StudioScreenProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  showNav?: boolean;
  children: ReactNode;
};

export default function StudioScreen({
  title,
  subtitle,
  backTo = "/profile",
  showNav = true,
  children,
}: StudioScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 20) + 12,
          paddingBottom: Math.max(insets.bottom, 20) + 48,
          paddingHorizontal: STUDIO_SPACING.screen,
        }}
      >
        <PageNav backTo={backTo} />

        <View style={styles.badgeRow}>
          <Text style={styles.badge}>Atlas Studio</Text>
          <Pressable onPress={() => router.replace("/")}>
            <Text style={styles.homeLink}>Home</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {showNav ? <StudioNavRail items={ATLAS_STUDIO_NAV} /> : null}

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
    letterSpacing: 0.8,
    backgroundColor: STUDIO_COLORS.warmWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },

  homeLink: {
    fontSize: 15,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 24,
    color: STUDIO_COLORS.secondary,
  },
});

import { usePathname, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ATLAS_STUDIO_NAV, ATLAS_STUDIO_SECONDARY_NAV } from "../../navigation/routes";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../../core/theme";
import { useStudioOs } from "../StudioOsContext";
import type { StudioRouteItem } from "../../navigation/routes";

function renderNavItem(item: StudioRouteItem, pathname: string, muted = false) {
  const active =
    pathname === item.route ||
    (item.route !== "/studio" && pathname.startsWith(`${item.route}/`));

  return (
    <Pressable
      key={item.id}
      style={[styles.navItem, active ? styles.navItemActive : null, muted ? styles.navItemSecondary : null]}
      onPress={() => router.push(item.route as never)}
    >
      <Text style={styles.navEmoji}>{item.emoji}</Text>
      <View style={styles.navCopy}>
        <Text style={[styles.navTitle, active ? styles.navTitleActive : null, muted ? styles.navTitleSecondary : null]}>
          {item.title}
        </Text>
        <Text style={[styles.navDescription, muted ? styles.navDescriptionSecondary : null]}>{item.description}</Text>
      </View>
    </Pressable>
  );
}

export default function StudioSidebar() {
  const pathname = usePathname();
  const { openPalette } = useStudioOs();

  return (
    <View style={styles.sidebar}>
      <Text style={styles.brand}>Atlas OS</Text>
      <Text style={styles.tagline}>Atlas Control</Text>

      <Pressable style={styles.paletteButton} onPress={openPalette}>
        <Text style={styles.paletteLabel}>⌘K Command Palette</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {ATLAS_STUDIO_NAV.map((item) => renderNavItem(item, pathname))}

        <Text style={styles.sectionLabel}>Secondary</Text>
        {ATLAS_STUDIO_SECONDARY_NAV.map((item) => renderNavItem(item, pathname, true))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 248,
    borderRightWidth: 1,
    borderRightColor: STUDIO_COLORS.border,
    backgroundColor: STUDIO_COLORS.warmWhite,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },

  brand: {
    fontSize: 22,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  tagline: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 12,
    color: STUDIO_COLORS.secondary,
  },

  paletteButton: {
    marginBottom: 16,
    borderRadius: STUDIO_RADIUS.input,
    backgroundColor: STUDIO_COLORS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  paletteLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  navItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 4,
  },

  navItemActive: {
    backgroundColor: STUDIO_COLORS.card,
  },

  navEmoji: {
    fontSize: 16,
    width: 20,
  },

  navCopy: {
    flex: 1,
  },

  navTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  navTitleActive: {
    color: STUDIO_COLORS.accent,
  },

  navDescription: {
    marginTop: 2,
    fontSize: 11,
    color: STUDIO_COLORS.secondary,
  },

  sectionLabel: {
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: STUDIO_COLORS.secondary,
  },

  navItemSecondary: {
    opacity: 0.88,
  },

  navTitleSecondary: {
    fontWeight: "600",
  },

  navDescriptionSecondary: {
    fontSize: 10,
  },
});

import { router, usePathname, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { STUDIO_COLORS } from "../core/theme";
import type { StudioRouteItem } from "../navigation/routes";

type StudioNavRailProps = {
  items: StudioRouteItem[];
};

export default function StudioNavRail({ items }: StudioNavRailProps) {
  const pathname = usePathname();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => {
        const active = pathname === item.route || (item.route !== "/studio" && pathname.startsWith(item.route));

        return (
          <Pressable
            key={item.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => router.push(item.route as Href)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {item.emoji} {item.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingBottom: 20,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  chipActive: {
    backgroundColor: STUDIO_COLORS.brown,
    borderColor: STUDIO_COLORS.brown,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },

  chipTextActive: {
    color: STUDIO_COLORS.warmWhite,
  },
});

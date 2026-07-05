import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PageNav from "@/components/PageNav";
import { useStudioBootstrap } from "../../hooks/useStudioBootstrap";
import { STUDIO_COLORS, STUDIO_SPACING } from "../../core/theme";
import { SectionHeader } from "../design-system";
import ActivityFeed from "../activity/ActivityFeed";
import { listMissionControlWidgets } from "../registries/widgetRegistry";

export default function MissionControlScreen() {
  useStudioBootstrap();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const widgets = listMissionControlWidgets();
  const columns = width >= 1100 ? 2 : 1;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 24) + 72,
        paddingHorizontal: STUDIO_SPACING.screen,
      }}
    >
      <PageNav backTo="/profile" />

      <SectionHeader
        title="Mission Control"
        subtitle="Atlas OS cockpit — health, workflows, publishing, providers, and activity in one place."
        action="⌘K"
      />

      <View style={[styles.grid, { flexDirection: columns === 2 ? "row" : "column", flexWrap: "wrap" }]}>
        {widgets.map((widget) => {
          const Component = widget.component;
          return (
            <View
              key={widget.id}
              style={[styles.widgetSlot, widget.span === "full" ? styles.full : styles.half]}
            >
              <Component />
            </View>
          );
        })}
      </View>

      <SectionHeader title="Activity Feed" subtitle="Recent Atlas events" />
      <ActivityFeed />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: STUDIO_COLORS.cream,
  },

  grid: {
    gap: 0,
  },

  widgetSlot: {
    paddingHorizontal: 0,
  },

  half: {
    width: "50%",
    minWidth: 280,
  },

  full: {
    width: "100%",
  },
});

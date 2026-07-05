import { usePathname } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { STUDIO_COLORS } from "../../core/theme";
import { resolveInspectorPanels } from "../registries/inspectorRegistry";

export default function StudioInspectorRail() {
  const pathname = usePathname();
  const panels = resolveInspectorPanels(pathname);

  if (panels.length === 0) {
    return (
      <View style={styles.sidebar}>
        <View style={styles.placeholder} />
      </View>
    );
  }

  return (
    <View style={styles.sidebar}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {panels.map((panel) => (
          <View key={panel.id}>{panel.render()}</View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    borderLeftWidth: 1,
    borderLeftColor: STUDIO_COLORS.border,
    backgroundColor: STUDIO_COLORS.cream,
    paddingHorizontal: 14,
    paddingTop: 20,
  },

  content: {
    paddingBottom: 24,
  },

  placeholder: {
    flex: 1,
  },
});

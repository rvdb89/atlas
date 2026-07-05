import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { collectAtlasDiagnostics } from "@/atlas/diagnostics";
import { getAtlasVersionLabel } from "@/atlas/version";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";

export default function DeveloperOverlay() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const diagnostics = useMemo(() => collectAtlasDiagnostics(), [open]);

  if (!__DEV__) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {open ? (
        <View style={[styles.panel, { top: Math.max(insets.top, 12) + 8 }]}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Developer Overlay</Text>
            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <Text style={styles.row}>{getAtlasVersionLabel()}</Text>
            <Text style={styles.row}>Environment · development</Text>
            <Text style={styles.section}>Loaded modules</Text>
            {diagnostics.modules.map((module) => (
              <Text key={module.id} style={styles.item}>
                • {module.name} ({module.id})
              </Text>
            ))}

            <Text style={styles.section}>Loaded providers</Text>
            {diagnostics.providers.map((provider) => (
              <Text key={provider.id} style={styles.item}>
                • {provider.label}
              </Text>
            ))}

            <Text style={styles.section}>Loaded workflows</Text>
            {diagnostics.workflows.map((workflow) => (
              <Text key={workflow.id} style={styles.item}>
                • {workflow.label}
              </Text>
            ))}

            <Text style={styles.section}>Startup issues</Text>
            <Text style={styles.item}>
              • {diagnostics.startupIssues.length} detected
            </Text>
          </ScrollView>
        </View>
      ) : null}

      <Pressable
        style={[styles.fab, { bottom: Math.max(insets.bottom, 16) + 72 }]}
        onPress={() => setOpen((value) => !value)}
      >
        <Text style={styles.fabLabel}>DX</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
  },

  fab: {
    position: "absolute",
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.brown,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  fabLabel: {
    color: STUDIO_COLORS.warmWhite,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  panel: {
    position: "absolute",
    left: 16,
    right: 16,
    maxHeight: 360,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 16,
  },

  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  panelTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  close: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.accent,
  },

  scroll: {
    maxHeight: 280,
  },

  row: {
    fontSize: 13,
    color: STUDIO_COLORS.brown,
    marginBottom: 6,
  },

  section: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  item: {
    fontSize: 12,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },
});

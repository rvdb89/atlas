import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";

import { getAtlasVersionLabel } from "@/atlas/version";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import AtlasNotificationHost from "./AtlasNotificationHost";
import { useAtlasDevBridge } from "./useAtlasDevBridge";

// Phase 5.8 ("Rebuild Space Around Atlas") — this global FAB (visible only in `__DEV__` builds
// already) is real, useful engineering infrastructure for the whole app: FPS/memory/route
// diagnostics and a restart trigger, unrelated to Atlas Space's own presentation. It predates
// Atlas Space and correctly stays exactly as it is everywhere else. But it renders on every
// route, including Atlas Space, where its permanently-visible brown circle is exactly the kind
// of independent visual actor this sprint removes — the same reasoning `StudioOsShell.tsx`
// already applies to exempt `/studio/control` from its own sidebar/inspector chrome. This is
// that same exemption, not a deletion: the tool is untouched, still real, still reachable from
// every other screen; it is only route-scoped away from the one screen where Atlas must be the
// only permanent visible thing, in every build, not only production ones.
const ATLAS_SPACE_ROUTES = new Set(["/atlas", "/room"]);

export default function DeveloperOverlay() {
  const insets = useSafeAreaInsets();
  const bridge = useAtlasDevBridge();
  const pathname = usePathname();

  if (!__DEV__ || ATLAS_SPACE_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <AtlasNotificationHost notifications={bridge.notifications} />

      {bridge.overlayOpen ? (
        <View style={[styles.panel, { top: Math.max(insets.top, 12) + 8 }]}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Atlas Developer Overlay</Text>
            <Pressable onPress={() => bridge.setOverlayOpen(false)}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <Text style={styles.row}>{getAtlasVersionLabel()}</Text>
            <Text style={styles.row}>FPS · {bridge.fps}</Text>
            <Text style={styles.row}>
              Memory · {bridge.memoryMb !== null ? `${bridge.memoryMb} MB` : "n/a"}
            </Text>
            <Text style={styles.row}>Route · {bridge.routeLabel}</Text>
            <Text style={styles.row}>Loaded entities · {bridge.entityCount}</Text>
            <Text style={styles.row}>Workflow · {bridge.workflowLabel}</Text>
            <Text style={styles.row}>Provider · {bridge.providerLabel}</Text>
            <Text style={styles.row}>
              Claude · {bridge.claudeStatus === "live" ? "live" : "mock"}
            </Text>
            <Text style={styles.hint}>Ctrl+Shift+D toggle · Ctrl+Shift+R restart</Text>

            <Pressable style={styles.restartButton} onPress={() => void bridge.restartAtlas()}>
              <Text style={styles.restartLabel}>Restart Atlas</Text>
            </Pressable>
          </ScrollView>
        </View>
      ) : null}

      <Pressable
        style={[styles.fab, { bottom: Math.max(insets.bottom, 16) + 72 }]}
        onPress={() => bridge.setOverlayOpen(!bridge.overlayOpen)}
      >
        <Text style={styles.fabLabel}>Atlas</Text>
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
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.brown,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  fabLabel: {
    color: STUDIO_COLORS.warmWhite,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  panel: {
    position: "absolute",
    left: 16,
    right: 16,
    maxHeight: 420,
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
    maxHeight: 340,
  },

  row: {
    fontSize: 13,
    color: STUDIO_COLORS.brown,
    marginBottom: 6,
  },

  hint: {
    marginTop: 12,
    fontSize: 11,
    color: STUDIO_COLORS.secondary,
  },

  restartButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: STUDIO_COLORS.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  restartLabel: {
    color: STUDIO_COLORS.warmWhite,
    fontSize: 12,
    fontWeight: "800",
  },
});

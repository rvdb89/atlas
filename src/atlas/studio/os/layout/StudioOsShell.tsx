import type { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { usePathname } from "expo-router";

import { STUDIO_COLORS } from "../../core/theme";
import CommandPalette from "../command-palette/CommandPalette";
import AtlasStatusBar from "./AtlasStatusBar";
import StudioInspectorRail from "./StudioInspectorRail";
import StudioSidebar from "./StudioSidebar";
import QuickActionFab from "../quick-actions/QuickActionFab";

type StudioOsShellProps = {
  children: ReactNode;
};

export default function StudioOsShell({ children }: StudioOsShellProps) {
  const pathname = usePathname();
  const isAtlasControl = pathname === "/studio/control";
  const { width } = useWindowDimensions();
  const showSidebar = width >= 960;
  const showInspector = width >= 1280;

  if (isAtlasControl) {
    return <View style={styles.controlRoot}>{children}</View>;
  }

  return (
    <View style={styles.root}>
      <View style={styles.mainRow}>
        {showSidebar ? <StudioSidebar /> : null}
        <View style={styles.content}>{children}</View>
        {showInspector ? <StudioInspectorRail /> : null}
      </View>
      <AtlasStatusBar />
      <CommandPalette />
      <QuickActionFab />
    </View>
  );
}

const styles = StyleSheet.create({
  controlRoot: {
    flex: 1,
    backgroundColor: "#030508",
  },

  root: {
    flex: 1,
    backgroundColor: STUDIO_COLORS.cream,
  },

  mainRow: {
    flex: 1,
    flexDirection: "row",
  },

  content: {
    flex: 1,
  },
});

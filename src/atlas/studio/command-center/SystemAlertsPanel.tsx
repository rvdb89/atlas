import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../core/theme";
import CommandCenterCard from "./CommandCenterCard";
import type { CommandCenterAlert } from "./types";

type SystemAlertsPanelProps = {
  alerts: CommandCenterAlert[];
};

const LEVEL_COLOR: Record<CommandCenterAlert["level"], string> = {
  info: STUDIO_COLORS.accentSoft,
  warning: STUDIO_COLORS.warning,
  critical: STUDIO_COLORS.danger,
};

export default function SystemAlertsPanel({ alerts }: SystemAlertsPanelProps) {
  return (
    <CommandCenterCard title="System Alerts" subtitle="Platform notices and readiness signals">
      {alerts.map((alert) => (
        <View key={alert.id} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: LEVEL_COLOR[alert.level] }]} />
          <Text style={styles.message}>{alert.message}</Text>
        </View>
      ))}
    </CommandCenterCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 6,
  },

  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.brown,
  },
});

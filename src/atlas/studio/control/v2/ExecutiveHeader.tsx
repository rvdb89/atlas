import { StyleSheet, Text, View } from "react-native";

import ControlButton from "../ControlButton";
import type { ControlSnapshot } from "../types";
import { V2 } from "./v2Theme";

type ExecutiveHeaderProps = {
  snapshot: ControlSnapshot;
  onPrimary: () => void;
};

export default function ExecutiveHeader({ snapshot, onPrimary }: ExecutiveHeaderProps) {
  const cmd = snapshot.ceoCommand;
  const state = snapshot.companyState;
  const statusColor =
    state.overallStatus === "healthy"
      ? V2.success
      : state.overallStatus === "blocked"
        ? V2.danger
        : V2.warning;

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Atlas Control V2 · CEO Cockpit</Text>
          <Text style={styles.greeting}>{cmd.greeting}</Text>
          <Text style={styles.company}>{snapshot.companyName}</Text>
        </View>
        <View style={styles.healthBlock}>
          <Text style={styles.healthLabel}>Company Health</Text>
          <Text style={styles.healthValue}>{state.companyHealth}%</Text>
          <Text style={[styles.status, { color: statusColor }]}>{state.overallStatusLabel}</Text>
        </View>
      </View>

      <View style={styles.recommendationBox}>
        <Text style={styles.recLabel}>Atlas recommendation</Text>
        <Text style={styles.recText}>{cmd.recommendation}</Text>
        <Text style={styles.recReason}>{cmd.reason}</Text>
      </View>

      {cmd.confirmationMessage ? (
        <View style={styles.confirm}>
          <Text style={styles.confirmText}>{cmd.confirmationMessage}</Text>
        </View>
      ) : null}

      <View style={styles.action}>
        <ControlButton label={cmd.primaryActionLabel} onPress={onPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 16,
    padding: 22,
    borderRadius: V2.radius,
    backgroundColor: V2.panel,
    borderWidth: 1,
    borderColor: `${V2.gold}33`,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },

  copy: { flex: 1, minWidth: 240 },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.gold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  greeting: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: "900",
    color: V2.text,
  },

  company: {
    marginTop: 4,
    fontSize: 13,
    color: V2.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  healthBlock: {
    alignItems: "flex-end",
  },

  healthLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.textSoft,
    textTransform: "uppercase",
  },

  healthValue: {
    marginTop: 4,
    fontSize: 36,
    fontWeight: "900",
    color: V2.accent,
  },

  status: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
  },

  recommendationBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.panelBorder,
  },

  recLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.textSoft,
    textTransform: "uppercase",
  },

  recText: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: "800",
    color: V2.text,
    lineHeight: 24,
  },

  recReason: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: V2.textMuted,
  },

  confirm: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: `${V2.success}18`,
  },

  confirmText: {
    fontSize: 13,
    fontWeight: "800",
    color: V2.success,
  },

  action: {
    marginTop: 14,
  },
});

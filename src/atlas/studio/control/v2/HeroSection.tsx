import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import V2Button from "./V2Button";
import { healthTone, timeGreeting, V2 } from "./v2Theme";

type HeroSectionProps = {
  snapshot: ControlSnapshot;
  onPrimary: () => void;
  onSecondary: () => void;
};

export default function HeroSection({ snapshot, onPrimary, onSecondary }: HeroSectionProps) {
  const cmd = snapshot.ceoCommand;
  const state = snapshot.companyState;
  const greeting = timeGreeting();
  const tone = healthTone(state.companyHealth);

  return (
    <View style={styles.shell}>
      <View style={styles.glowTop} />
      <View style={styles.glowSide} />

      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Robbert AI · CEO Cockpit</Text>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subline}>{cmd.todayAdvice}</Text>
        </View>

        <GlassCard noPadding style={styles.healthCard}>
          <View style={styles.healthInner}>
            <Text style={styles.healthLabel}>Company Health</Text>
            <Text style={styles.healthValue}>{state.companyHealth}</Text>
            <StatusPill label={state.overallStatusLabel} tone={tone} />
          </View>
        </GlassCard>
      </View>

      <View style={styles.recBlock}>
        <Text style={styles.recEyebrow}>Atlas main recommendation</Text>
        <Text style={styles.recTitle}>{cmd.recommendation}</Text>
        <Text style={styles.recReason}>{cmd.reason}</Text>
      </View>

      {cmd.confirmationMessage ? (
        <View style={styles.confirm}>
          <Text style={styles.confirmText}>{cmd.confirmationMessage}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <V2Button label={cmd.primaryActionLabel} onPress={onPrimary} />
        <V2Button label={cmd.secondaryActionLabel} onPress={onSecondary} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 16,
    padding: 24,
    borderRadius: V2.radiusLg,
    backgroundColor: V2.bgGlass,
    borderWidth: 1,
    borderColor: V2.borderGlow,
    overflow: "hidden",
    position: "relative",
  },

  glowTop: {
    position: "absolute",
    top: -80,
    left: "20%",
    width: 280,
    height: 160,
    borderRadius: 999,
    backgroundColor: V2.accentGlow,
    opacity: 0.25,
  },

  glowSide: {
    position: "absolute",
    bottom: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: V2.purpleSoft,
    opacity: 0.35,
  },

  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  copy: {
    flex: 1,
    minWidth: 260,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.accent,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  greeting: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "900",
    color: V2.text,
    letterSpacing: -0.5,
  },

  subline: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: V2.textMuted,
    maxWidth: 520,
  },

  healthCard: {
    minWidth: 160,
    borderColor: V2.borderGlow,
  },

  healthInner: {
    padding: 18,
    alignItems: "center",
    gap: 6,
  },

  healthLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  healthValue: {
    fontSize: 42,
    fontWeight: "900",
    color: V2.accent,
    lineHeight: 46,
  },

  recBlock: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: V2.border,
  },

  recEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  recTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "800",
    color: V2.text,
    lineHeight: 28,
  },

  recReason: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: V2.textMuted,
  },

  confirm: {
    marginTop: 14,
    padding: 12,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.successSoft,
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.25)",
  },

  confirmText: {
    fontSize: 13,
    fontWeight: "700",
    color: V2.success,
  },

  actions: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

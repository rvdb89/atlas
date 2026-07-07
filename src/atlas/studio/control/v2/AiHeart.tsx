import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { V2 } from "./v2Theme";

type AiHeartProps = {
  companyHealth: number;
};

export default function AiHeart({ companyHealth }: AiHeartProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.3)).current;
  const orbit = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2200, useNativeDriver: true }),
      ]),
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 0.85, duration: 2600, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0.3, duration: 2600, useNativeDriver: false }),
      ]),
    );
    const orbitLoop = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ]),
    );

    pulseLoop.start();
    glowLoop.start();
    orbitLoop.start();
    driftLoop.start();

    return () => {
      pulseLoop.stop();
      glowLoop.stop();
      orbitLoop.stop();
      driftLoop.stop();
    };
  }, [drift, glow, orbit, pulse]);

  const spin = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const floatY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const ringColor =
    companyHealth >= 80 ? V2.success : companyHealth >= 60 ? V2.warning : V2.danger;

  return (
    <View style={styles.shell}>
      <View style={styles.gridBg} />
      <Animated.View style={{ transform: [{ translateY: floatY }] }}>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glow,
              transform: [{ scale: pulse }],
            },
          ]}
        />

        <Animated.View style={[styles.orbitRing, { transform: [{ rotate: spin }] }]}>
          <View style={styles.orbitDot} />
          <View style={[styles.orbitDot, styles.orbitDotSecondary]} />
        </Animated.View>

        <Animated.View
          style={[styles.statusRing, { borderColor: ringColor, transform: [{ scale: pulse }] }]}
        >
          <View style={styles.core}>
            <View style={styles.coreOrb} />
            <Text style={styles.coreLabel}>Atlas</Text>
            <Text style={styles.coreHealth}>{companyHealth}%</Text>
          </View>
        </Animated.View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.activeRow}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Atlas is monitoring Robbert AI</Text>
        </View>
        <Text style={styles.statusText}>Neural core active · pulse stable</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    marginBottom: 16,
    borderRadius: V2.radiusLg,
    backgroundColor: V2.bgGlass,
    borderWidth: 1,
    borderColor: V2.borderGlow,
    overflow: "hidden",
  },

  gridBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
    backgroundColor: V2.bgElevated,
  },

  glow: {
    position: "absolute",
    alignSelf: "center",
    top: 20,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: V2.heartGlow,
  },

  orbitRing: {
    alignSelf: "center",
    width: 180,
    height: 180,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: V2.heartRing,
    borderStyle: "dashed",
  },

  orbitDot: {
    position: "absolute",
    top: -5,
    alignSelf: "center",
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: V2.purple,
    shadowColor: V2.purple,
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },

  orbitDotSecondary: {
    top: undefined,
    bottom: -5,
    backgroundColor: V2.accent,
    shadowColor: V2.accent,
  },

  statusRing: {
    position: "absolute",
    alignSelf: "center",
    top: 34,
    width: 140,
    height: 140,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(56, 189, 248, 0.08)",
  },

  core: {
    alignItems: "center",
  },

  coreOrb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: V2.heartCore,
    marginBottom: 8,
    shadowColor: V2.accent,
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },

  coreLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: V2.accent,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  coreHealth: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "900",
    color: V2.text,
  },

  footer: {
    marginTop: 200,
    alignItems: "center",
    gap: 6,
  },

  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: V2.success,
  },

  activeText: {
    fontSize: 13,
    fontWeight: "800",
    color: V2.text,
    letterSpacing: 0.3,
  },

  statusText: {
    fontSize: 11,
    color: V2.textDim,
  },
});

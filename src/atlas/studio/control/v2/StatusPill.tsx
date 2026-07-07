import { StyleSheet, Text, View } from "react-native";

import { toneColor, toneSoft, type V2Tone } from "./v2Theme";

type StatusPillProps = {
  label: string;
  tone?: V2Tone;
};

export default function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: toneSoft(tone), borderColor: toneColor(tone) + "44" }]}>
      <View style={[styles.dot, { backgroundColor: toneColor(tone) }]} />
      <Text style={[styles.text, { color: toneColor(tone) }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

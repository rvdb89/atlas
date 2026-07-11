import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import PageNav from "../components/PageNav";
import { BakeryColors, BakeryFonts } from "../constants/theme";

export default function PlannerLoavesScreen() {
  return (
    <View style={styles.screen}>
      <PageNav backTo="/planner-temperature" />

      <Text style={styles.step}>Stap 3 van 4</Text>
      <Text style={styles.title}>Hoeveel broden gaan wij maken?</Text>

      <View style={styles.card}>
        {[1, 2, 3, 4].map((amount) => (
          <Pressable
            key={amount}
            style={styles.option}
            onPress={() => router.push("/planner-result")}
          >
            <Text style={styles.optionTitle}>
              {amount} {amount === 1 ? "brood" : "broden"}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BakeryColors.cream, padding: 24, paddingTop: 64 },
  step: { color: BakeryColors.orangeAccent, fontWeight: "700", marginBottom: 12 },
  title: {
    fontFamily: BakeryFonts.display,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: BakeryColors.brown,
    marginBottom: 28,
  },
  card: { backgroundColor: BakeryColors.warmWhite, borderRadius: 24, padding: 16 },
  option: { padding: 20, borderRadius: 18, backgroundColor: BakeryColors.cream, marginBottom: 12 },
  optionTitle: { fontFamily: BakeryFonts.display, fontSize: 19, fontWeight: "700", color: BakeryColors.brown },
});
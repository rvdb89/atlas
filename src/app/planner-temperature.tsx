import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import PageNav from "../components/PageNav";

const temperatures = ["18", "18.5", "19", "19.5", "20", "20.5", "21", "21.5", "22", "22.5", "23", "23.5", "24", "24.5", "25", "25.5", "26"];

export default function PlannerTemperatureScreen() {
  return (
    <View style={styles.screen}>
      <PageNav backTo="/planner" />

      <Text style={styles.step}>Stap 2 van 4</Text>
      <Text style={styles.title}>Hoe warm is het in huis?</Text>
      <Text style={styles.subtitle}>
        De temperatuur bepaalt hoe snel je deeg fermenteert. Kleine verschillen kunnen al uitmaken.
      </Text>

      <View style={styles.grid}>
        {temperatures.map((temp) => (
          <Pressable key={temp} style={styles.option} onPress={() => router.push("/planner-loaves")}>
            <Text style={styles.optionText}>{temp}°C</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F1E8", padding: 24, paddingTop: 64 },
  step: { color: "#B86B38", fontWeight: "700", marginBottom: 12 },
  title: { fontSize: 34, lineHeight: 40, fontWeight: "700", color: "#2B2118", marginBottom: 12 },
  subtitle: { fontSize: 17, lineHeight: 24, color: "#7A6652", marginBottom: 28 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  option: { backgroundColor: "#FFFDF8", borderRadius: 16, paddingVertical: 16, width: "30%", alignItems: "center" },
  optionText: { color: "#2B2118", fontSize: 17, fontWeight: "700" },
});
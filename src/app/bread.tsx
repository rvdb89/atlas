import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/ScreenLayout";

export default function BreadScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Brood"
      subtitle="Kies het brood dat we samen gaan maken."
    >
      <Pressable style={styles.card} onPress={() => router.push("/landbrood")}>
        <Text style={styles.cardTitle}>Landbrood</Text>
        <Text style={styles.cardText}>
          Licht, luchtig en perfect om mee te starten.
        </Text>
        <Text style={styles.meta}>Beginner ⭐</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Licht volkoren</Text>
        <Text style={styles.cardText}>
          Meer smaak en vezels, maar nog steeds toegankelijk.
        </Text>
        <Text style={styles.meta}>Beginner ⭐</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Volkoren</Text>
        <Text style={styles.cardText}>
          Steviger, voedzamer en voller van smaak.
        </Text>
        <Text style={styles.meta}>Gemiddeld ⭐⭐</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2118",
    marginBottom: 6,
  },
  cardText: {
    color: "#7A6652",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
  },
  meta: { color: "#B86B38", fontWeight: "600" },
});

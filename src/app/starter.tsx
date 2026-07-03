import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import ScreenLayout from "@/components/ScreenLayout";

export default function StarterScreen() {
  return (
    <ScreenLayout title="Recepten" onBack={() => router.back()}>
      <Text style={styles.text}>Coming soon...</Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    fontSize: 18,
    color: "#746652",
    textAlign: "center",
  },
});

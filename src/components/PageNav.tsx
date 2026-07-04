import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  backTo: string;
};

export default function PageNav({ backTo }: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.replace(backTo)}>
        <Text style={styles.link}>← Terug</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/")}>
        <Text style={styles.link}>🏠 Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  link: {
    fontSize: 17,
    fontWeight: "600",
    color: "#7A6652",
  },
});
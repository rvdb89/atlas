import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import PageNav from "../components/PageNav";

export default function PlannerResultScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <PageNav backTo="/planner-loaves" />

      <Text style={styles.kicker}>Doughbert heeft gerekend</Text>
      <Text style={styles.title}>Jouw bakplanning staat klaar 🍞</Text>

      <Text style={styles.subtitle}>
        Volg straks gewoon één stap tegelijk. Wij houden het overzicht.
      </Text>

      <View style={styles.card}>
        <Text style={styles.day}>Vandaag</Text>

        <Step time="13:00" title="Voed Doughbert" text="Zorg dat je starter straks actief is." />
        <Step time="17:00" title="Autolyse" text="Meng bloem en water. Daarna mag het deeg rusten." />
        <Step time="18:00" title="Deeg maken" text="Voeg starter en zout toe." />
        <Step time="18:30" title="Stretch & Fold 1" text="We bouwen rustig kracht op." />
        <Step time="19:00" title="Stretch & Fold 2" text="Nog één keer versterken." />
        <Step time="19:30" title="Stretch & Fold 3" text="Laatste ronde." />
        <Step time="23:00" title="Koelkast" text="Het deeg ontwikkelt rustig verder." />
      </View>

      <View style={styles.card}>
        <Text style={styles.day}>Morgen</Text>

        <Step time="07:15" title="Oven voorverwarmen" text="Zet je pan, steel of plaat alvast in de oven." />
        <Step time="08:00" title="Bakken" text="Tijd om je brood te bakken." />
        <Step time="08:45" title="Genieten" text="Laat kort afkoelen. Daarna snijden." />
      </View>

      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Terug naar Home</Text>
      </Pressable>
    </ScrollView>
  );
}

function Step({ time, title, text }: { time: string; title: string; text: string }) {
  return (
    <View style={styles.step}>
      <Text style={styles.time}>{time}</Text>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F1E8",
  },
  content: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  kicker: {
    color: "#B86B38",
    fontWeight: "700",
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "700",
    color: "#2B2118",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 28,
    fontSize: 17,
    lineHeight: 24,
    color: "#7A6652",
  },
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  day: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2118",
    marginBottom: 18,
  },
  step: {
    flexDirection: "row",
    marginBottom: 20,
  },
  time: {
    width: 64,
    fontWeight: "700",
    color: "#B86B38",
    fontSize: 17,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2118",
  },
  stepText: {
    marginTop: 4,
    color: "#7A6652",
    lineHeight: 21,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#B86B38",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
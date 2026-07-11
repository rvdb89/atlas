import { StyleSheet, Text, View } from "react-native";

import { BakeryColors, BakeryFonts } from "@/constants/theme";
import type { StarterFreshness } from "@/modules/doughbert/starter/starterUtils";

const FRESHNESS_LABEL: Record<StarterFreshness, string> = {
  vers: "Net gevoed — lekker actief",
  actief: "Actief en gezond",
  hongerig: "Wordt hongerig — tijd om te voeden",
};

const FRESHNESS_BUBBLE_COUNT: Record<StarterFreshness, number> = {
  vers: 6,
  actief: 3,
  hongerig: 1,
};

const FRESHNESS_DOUGH_HEIGHT: Record<StarterFreshness, `${number}%`> = {
  vers: "76%",
  actief: "62%",
  hongerig: "48%",
};

/** A simple, abstract visual of the user's own starter — a jar whose dough level and
 * bubbliness reflect how long ago it was fed. Deliberately built from plain shapes (no
 * illustration assets) so it stays calm and on-brand with the rest of the editorial design
 * system, and never needs an image to be generated or shipped. */
export default function StarterAvatar({
  name,
  freshness,
}: {
  name: string;
  freshness: StarterFreshness;
}) {
  const bubbleCount = FRESHNESS_BUBBLE_COUNT[freshness];

  return (
    <View style={styles.wrapper}>
      <View style={styles.jar}>
        <View style={styles.jarNeck} />
        <View style={styles.jarBody}>
          <View style={[styles.dough, { height: FRESHNESS_DOUGH_HEIGHT[freshness] }]}>
            {Array.from({ length: bubbleCount }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bubble,
                  {
                    left: `${12 + ((index * 31) % 76)}%`,
                    bottom: `${8 + ((index * 19) % 70)}%`,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.status}>{FRESHNESS_LABEL[freshness]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  jar: {
    width: 140,
    alignItems: "center",
  },

  jarNeck: {
    width: 56,
    height: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: BakeryColors.warmWhite,
    borderWidth: 2,
    borderColor: BakeryColors.orangeAccent,
    borderBottomWidth: 0,
  },

  jarBody: {
    width: 140,
    height: 150,
    borderRadius: 22,
    backgroundColor: BakeryColors.warmWhite,
    borderWidth: 2,
    borderColor: BakeryColors.orangeAccent,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  dough: {
    backgroundColor: BakeryColors.peach,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  bubble: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: BakeryColors.warmWhite,
    opacity: 0.85,
  },

  name: {
    marginTop: 18,
    fontFamily: BakeryFonts.display,
    fontSize: 22,
    fontWeight: "700",
    color: BakeryColors.brown,
  },

  status: {
    marginTop: 4,
    fontSize: 14,
    color: BakeryColors.textSecondary,
  },
});

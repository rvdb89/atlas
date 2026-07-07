import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import { healthTone, V2 } from "./v2Theme";

const PORTFOLIO_IDS = ["doughbert", "atlas-control", "future-app"] as const;

const DISPLAY_NAMES: Record<(typeof PORTFOLIO_IDS)[number], string> = {
  doughbert: "Doughbert",
  "atlas-control": "Atlas Control",
  "future-app": "Future App",
};

type CompanyPortfolioV2Props = {
  snapshot: ControlSnapshot;
};

export default function CompanyPortfolioV2({ snapshot }: CompanyPortfolioV2Props) {
  const cards = PORTFOLIO_IDS.map((id) => {
    const business =
      id === "future-app"
        ? snapshot.businesses.find((b) => b.productIds.includes("future-app"))
        : snapshot.businesses.find((b) => b.id === id);
    const product = snapshot.products.find((p) => p.id === id);

    const name = DISPLAY_NAMES[id];
    const health = business?.roadmapProgress ?? (product?.status === "planning" ? 5 : 0);
    const statusLabel = business?.statusLabel ?? product?.statusLabel ?? "Planning";
    const focus = business?.currentSprint ?? business?.marketingStatus ?? "—";
    const nextAction =
      business?.marketingStatus ??
      snapshot.atlasAdvice.recommendation.slice(0, 80) + (snapshot.atlasAdvice.recommendation.length > 80 ? "…" : "");

    return { id, name, health, statusLabel, focus, nextAction };
  });

  return (
    <GlassCard title="Company Portfolio" subtitle="Businesses under Robbert AI" badge="Live">
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{card.name}</Text>
              <StatusPill label={card.statusLabel} tone={healthTone(card.health)} />
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Health</Text>
              <Text style={styles.metricValue}>{card.health}%</Text>
            </View>
            <Text style={styles.fieldLabel}>Current focus</Text>
            <Text style={styles.fieldValue}>{card.focus}</Text>
            <Text style={styles.fieldLabel}>Next action</Text>
            <Text style={styles.fieldValueAccent} numberOfLines={2}>
              {card.nextAction}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    flex: 1,
    minWidth: 200,
    padding: 16,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
  },

  cardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: V2.text,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: V2.border,
  },

  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: V2.textDim,
    textTransform: "uppercase",
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: V2.accent,
  },

  fieldLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "700",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  fieldValue: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: V2.textMuted,
  },

  fieldValueAccent: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: V2.text,
  },
});

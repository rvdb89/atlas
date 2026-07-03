import { StyleSheet } from "react-native";

export const KNOWLEDGE_COLORS = {
  warmWhite: "#FFFDF8",
  card: "#F8F0E6",
  brown: "#2B2118",
  secondary: "#7A6652",
  orangeAccent: "#B86B38",
  peach: "#F3D1A5",
};

export const knowledgeStyles = StyleSheet.create({
  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: KNOWLEDGE_COLORS.brown,
    marginBottom: 14,
  },

  panel: {
    backgroundColor: KNOWLEDGE_COLORS.warmWhite,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: KNOWLEDGE_COLORS.secondary,
    marginBottom: 16,
  },

  field: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(184, 107, 56, 0.08)",
  },

  fieldLast: {
    borderBottomWidth: 0,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: KNOWLEDGE_COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },

  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
    color: KNOWLEDGE_COLORS.brown,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
    marginBottom: 12,
  },

  flourCard: {
    backgroundColor: KNOWLEDGE_COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  flourHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  flourName: {
    fontSize: 18,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
  },

  flourPercentage: {
    fontSize: 16,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.orangeAccent,
  },

  listItem: {
    backgroundColor: KNOWLEDGE_COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  listItemTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
    marginBottom: 8,
  },

  listItemLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: KNOWLEDGE_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginTop: 8,
    marginBottom: 4,
  },

  listItemValue: {
    fontSize: 15,
    lineHeight: 22,
    color: KNOWLEDGE_COLORS.brown,
  },

  tipItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(184, 107, 56, 0.08)",
  },

  tipBullet: {
    fontSize: 16,
    color: KNOWLEDGE_COLORS.orangeAccent,
    fontWeight: "800",
  },

  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: KNOWLEDGE_COLORS.brown,
  },

  didYouKnowCard: {
    backgroundColor: KNOWLEDGE_COLORS.peach,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  didYouKnowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
    marginBottom: 6,
  },

  didYouKnowFact: {
    fontSize: 15,
    lineHeight: 22,
    color: KNOWLEDGE_COLORS.brown,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(184, 107, 56, 0.12)",
    marginVertical: 16,
  },
});

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
    marginTop: 16,
  },

  panelInner: {
    gap: 0,
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

  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: KNOWLEDGE_COLORS.brown,
  },

  metaBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  metaBadge: {
    backgroundColor: KNOWLEDGE_COLORS.warmWhite,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  metaBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.orangeAccent,
  },

  summaryCard: {
    backgroundColor: KNOWLEDGE_COLORS.peach,
    borderRadius: 24,
    padding: 22,
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: KNOWLEDGE_COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 17,
    lineHeight: 26,
    color: KNOWLEDGE_COLORS.brown,
  },

  quoteCard: {
    backgroundColor: KNOWLEDGE_COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: KNOWLEDGE_COLORS.orangeAccent,
    marginTop: 14,
  },

  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: KNOWLEDGE_COLORS.brown,
    fontStyle: "italic",
  },

  quoteAttribution: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: KNOWLEDGE_COLORS.secondary,
  },

  tipCard: {
    backgroundColor: KNOWLEDGE_COLORS.warmWhite,
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.12)",
  },

  tipLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  tableWrapper: {
    marginTop: 14,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  tableCaption: {
    backgroundColor: KNOWLEDGE_COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
  },

  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(184, 107, 56, 0.08)",
  },

  tableHeaderCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(243, 209, 165, 0.35)",
  },

  tableHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  tableCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: KNOWLEDGE_COLORS.warmWhite,
  },

  tableCellText: {
    fontSize: 14,
    lineHeight: 20,
    color: KNOWLEDGE_COLORS.brown,
  },

  bulletList: {
    marginTop: 14,
    gap: 8,
  },

  bulletRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  bulletDot: {
    fontSize: 16,
    lineHeight: 24,
    color: KNOWLEDGE_COLORS.orangeAccent,
    fontWeight: "800",
  },

  relatedGroup: {
    marginTop: 16,
  },

  relatedGroupTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 10,
  },

  relatedCard: {
    backgroundColor: KNOWLEDGE_COLORS.warmWhite,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  relatedCardPressed: {
    opacity: 0.92,
  },

  relatedCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: KNOWLEDGE_COLORS.brown,
  },

  relatedCardArrow: {
    fontSize: 22,
    fontWeight: "900",
    color: KNOWLEDGE_COLORS.orangeAccent,
  },

  relatedCardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: KNOWLEDGE_COLORS.secondary,
  },

  faqItem: {
    marginBottom: 10,
  },
});

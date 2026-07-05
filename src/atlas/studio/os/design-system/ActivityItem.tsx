import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../../core/theme";
import StatusBadge from "./StatusBadge";

type ActivityItemProps = {
  title: string;
  message: string;
  timeLabel: string;
  tone?: "healthy" | "warning" | "info" | "mock";
};

export default function ActivityItem({ title, message, timeLabel, tone = "info" }: ActivityItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <StatusBadge label={timeLabel} tone={tone} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },

  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  message: {
    fontSize: 12,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },
});

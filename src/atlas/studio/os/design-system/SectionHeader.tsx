import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../../core/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: string;
};

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
    gap: 12,
  },

  copy: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  action: {
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.accent,
  },
});

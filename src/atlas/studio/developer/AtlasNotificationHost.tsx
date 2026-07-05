import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import type { AtlasDevNotification } from "./devEvents";

type Props = {
  notifications: AtlasDevNotification[];
};

export default function AtlasNotificationHost({ notifications }: Props) {
  if (notifications.length === 0) return null;

  return (
    <View pointerEvents="none" style={styles.host}>
      {notifications.slice(0, 3).map((notification) => (
        <View key={notification.id} style={styles.toast}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    top: 72,
    right: 16,
    left: 16,
    alignItems: "flex-end",
    gap: 8,
    zIndex: 998,
  },

  toast: {
    maxWidth: 320,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
    marginBottom: 2,
  },

  message: {
    fontSize: 12,
    color: STUDIO_COLORS.secondary,
  },
});

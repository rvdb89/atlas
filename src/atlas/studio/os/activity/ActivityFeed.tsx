import { StyleSheet, View } from "react-native";

import { Card, ActivityItem } from "../design-system";
import { listRecentActivity } from "../registries/activityRegistry";

function formatRelativeTime(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(delta / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

const TONE_MAP = {
  "workflow-started": "info",
  "workflow-completed": "healthy",
  "entity-created": "healthy",
  "knowledge-generated": "info",
  "draft-published": "healthy",
  "provider-changed": "warning",
} as const;

export default function ActivityFeed() {
  const items = listRecentActivity(8);

  return (
    <Card title="Recent Activity">
      <View style={styles.list}>
        {items.map((item) => (
          <ActivityItem
            key={item.id}
            title={item.title}
            message={item.message}
            timeLabel={formatRelativeTime(item.occurredAt)}
            tone={TONE_MAP[item.kind]}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 4,
  },
});

import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../core/theme";
import CommandCenterCard from "./CommandCenterCard";
import type { CommandCenterRecentTask } from "./types";

type RecentTasksPanelProps = {
  tasks: CommandCenterRecentTask[];
};

function formatWhen(iso: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

export default function RecentTasksPanel({ tasks }: RecentTasksPanelProps) {
  return (
    <CommandCenterCard title="Recent AI Tasks" subtitle="Latest orchestrator activity">
      {tasks.map((task) => (
        <View key={task.id} style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.task}>{task.task}</Text>
            <Text style={styles.meta}>
              {task.providerId ?? "provider"} · {task.modelId ?? "model"} · {formatWhen(task.occurredAt)}
            </Text>
          </View>
          <Text style={[styles.result, task.success === false ? styles.fail : styles.ok]}>
            {task.success === false ? "failed" : "ok"}
          </Text>
        </View>
      ))}
    </CommandCenterCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  copy: {
    flex: 1,
  },

  task: {
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  meta: {
    marginTop: 2,
    fontSize: 12,
    color: STUDIO_COLORS.secondary,
  },

  result: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  ok: {
    color: STUDIO_COLORS.success,
  },

  fail: {
    color: STUDIO_COLORS.danger,
  },
});

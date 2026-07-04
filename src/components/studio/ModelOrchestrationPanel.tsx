import { StyleSheet, Text, View } from "react-native";

import { getAllTaskRoutes } from "@/atlas/ai/router/routeTask";
import { getModelProfile } from "@/atlas/ai/models/profiles";
import { getTaskRouteConfig } from "@/atlas/ai/tasks/routes";
import { getTeamMember } from "@/atlas/agents/team";
import { STUDIO_COLORS } from "./studioTheme";

export default function ModelOrchestrationPanel() {
  const routes = getAllTaskRoutes();

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>AI Orchestration</Text>
      <Text style={styles.subtitle}>
        Iedere taak gebruikt automatisch het beste beschikbare model — met fallback als een
        provider offline is.
      </Text>

      <View style={styles.list}>
        {routes.map((route) => {
          const config = getTaskRouteConfig(route.task);
          const member = getTeamMember(config.agentId);
          const primary = getModelProfile(route.primaryProviderId);
          const fallbacks = route.fallbackProviderIds
            .map((id) => getModelProfile(id))
            .filter((profile) => profile !== undefined);

          return (
            <View key={route.task} style={styles.row}>
              <View style={styles.rowHeader}>
                <Text style={styles.agent}>
                  {member.emoji} {member.name}
                </Text>
                <Text style={styles.task}>{route.task}</Text>
              </View>
              <Text style={styles.primary}>
                → {primary?.vendor ?? route.primaryProviderId} · {primary?.name ?? route.primaryProviderId}
              </Text>
              {fallbacks.length > 0 ? (
                <Text style={styles.fallbacks}>
                  Fallback: {fallbacks.map((model) => model.name).join(" · ")}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: STUDIO_COLORS.secondary,
  },

  list: {
    marginTop: 16,
    gap: 12,
  },

  row: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  agent: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  task: {
    fontSize: 11,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
  },

  primary: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.accent,
  },

  fallbacks: {
    fontSize: 12,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },
});

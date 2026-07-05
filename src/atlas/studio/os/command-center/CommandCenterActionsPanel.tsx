import { StyleSheet, View } from "react-native";

import { Card, CommandButton, SectionHeader } from "../design-system";
import { studioOsActions } from "../services/studioOsActions";
import { useStudioOs } from "../StudioOsContext";

export default function CommandCenterActionsPanel() {
  const { commandContext } = useStudioOs();

  return (
    <View style={styles.wrap}>
      <SectionHeader title="Command Actions" subtitle="Interactive cockpit controls" />
      <Card>
        <View style={styles.grid}>
          <CommandButton
            label="Restart Provider"
            variant="primary"
            onPress={() => studioOsActions.restartProvider("claude")}
          />
          <CommandButton label="Reload Registry" onPress={() => studioOsActions.reloadRegistry()} />
          <CommandButton label="Run Health" onPress={() => commandContext.navigate("/studio/health")} />
          <CommandButton label="Run Workflow" onPress={() => commandContext.navigate("/studio/proof-of-power")} />
          <CommandButton label="Open Logs" onPress={() => studioOsActions.openLogs()} />
          <CommandButton label="Refresh Providers" onPress={() => studioOsActions.refreshProviders()} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

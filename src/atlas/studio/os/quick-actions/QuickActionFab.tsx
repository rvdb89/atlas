import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../../core/theme";
import { QuickAction } from "../design-system";
import { listQuickActions } from "../registries/quickActionRegistry";
import { useStudioOs } from "../StudioOsContext";

export default function QuickActionFab() {
  const { quickActionsOpen, toggleQuickActions, closeQuickActions, commandContext } = useStudioOs();
  const actions = listQuickActions();

  return (
    <>
      <Pressable style={styles.fab} onPress={toggleQuickActions}>
        <Text style={styles.fabLabel}>＋</Text>
      </Pressable>

      <Modal transparent visible={quickActionsOpen} animationType="fade" onRequestClose={closeQuickActions}>
        <Pressable style={styles.backdrop} onPress={closeQuickActions}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Quick Actions</Text>
            {actions.map((action) => (
              <View key={action.id} style={styles.actionWrap}>
                <QuickAction
                  emoji={action.emoji}
                  label={action.label}
                  onPress={() => {
                    action.run(commandContext);
                    closeQuickActions();
                  }}
                />
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 56,
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    zIndex: 20,
  },

  fabLabel: {
    color: STUDIO_COLORS.warmWhite,
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },

  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(43, 33, 24, 0.25)",
  },

  sheet: {
    margin: 16,
    marginBottom: 88,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginBottom: 12,
  },

  actionWrap: {
    marginBottom: 8,
  },
});

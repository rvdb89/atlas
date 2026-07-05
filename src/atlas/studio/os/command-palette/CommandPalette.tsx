import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../../core/theme";
import { useStudioOs } from "../StudioOsContext";
import { searchCommands } from "../registries/commandRegistry";
import { runGlobalSearch } from "../registries/searchProviderRegistry";

export default function CommandPalette() {
  const { paletteOpen, searchOpen, closePalette, commandContext } = useStudioOs();
  const [query, setQuery] = useState("");

  const commands = useMemo(() => searchCommands(query), [query]);
  const results = useMemo(() => (searchOpen || query.length > 1 ? runGlobalSearch(query) : []), [query, searchOpen]);

  if (!paletteOpen) return null;

  return (
    <Modal transparent animationType="fade" visible={paletteOpen} onRequestClose={closePalette}>
      <Pressable style={styles.backdrop} onPress={closePalette}>
        <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>Command Palette</Text>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search commands, entities, workflows…"
            placeholderTextColor={STUDIO_COLORS.secondary}
            style={styles.input}
          />

          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            <Text style={styles.section}>Commands</Text>
            {commands.map((command) => (
              <Pressable
                key={command.id}
                style={styles.row}
                onPress={() => command.run(commandContext)}
              >
                <Text style={styles.rowTitle}>{command.label}</Text>
                <Text style={styles.rowMeta}>{command.group}</Text>
              </Pressable>
            ))}

            {results.length > 0 ? (
              <>
                <Text style={styles.section}>Search</Text>
                {results.map((result) => (
                  <Pressable
                    key={result.id}
                    style={styles.row}
                    onPress={() => {
                      if (result.route) {
                        commandContext.navigate(result.route);
                      } else {
                        result.action?.(commandContext);
                      }
                      closePalette();
                    }}
                  >
                    <Text style={styles.rowTitle}>{result.title}</Text>
                    <Text style={styles.rowMeta}>{result.group}{result.subtitle ? ` · ${result.subtitle}` : ""}</Text>
                  </Pressable>
                ))}
              </>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(43, 33, 24, 0.35)",
    justifyContent: "flex-start",
    paddingTop: 96,
    paddingHorizontal: 24,
  },

  panel: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 680,
    maxHeight: "70%",
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 16,
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    borderRadius: STUDIO_RADIUS.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: STUDIO_COLORS.brown,
    backgroundColor: STUDIO_COLORS.card,
    marginBottom: 12,
  },

  list: {
    maxHeight: 420,
  },

  section: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  rowMeta: {
    marginTop: 2,
    fontSize: 11,
    color: STUDIO_COLORS.secondary,
  },
});

import type { ReactNode } from "react";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

const COLORS = {
  warmWhite: "#FFFDF8",
  brown: "#2B2118",
  orangeAccent: "#B86B38",
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type AccordionProps = {
  title: string;
  children: ReactNode;
  /** Whether the section starts expanded. Defaults to collapsed. */
  defaultExpanded?: boolean;
};

/**
 * Reusable collapsible section for Knowledge Engine, FAQ, Starter Academy, etc.
 * Each instance manages its own open/closed state independently.
 */
export default function Accordion({
  title,
  children,
  defaultExpanded = false,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((value) => !value);
  };

  return (
    <View style={[styles.container, expanded && styles.containerExpanded]}>
      <Pressable
        style={({ pressed }) => [
          styles.header,
          expanded && styles.headerExpanded,
          pressed && styles.headerPressed,
        ]}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${title}, ${expanded ? "uitgeklapt" : "ingeklapt"}`}
      >
        <Text style={[styles.title, expanded && styles.titleExpanded]}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </Pressable>

      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    backgroundColor: COLORS.warmWhite,
    overflow: "hidden",
  },

  containerExpanded: {
    borderColor: "rgba(184, 107, 56, 0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },

  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(184, 107, 56, 0.1)",
    backgroundColor: "rgba(243, 209, 165, 0.25)",
  },

  headerPressed: {
    opacity: 0.88,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brown,
  },

  titleExpanded: {
    color: COLORS.orangeAccent,
  },

  chevron: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.orangeAccent,
    width: 18,
    textAlign: "center",
  },

  content: {
    padding: 18,
  },
});

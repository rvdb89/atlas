import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { usePathname } from "expo-router";

import { getAtlasHealthSnapshot } from "@/atlas/diagnostics";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { ATLAS_VERSION } from "@/atlas/version";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";

import { STUDIO_COLORS } from "../../core/theme";
import { StatusBadge } from "../design-system";

export default function AtlasStatusBar() {
  const pathname = usePathname();
  const [memoryMb, setMemoryMb] = useState<number | null>(null);
  const module = tryGetActiveModule();
  const health = getAtlasHealthSnapshot();
  const healthy = health.checks.filter((check) => check.ok).length;

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    if (!memory) return;

    const timer = setInterval(() => {
      setMemoryMb(Math.round(memory.usedJSHeapSize / (1024 * 1024)));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    `Atlas ${ATLAS_VERSION}`,
    "branch · main",
    `Claude · ${isAnthropicConfigured() ? "live" : "mock"}`,
    "env · development",
    `module · ${module?.name ?? "none"}`,
    memoryMb !== null ? `memory · ${memoryMb} MB` : "memory · n/a",
    `health · ${healthy}/${health.checks.length}`,
    pathname.replace("/studio", "studio") || "studio",
  ];

  return (
    <View style={styles.bar}>
      {items.map((item) => (
        <Text key={item} style={styles.item}>
          {item}
        </Text>
      ))}
      <StatusBadge label="Live-ready" tone="healthy" />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 38,
    borderTopWidth: 1,
    borderTopColor: STUDIO_COLORS.border,
    backgroundColor: STUDIO_COLORS.warmWhite,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },

  item: {
    fontSize: 11,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },
});

import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import { V2, type V2Tone } from "./v2Theme";

type MemorySectionV2Props = {
  snapshot: ControlSnapshot;
};

function formatMemoryUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Sprint 2.2a note — Department Source-of-Truth Alignment: "memory" used to be one of four
 * hardcoded pseudo-departments `buildRealDepartments()` appended unconditionally (alongside
 * "engineering"/"product"/"intelligence"), none of which corresponded to a ratified department
 * or a real team's operational agents. That fake department is gone — the four ratified
 * departments are engineering/publishing/customer-contact/signal-research (@/atlas/team/
 * department.types), and Memory is not one of them; it never was a department with its own
 * agents, only a health signal that happened to be dressed up as one. This section already had
 * a second, independent, genuinely real memory data source (`snapshot.memory`, unchanged by
 * Sprint 2.2a) sitting right below the old fake-department block — the two were showing the same
 * underlying status text twice. `statusFromMemoryHealth` below reproduces the old computed
 * department's exact health-tier thresholds so this pill's behavior is unchanged; only its
 * source (a real memory model, not a fake department) is. */
function statusFromMemoryHealth(health: number): { label: string; tone: V2Tone } {
  if (health >= 90) return { label: "Healthy", tone: "success" };
  if (health >= 70) return { label: "Active", tone: "success" };
  if (health >= 50) return { label: "Attention", tone: "warning" };
  return { label: "Idle", tone: "danger" };
}

export default function MemorySectionV2({ snapshot }: MemorySectionV2Props) {
  const memory = snapshot.memory;
  const memoryStatus = statusFromMemoryHealth(memory.health);
  const lastUpdatedLabel = memory.lastUpdated ? new Date(memory.lastUpdated).toLocaleString() : "No entries yet";

  return (
    <GlassCard title="Memory" subtitle="Company knowledge and recall systems" badge="Live">
      <View style={styles.row}>
        <View style={styles.block}>
          <Text style={styles.label}>Memory status</Text>
          <StatusPill label={memoryStatus.label} tone={memoryStatus.tone} />
          <Text style={styles.focus}>{memory.statusLabel}</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.label}>BRAIN-002 Memory Engine</Text>
          <Text style={styles.director}>{memory.statusLabel}</Text>
          <Text style={styles.focus}>Last updated: {lastUpdatedLabel}</Text>
          <Text style={styles.health}>{memory.health}% health</Text>
        </View>
      </View>

      {/* BRAIN-002b · Real recent memories, not just the health score above — same live
          data the Node runtime actually recalls when it reasons, finally visible here too. */}
      {memory.recent.length > 0 ? (
        <View style={styles.recentSection}>
          <Text style={styles.label}>Recent memories</Text>
          <View style={styles.recentList}>
            {memory.recent.map((entry) => (
              <View key={entry.id} style={styles.recentCard}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle} numberOfLines={1}>
                    {entry.title}
                  </Text>
                  <Text style={styles.recentType}>{entry.type}</Text>
                </View>
                <Text style={styles.recentSummary} numberOfLines={2}>
                  {entry.summary}
                </Text>
                <View style={styles.recentFooter}>
                  <Text style={styles.recentMeta}>{entry.source}</Text>
                  <Text style={styles.recentMeta}>{formatMemoryUpdatedAt(entry.updatedAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  block: {
    flex: 1,
    minWidth: 200,
    padding: 14,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  focus: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: V2.textMuted,
  },

  director: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: V2.text,
    lineHeight: 20,
  },

  health: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "800",
    color: V2.purple,
  },

  recentSection: {
    marginTop: 16,
  },

  recentList: {
    marginTop: 8,
    gap: 8,
  },

  recentCard: {
    padding: 12,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  recentTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: V2.text,
  },

  recentType: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.purple,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  recentSummary: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: V2.textMuted,
  },

  recentFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  recentMeta: {
    fontSize: 10,
    color: V2.textDim,
  },
});

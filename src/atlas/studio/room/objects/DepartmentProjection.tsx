import { StyleSheet, Text, View } from "react-native";

import { ROOM_COLORS } from "../theme";
import { RATIFIED_DEPARTMENTS, type RatifiedDepartmentId } from "@/atlas/team";

/**
 * A department, projected — Phase 5.9 ("Complete Presentation Reset"), rewritten from a blank
 * file. Renders exactly one department's identity, or none: a small radial instrument reading
 * (a bright point with a narrow fan of thin ticks) plus its label, never a wall, never several
 * at once, never a permanent object. This is the one piece of "information Atlas projects" that
 * exists as a real, non-text visual today — used only by `briefingSteps.ts`'s attention step,
 * via `step.visualReference` (`synthesisEngine.ts`'s own logic, never invented here).
 *
 * `RATIFIED_DEPARTMENTS`, the department data model, and this component's one prop
 * (`departmentId`) are all unchanged — this rewrite only replaces how the identity is drawn.
 */
const TICK_ANGLES = [-54, -27, 0, 27, 54] as const;
const TICK_RADIUS = 16;

export default function DepartmentProjection({ departmentId }: { departmentId: string }) {
  const label = RATIFIED_DEPARTMENTS[departmentId as RatifiedDepartmentId]?.label ?? departmentId;

  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        {TICK_ANGLES.map((angle) => (
          <View
            key={angle}
            style={[styles.tick, { transform: [{ rotate: `${angle}deg` }, { translateY: -TICK_RADIUS }] }]}
          />
        ))}
        <View style={styles.ring} />
        <View style={styles.core} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
  },

  field: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  tick: {
    position: "absolute",
    width: 1.5,
    height: 8,
    borderRadius: 1,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.45,
  },

  ring: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: ROOM_COLORS.emberCore,
    opacity: 0.4,
  },

  core: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberCore,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 8,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: ROOM_COLORS.textSecondary,
  },
});

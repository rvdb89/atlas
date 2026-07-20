import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { ROOM_COLORS } from "../theme";
import type { DepartmentSpec } from "../types";

/**
 * Department Wall — one continuous wall, four departments on their own
 * fixed band (`ATLAS_SPRINT_LOG.md`, Sprint 4 §Departments: "de wand breekt
 * nooit op in aparte panelen"). Each department renders exactly the
 * ratified Vein / Warm Vein / Grain Shift language: a fixed vein (position,
 * never changes), one warm vein (the only expression of judgment), and a
 * grain shift directly coupled to that same warmth (here: a soft secondary
 * halo whose opacity is derived from the same warmth value, never an
 * independent signal).
 *
 * Not individually clickable in Prototype 1 — the Atlas Build brief does
 * not ask departments to be navigable objects, so nothing is invented here.
 *
 * Sprint 23 ("First Truth") set the first mock truth this sprint proved: "Operations vraagt
 * aandacht" — the same Warm Vein property that carried Engineering's elevated state carrying
 * Operations's instead. Position stays exactly where structure already put it (Visual
 * Principle 7); only how much warmth that fixed position shows follows significance (Visual
 * Principle 8).
 *
 * Sprint 2.2 ("The Room — First Living Prototype") replaces the hardcoded four-department
 * mock array with `departments`, a real prop — the actual departments and warmth now come
 * from Atlas Control's own live state (`src/atlas/studio/room/roomData.ts`'s
 * `mapDepartmentsForRoom()`, fed by `useControlDashboard()` in `RoomScreen.tsx`). Nothing
 * about the Vein / Warm Vein / Grain Shift rendering changes — only where the list and each
 * department's warmth now come from. The wall's existing `space-between` layout already
 * generalizes to any real department count without further changes.
 *
 * Same-day correction ("The Room unfolds"): the whole wall now accepts an
 * optional animated `style` — `RoomScene` passes its shared reveal opacity
 * (`ROOM_MOTION.REVEAL`, driven by `approachProgress`) so the wall, and
 * every department's own warmth on it, sits almost invisible before the
 * Heart is activated and fully present after. Applied to this existing
 * root view, not a new wrapper, so nothing about the wall's own layout
 * changes — only its opacity, from the outside.
 */
export default function DepartmentWall({
  departments,
  style,
}: {
  departments: DepartmentSpec[];
  style?: Animated.WithAnimatedValue<ViewStyle>;
}) {
  return (
    <Animated.View style={[styles.wall, style]}>
      <View style={styles.band}>
        {departments.map((department) => (
          <Department key={department.id} spec={department} />
        ))}
      </View>
    </Animated.View>
  );
}

function Department({ spec }: { spec: DepartmentSpec }) {
  const warmth = spec.state === "elevated" ? 0.85 : 0.32;
  const grainShift = warmth * 0.5; // rechtstreeks gekoppeld aan dezelfde bron

  return (
    <View style={styles.department}>
      {/* The Vein — fixed structural carrier, never changes with judgment. */}
      <View style={styles.vein} />
      {/* Grain Shift — coupled to the Warm Vein, never an independent source. */}
      <View style={[styles.grainShift, { opacity: grainShift }]} />
      {/* Warm Vein — the sole visible expression of judgment. */}
      <View style={[styles.warmVein, { opacity: warmth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wall: {
    width: "100%",
    alignItems: "center",
  },

  band: {
    flexDirection: "row",
    width: "78%",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  department: {
    width: 54,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },

  vein: {
    position: "absolute",
    width: 14,
    height: "100%",
    borderRadius: 10,
    backgroundColor: ROOM_COLORS.wallDeep,
    opacity: 0.35,
  },

  grainShift: {
    position: "absolute",
    width: 26,
    height: 60,
    borderRadius: 16,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  warmVein: {
    position: "absolute",
    width: 14,
    height: 40,
    borderRadius: 10,
    backgroundColor: ROOM_COLORS.emberCore,
  },
});

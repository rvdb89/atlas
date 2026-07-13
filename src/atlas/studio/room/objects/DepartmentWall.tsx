import { StyleSheet, View } from "react-native";

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
 */
const DEPARTMENTS: DepartmentSpec[] = [
  { id: "engineering", label: "Engineering", state: "elevated" },
  { id: "sales", label: "Sales", state: "calm" },
  { id: "finance", label: "Finance", state: "calm" },
  { id: "operations", label: "Operations", state: "calm" },
];

export default function DepartmentWall() {
  return (
    <View style={styles.wall}>
      <View style={styles.band}>
        {DEPARTMENTS.map((department) => (
          <Department key={department.id} spec={department} />
        ))}
      </View>
    </View>
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

import { StyleSheet, Text, View } from "react-native";

import { ROOM_COLORS } from "../theme";
import { RATIFIED_DEPARTMENTS, type RatifiedDepartmentId } from "@/atlas/team";

/**
 * Department Projection — Phase 5.6 ("Atlas Space").
 *
 * Sprint 14 ("The Room — Version 1") ratified a permanent Department Wall: every real
 * department, side by side, always visible once the Heart was approached. Phase 5.6 retires
 * that architecture — not the organization itself. Engineering, Publishing, Customer Contact
 * and Signal & Research (`RATIFIED_DEPARTMENTS`) remain exactly as real and permanent as they
 * always were; "nothing about the business model changes." Only their permanent *visual*
 * representation is retired: a department is no longer a fixed place in Space. It is an
 * organizational identity Atlas materializes only while actually discussing it, and lets
 * dissolve the moment that's finished — the single-source model `ATLAS_RENDERING_LAW.md` §7
 * now states as the general rule for all of Space, not an exception to it.
 *
 * This file is that materialization, extracted (not reinvented) from what was previously
 * `ExecutiveBriefingOverlay.tsx`'s own inline `PointVisual` (Sprint 5.4) — the one place in the
 * current codebase where Atlas genuinely "discusses" one specific department: the Attention
 * step's `visualReference`, sourced from `synthesisEngine.ts`'s `capacityClause()`, never
 * invented here. Same two-layer Vein / Warm Vein idiom this file always used, same
 * `ROOM_COLORS` tokens, same canonical `RATIFIED_DEPARTMENTS` label table. Renders exactly one
 * department, or none — never a wall, never several at once, never a placeholder.
 *
 * `DepartmentSpec`/`mapDepartmentsForRoom()` (`roomData.ts`) are unchanged and still real — they
 * are simply retired from having a permanent visual consumer in `RoomScene.tsx`. A future
 * capability that genuinely needs an ambient, always-current department signal can reinstate a
 * call site without any change to that data layer; this sprint does not invent one, since no
 * such "Atlas is currently discussing this" event exists outside the Briefing today.
 */
export default function DepartmentProjection({ departmentId }: { departmentId: string }) {
  const label = RATIFIED_DEPARTMENTS[departmentId as RatifiedDepartmentId]?.label ?? departmentId;

  return (
    <View style={styles.wrap}>
      <View style={styles.shape}>
        {/* The Vein — the same fixed structural carrier Department Wall always rendered,
            here scoped to the one department actually being discussed. */}
        <View style={styles.vein} />
        {/* Warm Vein — the sole visible expression of judgment, unchanged. */}
        <View style={styles.warmVein} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    alignSelf: "center",
    gap: 4,
  },

  shape: {
    width: 36,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  vein: {
    position: "absolute",
    width: 10,
    height: "100%",
    borderRadius: 8,
    backgroundColor: ROOM_COLORS.wallDeep,
    opacity: 0.35,
  },

  warmVein: {
    position: "absolute",
    width: 10,
    height: 20,
    borderRadius: 8,
    backgroundColor: ROOM_COLORS.emberCore,
    opacity: 0.85,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: ROOM_COLORS.textSecondary,
  },
});

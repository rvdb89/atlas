import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CeoFocusOverlay from "./CeoFocusOverlay";
import ExecutiveBriefingOverlay from "./ExecutiveBriefingOverlay";
import PlaceholderOverlay from "./PlaceholderOverlay";
import {
  composeExecutiveBriefing,
  deriveHeartVitality,
  mapCompanyDoorways,
  mapDepartmentsForRoom,
  selectCeoFocus,
} from "./roomData";
import RoomScene from "./RoomScene";
import { ROOM_COLORS } from "./theme";
import type { DoorwayId, RoomObjectId } from "./types";
import { useControlDashboard } from "@/atlas/studio/control/useControlDashboard";

/** Sprint 2.2 ("The Room — First Living Prototype"): "inbox" no longer opens a generic
 * `PlaceholderOverlay` — it opens the real `CeoFocusOverlay` below. "tools" (AI Tools) is
 * outside this sprint's scope (not one of the six required elements) and stays exactly the
 * placeholder it already was. */
type PlaceholderObjectId = Extract<RoomObjectId, "tools">;

const PLACEHOLDER_MESSAGE: Record<PlaceholderObjectId, string> = {
  tools: "AI Tools view will be built later.",
};

/**
 * Atlas Build — Prototype 1: "The Room Becomes Software."
 *
 * The Room Version 1 (`ATLAS_SPRINT_LOG.md`, Sprint 14) made navigable for
 * the first time. No new architecture, objects, behaviors or materialization
 * — every object here is the already-ratified object, now clickable. Every
 * click leads to a placeholder, never a finished destination, per the brief.
 *
 * Sprint 15 ("Living Room") added exactly two things on top, both purely
 * about craftsmanship, never about meaning: overlays are always mounted
 * and driven by `visible` so opening/closing is a Soft State Transition,
 * and every clickable object shares the same `RoomTouchable` reaction (see
 * `motion.ts`, `RoomTouchable.tsx`).
 *
 * Sprint 17 first tried "First Conversation" as an overlay (`ConversationSpace`,
 * still present in the codebase, currently unused). Review found the
 * transition itself still read as software, not as Atlas — so Sprint 18
 * ("The Awakening") replaces that wiring: activating the Heart no longer
 * opens anything. It toggles `approached`, a state of The Room itself,
 * handled entirely inside `RoomScene`. CEO Inbox and AI Tools are
 * unchanged — still `PlaceholderOverlay`.
 *
 * Sprint 21 ("First Company") extends the same pattern to the Company
 * Doorways: activating one no longer opens a placeholder card either. It
 * sets `enteredCompany`, another state of The Room itself, and `RoomScene`
 * cross-fades its own composition rather than navigating to a new screen.
 *
 * Sprint 2.2 ("The Room — First Living Prototype") is the first sprint to feed this screen
 * real company state instead of mock data. `useControlDashboard()` is the exact same hook
 * `ControlScreenV2.tsx` already uses — no new fetch path, no new backend. `roomData.ts`'s two
 * pure mapping functions turn that one real snapshot into what Department Wall and Threshold
 * Stone each need; `RoomScreen` itself makes no data decisions, it only holds the two derived
 * values and passes them down. CEO Inbox and AI Tools are no longer treated the same way:
 * "inbox" now opens `CeoFocusOverlay` (real, capped, judged content); "tools" stays exactly
 * the placeholder it already was — not one of this sprint's six required elements.
 *
 * Sprint 4.1 ("Architectuurbeslissing & fundament") ratifies this screen as the canonical
 * CEO-facing Atlas surface — see ADR-001 in `ATLAS_ARCHITECTURE_DECISIONS.md` and
 * `src/atlas/studio/ceoSurface.ts`. Atlas Control (`ControlScreenV2.tsx`) is transitional;
 * its remaining capability migrates here, into this object language, starting Sprint 4.2 —
 * never as a dashboard panel bolted onto the scene below.
 */
export default function RoomScreen() {
  const insets = useSafeAreaInsets();
  const {
    snapshot,
    adjustingItemId,
    setAdjustingItemId,
    approveInbox,
    adjustInbox,
    deferInbox,
  } = useControlDashboard();
  const [approached, setApproached] = useState(false);
  const [enteredCompany, setEnteredCompany] = useState<DoorwayId | null>(null);
  const [activeObject, setActiveObject] = useState<PlaceholderObjectId | null>(null);
  const [ceoFocusOpen, setCeoFocusOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(true);

  const departments = useMemo(
    () => mapDepartmentsForRoom(snapshot?.operations ?? []),
    [snapshot?.operations],
  );

  const ceoFocus = useMemo(
    () => selectCeoFocus(snapshot?.ceoInbox ?? []),
    [snapshot?.ceoInbox],
  );

  // Sprint 4.2 ("The Heart Becomes Alive") — the same real `companyState.companyHealth`
  // Atlas Control's own `AiHeart.tsx` already reads (`snapshot.companyState.companyHealth`
  // in `ControlScreenV2.tsx`), carried through unchanged.
  const heartVitality = useMemo(
    () => deriveHeartVitality(snapshot?.companyState.companyHealth),
    [snapshot?.companyState.companyHealth],
  );

  // Sprint 4.2 ("Capability Migration 02") — the same real `businesses` array Company
  // Portfolio (`CompanyPortfolioV2.tsx`) already reads, carried through unchanged.
  const doorwayPresence = useMemo(
    () => mapCompanyDoorways(snapshot?.businesses ?? []),
    [snapshot?.businesses],
  );

  // Sprint 4.2 ("Executive Briefing v1") — composed once per snapshot from the same real
  // ControlSnapshot every other Room capability already reads; null only until the first
  // snapshot has loaded, so the overlay below simply doesn't render before there's anything
  // real to say.
  const briefing = useMemo(() => (snapshot ? composeExecutiveBriefing(snapshot) : null), [snapshot]);

  // Sprint 4.3 ("Room Entry Experience") — the Room's own entrance no longer fires the moment
  // this screen mounts; it waits for the Briefing to be dismissed, so "Atlas greets you" and
  // "you enter The Room" read as two beats in sequence, not two things happening at once.
  // `briefingOpen` already starts `true` and only ever becomes `false` via `handleCloseBriefing`
  // below — this is a straight derivation of that same state, not a second source of truth.

  const handleSelect = useCallback((object: RoomObjectId) => {
    if (object === "heart") {
      setApproached((current) => !current);
      return;
    }
    if (object === "doorway-left" || object === "doorway-right") {
      setEnteredCompany(object);
      return;
    }
    if (object === "inbox") {
      setCeoFocusOpen(true);
      return;
    }
    setActiveObject(object);
  }, []);

  const handleExitCompany = useCallback(() => {
    setEnteredCompany(null);
  }, []);

  const handleClose = useCallback(() => {
    setActiveObject(null);
  }, []);

  const handleCloseCeoFocus = useCallback(() => {
    setCeoFocusOpen(false);
    // Sprint 4.2 · closing Threshold Stone always starts the next visit clean, rather than
    // silently carrying an expanded Adjust picker across a close/reopen — a small Room-side
    // interaction decision, not a change to the shared adjust/approve/defer logic itself.
    setAdjustingItemId(null);
  }, [setAdjustingItemId]);

  const handleCloseBriefing = useCallback(() => {
    setBriefingOpen(false);
  }, []);

  const handleAdjustClick = useCallback(
    (itemId: string) => {
      setAdjustingItemId((current) => (current === itemId ? null : itemId));
    },
    [setAdjustingItemId],
  );

  const placeholderMessage = activeObject ? PLACEHOLDER_MESSAGE[activeObject] : null;

  return (
    <View style={styles.screen}>
      <RoomScene
        approached={approached}
        enteredCompany={enteredCompany}
        departments={departments}
        ceoFocusWarmth={ceoFocus.warmth}
        heartVitality={heartVitality}
        doorwayPresence={doorwayPresence}
        readyToEnter={!briefingOpen}
        onSelect={handleSelect}
        onExitCompany={handleExitCompany}
      />

      <Pressable
        style={[styles.exit, { top: Math.max(insets.top, 16) }]}
        onPress={enteredCompany ? handleExitCompany : () => router.back()}
      >
        <Text style={styles.exitLabel}>
          {enteredCompany ? "← Terug naar The Room" : "← Verlaat The Room"}
        </Text>
      </Pressable>

      <CeoFocusOverlay
        visible={ceoFocusOpen}
        items={ceoFocus.items}
        adjustingItemId={adjustingItemId}
        onApprove={approveInbox}
        onAdjustClick={handleAdjustClick}
        onAdjustOption={adjustInbox}
        onDefer={deferInbox}
        onClose={handleCloseCeoFocus}
      />

      <PlaceholderOverlay
        visible={activeObject !== null}
        message={placeholderMessage}
        onClose={handleClose}
      />

      <ExecutiveBriefingOverlay
        visible={briefingOpen && briefing !== null}
        briefing={briefing}
        onClose={handleCloseBriefing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ROOM_COLORS.void,
  },

  exit: {
    position: "absolute",
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  exitLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(220, 213, 198, 0.7)",
  },
});

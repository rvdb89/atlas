import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import { ROOM_MOTION } from "./motion";

/**
 * The shared Soft State Transition driver (Sprint 15). Every overlay in
 * The Room that opens and closes — the generic placeholder, and, since
 * Sprint 17, the Conversation Space — as well as the Heart's own
 * `approached` state (Sprint 18) all use this one hook with the single
 * shared timing (`ROOM_MOTION.TRANSITION`), so "one timing, one easing,
 * everywhere" stays structurally true for this category of change
 * instead of being re-implemented (and silently drifting) per component.
 */
export function useRoomTransition(visible: boolean): Animated.Value {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  return progress;
}

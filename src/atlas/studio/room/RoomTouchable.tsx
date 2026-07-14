import { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { ROOM_MOTION } from "./motion";
import { ROOM_COLORS } from "./theme";

/**
 * Uniform Object Touch Response (Sprint 15, "Living Room").
 *
 * The single, shared reaction every interactive object in The Room uses —
 * Heart, Threshold Stone, Small Hollow, both Archway Recesses. There is
 * exactly one place this reaction is defined, which is what makes "identical
 * for every object" structurally true rather than a convention five
 * different components each have to remember to follow.
 *
 * The reaction is a small, uniform scale (never a color or warmth change),
 * driven purely by real, traceable input — hover/press — never by Atlas's
 * judgment. It confirms only "this object can be touched," nothing about
 * how important it currently is. See the Sprint 15 note in
 * `ATLAS_SPRINT_LOG.md` for the explicit Rendering Law verification.
 *
 * v2 correction (Sprint 18 review): on web, `Pressable` rendered the
 * browser's default focus outline — a blue ring that reads as unfinished
 * software, not as Atlas. `outlineWidth: 0` removes it; a thin, uniform
 * ember-colored ring (same reasoning as the scale reaction: identical for
 * every object, never tied to judgment) replaces it on focus, so keyboard
 * accessibility is kept without borrowing the browser's own visual
 * language.
 */
export default function RoomTouchable({
  onPress,
  accessibilityLabel,
  hitStyle,
  focusRadius = 16,
  children,
}: {
  onPress: () => void;
  accessibilityLabel: string;
  hitStyle?: StyleProp<ViewStyle>;
  focusRadius?: number;
  children: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const focus = useRef(new Animated.Value(0)).current;

  const animateScale = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: ROOM_MOTION.TOUCH.duration,
      easing: ROOM_MOTION.TOUCH.easing,
      useNativeDriver: true,
    }).start();
  };

  const animateFocus = (toValue: number) => {
    Animated.timing(focus, {
      toValue,
      duration: ROOM_MOTION.TOUCH.duration,
      easing: ROOM_MOTION.TOUCH.easing,
      useNativeDriver: true,
    }).start();
  };

  const settle = () => animateScale(1);
  const engage = () => animateScale(ROOM_MOTION.TOUCH.scale);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={engage}
      onHoverOut={settle}
      onPressIn={engage}
      onPressOut={settle}
      onFocus={() => animateFocus(1)}
      onBlur={() => animateFocus(0)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.hitArea, hitStyle, webFocusReset]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.focusRing,
          { borderRadius: focusRadius, opacity: focus },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// Suppresses the browser's own default focus ring on web only — native
// platforms never had one. Kept isolated to one constant so it is never
// mistaken for a general style.
const webFocusReset: StyleProp<ViewStyle> =
  Platform.OS === "web" ? ({ outlineWidth: 0 } as ViewStyle) : null;

const styles = StyleSheet.create({
  hitArea: {
    alignItems: "center",
    justifyContent: "center",
  },

  focusRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 1.5,
    borderColor: ROOM_COLORS.emberWarm,
  },
});

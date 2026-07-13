import { useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { ROOM_MOTION } from "./motion";

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
 */
export default function RoomTouchable({
  onPress,
  accessibilityLabel,
  hitStyle,
  children,
}: {
  onPress: () => void;
  accessibilityLabel: string;
  hitStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: ROOM_MOTION.TOUCH.duration,
      easing: ROOM_MOTION.TOUCH.easing,
      useNativeDriver: true,
    }).start();
  };

  const settle = () => animateTo(1);
  const engage = () => animateTo(ROOM_MOTION.TOUCH.scale);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={engage}
      onHoverOut={settle}
      onPressIn={engage}
      onPressOut={settle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.hitArea, hitStyle]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    alignItems: "center",
    justifyContent: "center",
  },
});

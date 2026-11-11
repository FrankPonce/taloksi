import { useEffect, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, type StyleProp, type ViewStyle } from 'react-native';

const native = Platform.OS !== 'web';

// People who ask their device for less motion get the end state straight away
let reduce = false;
AccessibilityInfo.isReduceMotionEnabled()
  .then((v) => (reduce = v))
  .catch(() => {});

/**
 * Motion kit. Everything here answers something the learner did (a new
 * exercise, a verdict, a card flip); nothing loops for decoration except the
 * mascot's idle bob.
 */

/** Slams in like a comic panel: slightly big and tilted, then settles */
export function Pop({ children, style, delay = 0, from = 0.86 }: { children: ReactNode; style?: StyleProp<ViewStyle>; delay?: number; from?: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return v.setValue(1);
    Animated.spring(v, { toValue: 1, delay, friction: 6, tension: 140, useNativeDriver: native }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }),
          transform: [
            { scale: v.interpolate({ inputRange: [0, 1], outputRange: [from, 1] }) },
            { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['-2.5deg', '0deg'] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Slides up from below (feedback sheets) and shakes sideways when `shake` is set */
export function Rise({ children, shake }: { children: ReactNode; shake?: boolean }) {
  const y = useRef(new Animated.Value(0)).current;
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return y.setValue(1);
    Animated.spring(y, { toValue: 1, friction: 7, tension: 120, useNativeDriver: native }).start();
    if (shake) {
      Animated.sequence(
        [10, -10, 7, -7, 3, 0].map((to) => Animated.timing(x, { toValue: to, duration: 55, easing: Easing.linear, useNativeDriver: native }))
      ).start();
    }
  }, []);
  return (
    <Animated.View
      style={{
        opacity: y,
        transform: [{ translateY: y.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }, { translateX: x }],
      }}
    >
      {children}
    </Animated.View>
  );
}

/** Gentle up-and-down bob for the mascot on result screens */
export function Bob({ children }: { children: ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return <Animated.View style={{ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] }}>{children}</Animated.View>;
}

/**
 * Card flip. Squashes to an edge, swaps the face, and opens again. Change
 * `face` to trigger it. (A squash works the same on web, iOS and Android,
 * which a true 3D rotation does not.)
 */
export function Flip({ face, children }: { face: string; children: ReactNode }) {
  const v = useRef(new Animated.Value(1)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    v.setValue(0);
    Animated.spring(v, { toValue: 1, friction: 6, tension: 150, useNativeDriver: native }).start();
  }, [face]);
  return <Animated.View style={{ transform: [{ scaleX: v }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['4deg', '0deg'] }) }] }}>{children}</Animated.View>;
}

/** Width that glides to its new value (progress bars) */
export function useGlide(value: number) {
  const v = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: value, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value]);
  return v;
}

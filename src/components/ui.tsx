import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Children, useState, type ComponentProps, type ReactNode } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speak';
import { gloss, type Pos } from '../content';
import { useApp } from '../state/store';
import { colors, font, hardShadow, onColor, OUTLINE, radius } from '../theme';
import { useGlide } from './motion';
import { Surface, Text, useSurface } from './Text';

export { Text } from './Text';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color?: string }) {
  const surface = useSurface();
  return <Ionicons name={name} size={size} color={color ?? (surface === 'paper' ? colors.ink : colors.paper)} />;
}

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.inner, { flex: 1, padding: 16 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

/** Halftone dot texture that fills its parent. Put it first inside a panel with overflow hidden. */
export function Halftone({ color = colors.ink, opacity = 0.12, size = 10 }: { color?: string; opacity?: number; size?: number }) {
  const id = `ht-${color.replace('#', '')}-${size}`;
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <Pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <Circle cx={size / 2} cy={size / 2} r={size / 4.2} fill={color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </Svg>
  );
}

/** Paper panel with an ink outline and a hard offset shadow */
export function Panel({
  children,
  style,
  color = colors.paper,
  shadow = colors.ink,
  halftone,
  tilt,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: string;
  shadow?: string;
  halftone?: boolean;
  tilt?: number;
}) {
  return (
    <Surface.Provider value={onColor(color) === colors.ink ? 'paper' : 'night'}>
      <View
        style={[
          styles.panel,
          { backgroundColor: color, boxShadow: hardShadow(shadow) },
          tilt ? { transform: [{ rotate: `${tilt}deg` }] } : null,
          style,
        ]}
      >
        {halftone && <Halftone color={onColor(color)} />}
        {children}
      </View>
    </Surface.Provider>
  );
}
/** Kept so older screens read naturally */
export const Card = Panel;

/** Slanted label bar, e.g. "OSA 1 // UNIT 1" */
export function Tag({
  label,
  color = colors.ink,
  tilt = -2,
  size = 14,
  style,
}: {
  label: string;
  color?: string;
  tilt?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.tag, { backgroundColor: color, transform: [{ rotate: `${tilt}deg` }] }, style]}>
      <Text style={{ fontFamily: font.label, fontSize: size, letterSpacing: 1, color: onColor(color), textTransform: 'uppercase' }}>
        {label}
      </Text>
    </View>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'gold' | 'ghost';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
  icon,
}: {
  title: string;
  onPress: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
}) {
  const bg = {
    primary: colors.blue,
    secondary: colors.paper,
    success: colors.success,
    danger: colors.red,
    gold: colors.gold,
    ghost: 'transparent',
  }[variant];
  const ghost = variant === 'ghost';
  const fg = ghost ? colors.paper : disabled ? colors.paper : onColor(bg);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        ghost
          ? { borderColor: 'transparent' }
          : {
              backgroundColor: disabled ? colors.locked : bg,
              boxShadow: hardShadow(colors.ink, pressed ? 1 : 4),
              transform: [{ translateX: pressed ? 3 : 0 }, { translateY: pressed ? 3 : 0 }],
            },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={20} color={fg} />}
      <Text style={[styles.btnText, { color: fg }, ghost && { textDecorationLine: 'underline' }]}>{title}</Text>
    </Pressable>
  );
}

/** Answer choice / selectable option */
export function Chip({
  label,
  selected,
  onPress,
  disabled,
  tone,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  tone?: 'success' | 'danger';
}) {
  const bg = tone === 'success' ? colors.success : tone === 'danger' ? colors.red : selected ? colors.gold : colors.paper;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        sfx('tap');
        onPress?.();
      }}
      style={[
        styles.chip,
        { backgroundColor: bg, opacity: disabled && !tone && !selected ? 0.55 : 1, boxShadow: hardShadow(colors.ink, selected ? 1 : 3) },
        selected && { transform: [{ translateX: 2 }, { translateY: 2 }] },
      ]}
    >
      <Text style={[styles.chipText, { color: onColor(bg) }]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color = colors.aurora }: { value: number; color?: string }) {
  const w = useGlide(Math.max(0, Math.min(1, value)));
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: color }]} />
    </View>
  );
}

export function SpeakerButton({
  text,
  id,
  speaker,
  size = 'md',
}: {
  text: string;
  id?: string;
  speaker?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const rate = useApp((s) => s.settings.audioRate);
  const dim = { sm: 38, md: 50, lg: 84 }[size];
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
      <Pressable
        accessibilityLabel="Play audio"
        onPress={() => speak(text, { id, rate, speaker })}
        style={({ pressed }) => [
          styles.speaker,
          { width: dim, height: dim, boxShadow: hardShadow(colors.ink, pressed ? 1 : 3), transform: [{ rotate: '-3deg' }] },
        ]}
      >
        <Ionicons name="volume-high" size={dim * 0.5} color={colors.ink} />
      </Pressable>
      {size !== 'sm' && (
        <Pressable
          accessibilityLabel="Play slowly"
          onPress={() => speak(text, { id, rate: 0.65, speaker })}
          style={({ pressed }) => [
            styles.speaker,
            { width: dim * 0.7, height: dim * 0.7, backgroundColor: colors.paper, boxShadow: hardShadow(colors.ink, pressed ? 1 : 3) },
          ]}
        >
          <Text style={{ fontFamily: font.label, fontSize: dim * 0.24, color: colors.ink }}>HIDAS</Text>
        </Pressable>
      )}
    </View>
  );
}

/** The spoken-Finnish version of a line. Tap it to hear Aino say it (pass the content id). */
export function PuheLine({ puhe, id }: { puhe?: string; id?: string }) {
  const show = useApp((s) => s.settings.showPuhekieli);
  const rate = useApp((s) => s.settings.audioRate);
  const surface = useSurface();
  if (!show || !puhe) return null;
  return (
    <Pressable
      onPress={() => speak(puhe, { id: id ? `${id}__puhe` : undefined, rate, speaker: 'aino' })}
      style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}
    >
      <Ionicons name="volume-medium" size={18} color={surface === 'paper' ? colors.ink : colors.paper} />
      <Tag label="Puhekieli" color={colors.berry} tilt={-2} size={12} />
      <Text style={{ fontSize: 16, fontStyle: 'italic', color: surface === 'paper' ? colors.ink : colors.paper, flexShrink: 1 }}>{puhe}</Text>
    </Pressable>
  );
}

/** Go back, or home when the screen was opened directly (deep link, page reload) */
export const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

/** Close / back control used at the top of pushed screens */
export function BackButton({ icon = 'close' }: { icon?: IconName }) {
  return (
    <Pressable onPress={goBack} accessibilityLabel="Back" style={styles.back}>
      <Ionicons name={icon} size={22} color={colors.ink} />
    </Pressable>
  );
}

/** Page title: slanted display type with an accent bar underneath */
export function H1({ children, accent = colors.gold }: { children: ReactNode; accent?: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', transform: [{ rotate: '-1.5deg' }], marginVertical: 4 }}>
      <Text style={styles.h1}>{children}</Text>
      <View style={{ height: 6, backgroundColor: accent, marginTop: 2, marginRight: -10, borderWidth: 2, borderColor: colors.ink }} />
    </View>
  );
}

export function H2({ children, color = colors.aurora }: { children: ReactNode; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
      <View style={{ width: 14, height: 22, backgroundColor: color, transform: [{ skewX: '-18deg' }], borderWidth: 2, borderColor: colors.ink }} />
      <Text style={styles.h2}>{children}</Text>
    </View>
  );
}

export function Muted({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const surface = useSurface();
  return (
    <Text style={[{ fontSize: 14, lineHeight: 20, color: surface === 'paper' ? colors.mutedOnPaper : colors.mutedOnNight }, style as never]}>
      {children}
    </Text>
  );
}

/** Small stat counter (streak, XP, hearts) */
export function StatPill({ icon, value, color }: { icon: IconName; value: string | number; color: string }) {
  return (
    <View style={[styles.stat, { backgroundColor: color }]}>
      <Ionicons name={icon} size={18} color={onColor(color)} />
      <Text style={{ fontFamily: font.display, fontSize: 20, color: onColor(color) }}>{value}</Text>
    </View>
  );
}

const POS_LABEL: Record<Pos, { fi: string; en: string; color: string }> = {
  noun: { fi: 'substantiivi', en: 'noun', color: colors.blue },
  verb: { fi: 'verbi', en: 'verb', color: colors.red },
  adj: { fi: 'adjektiivi', en: 'adjective', color: colors.aurora },
  adv: { fi: 'adverbi', en: 'adverb', color: colors.orange },
  pron: { fi: 'pronomini', en: 'pronoun', color: colors.berry },
  num: { fi: 'numero', en: 'number', color: colors.gold },
  question: { fi: 'kysymyssana', en: 'question word', color: colors.gold },
  particle: { fi: 'partikkeli', en: 'little word', color: colors.paperDim },
  phrase: { fi: 'fraasi', en: 'phrase', color: colors.paperDim },
};

/** Word-type label: "substantiivi · noun". One colour per type, the same everywhere. */
export function PosTag({ pos, tilt = 2 }: { pos?: Pos; tilt?: number }) {
  if (!pos) return null;
  const p = POS_LABEL[pos];
  return <Tag label={`${p.fi} · ${p.en}`} color={p.color} tilt={tilt} size={13} />;
}

/** A word's picture as a tilted sticker: flat colour, ink outline, hard shadow */
export function WordPic({ icon, size = 96, color = colors.gold, tilt = -4 }: { icon?: string; size?: number; color?: string; tilt?: number }) {
  if (!icon) return null;
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderWidth: OUTLINE,
        borderColor: colors.ink,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: hardShadow(colors.ink, Math.max(3, Math.round(size / 22))),
        transform: [{ rotate: `${tilt}deg` }],
      }}
    >
      <Halftone color={colors.ink} opacity={0.14} size={8} />
      <MaterialCommunityIcons name={icon as never} size={size * 0.62} color={onColor(color)} />
    </View>
  );
}

/**
 * A Finnish sentence whose words you can hover (web) or tap to see what each
 * one means. The gloss appears in a strip under the sentence.
 */
export function Glossed({ text, size = 22 }: { text: string; size?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const parts = text.split(/\s+/).filter(Boolean);
  const g = open === null ? undefined : gloss(parts[open]);
  return (
    <View style={{ flexShrink: 1, gap: 4 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: size * 0.28 }}>
        {parts.map((w, i) => {
          const known = !!gloss(w);
          return (
            <Pressable
              key={i}
              disabled={!known}
              onPress={() => setOpen(open === i ? null : i)}
              onHoverIn={() => setOpen(i)}
              onHoverOut={() => setOpen((o) => (o === i ? null : o))}
            >
              <Text
                style={{
                  fontSize: size,
                  lineHeight: size * 1.3,
                  fontWeight: '700',
                  backgroundColor: open === i ? colors.gold : 'transparent',
                  borderBottomWidth: known ? 2 : 0,
                  borderStyle: 'dotted',
                  borderColor: colors.mutedOnPaper,
                }}
              >
                {w}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ minHeight: 22 }}>
        {g ? (
          <Text style={{ fontSize: 15 }}>
            <Text style={{ fontSize: 15, fontWeight: '700' }}>{g.en}</Text>
            {g.lemma.toLowerCase() !== parts[open as number].replace(/[.,!?;:]/g, '').toLowerCase() ? `  ·  from ${g.lemma}` : ''}
          </Text>
        ) : (
          <Text style={{ fontSize: 13, color: colors.mutedOnPaper }}>Tap a word to see what it means</Text>
        )}
      </View>
    </View>
  );
}

/**
 * Lays answer options out as a two-column grid when they are short enough to
 * fit, and as a list when they are long. Pass the option texts as `labels`.
 */
export function Options({ labels, children }: { labels: string[]; children: ReactNode }) {
  const { width } = useWindowDimensions();
  const longest = Math.max(...labels.map((l) => l.length));
  const grid = labels.length >= 4 && longest <= (width >= 480 ? 24 : 13);
  return (
    <View style={grid ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } : { gap: 12 }}>
      {Children.map(children, (c) => (
        <View style={grid ? { flexBasis: '46%', flexGrow: 1 } : undefined}>{c}</View>
      ))}
    </View>
  );
}

/** Shared look for text inputs */
export const inputStyle = {
  borderWidth: OUTLINE,
  borderColor: colors.ink,
  borderRadius: radius.md,
  backgroundColor: colors.paper,
  boxShadow: hardShadow(colors.ink, 4),
  padding: 14,
  fontSize: 22,
  fontFamily: font.bold,
  color: colors.ink,
} as const;

/** Right / wrong banner: big slanted verdict word on a coloured panel */
export function Verdict({ ok, title, children }: { ok: boolean; title: string; children?: ReactNode }) {
  return (
    <Panel color={ok ? colors.success : colors.red} halftone>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ backgroundColor: colors.ink, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }], borderRadius: 4 }}>
          <Ionicons name={ok ? 'checkmark' : 'close'} size={26} color={ok ? colors.success : colors.red} />
        </View>
        <Text style={{ fontFamily: font.display, fontSize: 30, textTransform: 'uppercase', flexShrink: 1 }}>{title}</Text>
      </View>
      {children}
    </Panel>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  scroll: { padding: 16, paddingBottom: 56 },
  inner: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: 14 },
  panel: {
    borderRadius: radius.md,
    padding: 16,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    gap: 8,
    overflow: 'hidden',
  },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 2 },
  btn: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontFamily: font.display, fontSize: 21, letterSpacing: 0.6, textTransform: 'uppercase' },
  chip: { borderWidth: OUTLINE, borderColor: colors.ink, borderRadius: radius.md, paddingVertical: 11, paddingHorizontal: 14 },
  chipText: { fontSize: 18, fontFamily: font.bold, textAlign: 'center' },
  track: {
    height: 18,
    backgroundColor: colors.nightDeep,
    borderRadius: 3,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    overflow: 'hidden',
    flex: 1,
    transform: [{ skewX: '-14deg' }],
  },
  fill: { height: '100%', borderRightWidth: OUTLINE, borderColor: colors.ink },
  speaker: {
    backgroundColor: colors.gold,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    width: 40,
    height: 40,
    backgroundColor: colors.paper,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: hardShadow(colors.ink, 3),
    transform: [{ rotate: '-4deg' }],
  },
  h1: { fontFamily: font.display, fontSize: 38, lineHeight: 40, textTransform: 'uppercase', letterSpacing: 0.5 },
  h2: { fontFamily: font.label, fontSize: 22, textTransform: 'uppercase', letterSpacing: 1 },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    boxShadow: hardShadow(colors.ink, 3),
    transform: [{ skewX: '-8deg' }],
  },
});

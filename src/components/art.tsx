import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Pattern, Polygon, Rect } from 'react-native-svg';
import { getCharacter } from '../content';
import { colors, font, hardShadow, OUTLINE } from '../theme';
import { Surface, Text } from './Text';

const INK = colors.ink;
const FRAME = '14,0 100,0 100,86 86,100 0,100 0,14';

export type Mood = 'happy' | 'cheer' | 'sad';

/** Cel-shaded character portrait in a cut-corner frame. Norppa gets the seal. */
export function Avatar({ id, size = 56, mood = 'happy' }: { id?: string; size?: number; mood?: Mood }) {
  const c = getCharacter(id);
  if (!c || !c.avatar) {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points={FRAME} fill={c?.color ?? colors.blue} />
          <Polygon points="0,62 100,22 100,48 0,88" fill="#fff" opacity={0.18} />
          <G transform="translate(-4 -2) scale(0.9)">
            <NorppaShapes mood={mood} />
          </G>
          <Polygon points={FRAME} fill="none" stroke={INK} strokeWidth={6} />
        </Svg>
      </View>
    );
  }
  const a = c.avatar;
  const has = (x: string) => a.extras?.includes(x);
  const clip = `av-${c.id}`;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <ClipPath id={clip}>
            <Polygon points={FRAME} />
          </ClipPath>
          <Pattern id={`${clip}-dots`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <Circle cx={4} cy={4} r={1.7} fill={INK} />
          </Pattern>
        </Defs>
        <G clipPath={`url(#${clip})`}>
          <Rect width={100} height={100} fill={c.color} />
          <Rect width={100} height={100} fill={`url(#${clip}-dots)`} opacity={0.16} />
          <Polygon points="0,62 100,22 100,48 0,88" fill="#fff" opacity={0.2} />

          {/* hair behind the head */}
          {a.hairStyle === 'bob' && (
            <Path d="M27 40 C25 14 75 14 73 40 L76 66 L64 68 L64 46 L36 46 L36 68 L24 66 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          )}
          {a.hairStyle === 'pony' && (
            <Path d="M66 24 C86 20 92 46 80 62 L72 52 C78 42 74 34 64 32 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          )}
          {a.hairStyle === 'bun' && <Circle cx={50} cy={15} r={10} fill={a.hair} stroke={INK} strokeWidth={3} />}

          {/* shoulders */}
          <Path d="M8 106 C10 80 30 72 50 72 C70 72 90 80 92 106 Z" fill={a.shirt} stroke={INK} strokeWidth={3} />
          <Path d="M50 72 C70 72 90 80 92 106 L62 106 C64 90 60 80 50 72 Z" fill="#000" opacity={0.2} />
          {/* neck */}
          <Path d="M42 58 L42 74 Q50 81 58 74 L58 58 Z" fill={a.skin} stroke={INK} strokeWidth={3} />
          <Path d="M42 62 L58 62 L58 69 Q50 72 42 67 Z" fill="#000" opacity={0.22} />
          {/* head */}
          <Path d="M31 40 C31 24 69 24 69 40 L68 50 C66 60 58 67 50 67 C42 67 34 60 32 50 Z" fill={a.skin} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M54 26 C64 27 69 33 69 40 L68 50 C66 60 58 67 50 67 C58 60 61 52 61 44 C61 36 58 30 54 26 Z" fill="#000" opacity={0.15} />

          {has('beard') && (
            <Path d="M32 50 C34 60 42 67 50 67 C58 67 66 60 68 50 L63 55 C59 59 55 56 50 56 C45 56 41 59 37 55 Z" fill={a.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          )}

          {/* face */}
          <Line x1={37} y1={39.5} x2={46} y2={38} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={54} y1={38} x2={63} y2={39.5} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          {mood === 'cheer' ? (
            <>
              <Path d="M38 46 Q42 42 46 46" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
              <Path d="M54 46 Q58 42 62 46" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <Polygon points="38,43.5 46,43 45.2,47.5 39,47.5" fill={INK} />
              <Polygon points="54,43 62,43.5 61,47.5 54.8,47.5" fill={INK} />
              <Rect x={42.4} y={44} width={1.8} height={1.6} fill="#fff" />
              <Rect x={58.2} y={44} width={1.8} height={1.6} fill="#fff" />
            </>
          )}
          <Path d="M50 46 L48 53 L51.5 53" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {mood === 'sad' ? (
            <Path d="M44 61 Q50 56 56 61" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          ) : mood === 'cheer' ? (
            <Path d="M43 57 Q50 66 57 57 Z" fill="#fff" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          ) : (
            <Path d="M44 58 Q50 62.5 57 57" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          )}
          {has('glasses') && (
            <>
              <Rect x={35} y={40.5} width={12.5} height={9} rx={2} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={2.4} />
              <Rect x={52.5} y={40.5} width={12.5} height={9} rx={2} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={2.4} />
              <Line x1={47.5} y1={44} x2={52.5} y2={44} stroke={INK} strokeWidth={2.4} />
            </>
          )}
          {has('earring') && <Circle cx={32} cy={54} r={2.6} fill={colors.gold} stroke={INK} strokeWidth={1.5} />}

          {/* hair in front */}
          {a.hairStyle === 'short' && (
            <Path d="M30 42 C25 16 75 14 70 42 L66 33 L58 29 L49 33 L41 29 L34 35 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          )}
          {a.hairStyle === 'bob' && (
            <Path d="M30 43 C27 18 73 18 70 43 L62 33 L51 37 L44 31 L36 37 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          )}
          {a.hairStyle === 'pony' && (
            <Path d="M30 42 C26 16 74 16 70 40 L60 30 L45 33 L36 39 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          )}
          {a.hairStyle === 'bun' && (
            <Path d="M30 42 C27 20 73 20 70 42 C64 32 57 29 50 29 C43 29 36 32 30 42 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          )}
          {a.hairStyle === 'curly' && (
            <G fill={a.hair} stroke={INK} strokeWidth={3}>
              <Circle cx={33} cy={35} r={7.5} />
              <Circle cx={67} cy={35} r={7.5} />
              <Circle cx={37} cy={26} r={8.5} />
              <Circle cx={63} cy={26} r={8.5} />
              <Circle cx={50} cy={22} r={9.5} />
              <Path d="M34 34 C36 24 64 24 66 34 C60 30 40 30 34 34 Z" stroke="none" />
            </G>
          )}
          {a.hairStyle === 'cap' && (
            <>
              <Path d="M29 36 C29 12 71 12 71 36 Z" fill={a.shirt} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
              <Path d="M26 35 L80 35 L86 41 L26 41 Z" fill={INK} />
              <Path d="M40 22 L48 19 L48 30 L40 31 Z" fill={colors.gold} stroke={INK} strokeWidth={1.5} />
            </>
          )}
          {a.hairStyle !== 'cap' && a.hairStyle !== 'curly' && <Path d="M38 26 L46 23 L42 31 Z" fill="#fff" opacity={0.35} />}
        </G>
        <Polygon points={FRAME} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      </Svg>
    </View>
  );
}

function NorppaShapes({ mood }: { mood: Mood }) {
  const up = mood === 'cheer';
  return (
    <G>
      {/* flippers */}
      <Path
        d={up ? 'M22 62 C6 52 2 36 12 30 C20 38 26 48 28 60 Z' : 'M20 70 C6 72 2 88 14 92 C22 88 26 80 26 72 Z'}
        fill="#7C8AA6"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d={up ? 'M98 62 C114 52 118 36 108 30 C100 38 94 48 92 60 Z' : 'M100 70 C114 72 118 88 106 92 C98 88 94 80 94 72 Z'}
        fill="#6E7B96"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* body */}
      <Path d="M18 92 C10 60 30 22 60 22 C90 22 110 60 102 92 C98 110 22 110 18 92 Z" fill="#93A1BC" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M70 24 C92 30 108 62 102 92 C100 103 82 106 66 106 C84 96 92 78 90 58 C88 42 80 30 70 24 Z" fill="#000" opacity={0.18} />
      {/* the rings that give the ringed seal its name */}
      <G fill="none" stroke="#E4EAF5" strokeWidth={2.6}>
        <Circle cx={36} cy={38} r={5.5} />
        <Circle cx={85} cy={46} r={4.5} />
        <Circle cx={28} cy={64} r={4} />
        <Circle cx={60} cy={30} r={3.5} />
      </G>
      <Ellipse cx={58} cy={90} rx={26} ry={14} fill="#EEF2F9" stroke={INK} strokeWidth={3} />
      <Ellipse cx={60} cy={63} rx={17} ry={12} fill="#EEF2F9" stroke={INK} strokeWidth={3} />
      <Line x1={47} y1={62} x2={30} y2={57} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <Line x1={47} y1={65} x2={30} y2={67} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <Line x1={73} y1={62} x2={90} y2={57} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <Line x1={73} y1={65} x2={90} y2={67} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <Polygon points="54,55 66,55 60,62" fill={INK} />
      {mood === 'cheer' ? (
        <>
          <Path d="M37 48 Q44 39 51 48" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M69 48 Q76 39 83 48" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M52 66 Q60 80 68 66 Z" fill={colors.red} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        </>
      ) : (
        <>
          <Circle cx={44} cy={46} r={6.5} fill={INK} />
          <Circle cx={76} cy={46} r={6.5} fill={INK} />
          <Circle cx={46} cy={44} r={2.2} fill="#fff" />
          <Circle cx={78} cy={44} r={2.2} fill="#fff" />
          {mood === 'sad' ? (
            <>
              <Line x1={36} y1={34} x2={50} y2={38} stroke={INK} strokeWidth={3} strokeLinecap="round" />
              <Line x1={84} y1={34} x2={70} y2={38} stroke={INK} strokeWidth={3} strokeLinecap="round" />
              <Path d="M53 71 Q60 66 67 71" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <Path d="M53 67 Q60 73 67 67" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </G>
  );
}

function burstPoints(cx: number, cy: number, outer: number, inner: number, spikes: number) {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** The mascot on its own, optionally in front of a comic starburst */
export function Norppa({ size = 120, mood = 'happy', burst }: { size?: number; mood?: Mood; burst?: string }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="-14 -14 148 148">
        {burst && (
          <>
            <Polygon points={burstPoints(65, 67, 72, 54, 14)} fill={INK} />
            <Polygon points={burstPoints(60, 62, 72, 54, 14)} fill={burst} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          </>
        )}
        <NorppaShapes mood={mood} />
      </Svg>
    </View>
  );
}

/** A character saying something: portrait plus speech bubble */
export function Speech({
  speaker,
  children,
  mood,
  size = 64,
  color = colors.paper,
  style,
}: {
  speaker?: string;
  children: ReactNode;
  mood?: Mood;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const c = getCharacter(speaker);
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }, style]}>
      <View style={{ alignItems: 'center' }}>
        <Avatar id={speaker} size={size} mood={mood} />
        {c && (
          <View style={{ backgroundColor: INK, paddingHorizontal: 6, transform: [{ rotate: '-3deg' }], marginTop: -6 }}>
            <Text style={{ fontFamily: font.label, fontSize: 12, letterSpacing: 1, color: colors.paper, textTransform: 'uppercase' }}>{c.name}</Text>
          </View>
        )}
      </View>
      <Surface.Provider value="paper">
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: color,
              borderWidth: OUTLINE,
              borderColor: INK,
              borderRadius: 6,
              padding: 12,
              gap: 6,
              boxShadow: hardShadow(INK, 4),
            }}
          >
            {children}
          </View>
          <View
            style={{
              position: 'absolute',
              left: -7,
              top: 18,
              width: 16,
              height: 16,
              backgroundColor: color,
              borderLeftWidth: OUTLINE,
              borderBottomWidth: OUTLINE,
              borderColor: INK,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      </Surface.Provider>
    </View>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { createContext, useContext, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Pattern, Polygon, Rect } from 'react-native-svg';
import { getCharacter, type Character } from '../content';
import { colors, font, hardShadow, OUTLINE } from '../theme';
import { Surface, Text } from './Text';

const INK = colors.ink;
const FRAME = '14,0 100,0 100,86 86,100 0,100 0,14';
// shoulders rather than a dome: neck, a slope down to each shoulder, then the arms
// Two builds. Shoulders sit high and nearly level, so there is no slope of muscle up to the neck.
const TORSO_M = 'M9 130 C9 97 13 84 31 79 L42 75 L58 75 L69 79 C87 84 91 97 91 130 Z';
const TORSO_F = 'M17 130 C17 100 20 87 34 81 L43.5 76 L56.5 76 L66 81 C80 87 83 100 83 130 Z';

/** 'cheer' is the old name for 'excited' and still works */
export type Mood = 'happy' | 'excited' | 'sad' | 'question' | 'wink' | 'angry' | 'cheer';
const norm = (m: Mood) => (m === 'cheer' ? 'excited' : m);

// ── People ──────────────────────────────────────────────────────────────────
// Drawn in a 100 × 128 box: head around (50, 44), torso from y = 72 down.

function Outfit({ a, id, fem }: { a: NonNullable<Character['avatar']>; id: string; fem?: boolean }) {
  const clip = `torso-${id}`;
  const TORSO = fem ? TORSO_F : TORSO_M;
  const dark = '#000';
  return (
    <G>
      <Defs>
        <ClipPath id={clip}>
          <Path d={TORSO} />
        </ClipPath>
      </Defs>
      <Path d={TORSO} fill={a.shirt} />
      <G clipPath={`url(#${clip})`}>
       <G transform={fem ? 'translate(50 5) scale(0.8 1) translate(-50 0)' : 'translate(50 4) scale(0.92 1) translate(-50 0)'}>
        {a.outfit === 'hoodie' && (
          <>
            <Path d="M30 80 C36 66 64 66 70 80 C62 88 38 88 30 80 Z" fill={dark} opacity={0.18} />
            <Line x1={45} y1={86} x2={44} y2={102} stroke={colors.paper} strokeWidth={2.4} strokeLinecap="round" />
            <Line x1={55} y1={86} x2={56} y2={102} stroke={colors.paper} strokeWidth={2.4} strokeLinecap="round" />
            <Path d="M32 114 H68 V132 H32 Z" fill={dark} opacity={0.12} stroke={INK} strokeWidth={2} />
          </>
        )}
        {a.outfit === 'flannel' && (
          <>
            {[20, 34, 66, 80].map((x) => (
              <Rect key={x} x={x} y={70} width={5} height={62} fill={dark} opacity={0.45} />
            ))}
            {[90, 106, 122].map((y) => (
              <Rect key={y} x={0} y={y} width={100} height={5} fill={dark} opacity={0.45} />
            ))}
            <Rect x={27} y={78} width={6} height={54} fill="#3B2A1A" stroke={INK} strokeWidth={1.5} />
            <Rect x={67} y={78} width={6} height={54} fill="#3B2A1A" stroke={INK} strokeWidth={1.5} />
            <Path d="M38 74 L50 90 L43 95 Z" fill="#8E211A" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M62 74 L50 90 L57 95 Z" fill="#8E211A" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          </>
        )}
        {a.outfit === 'apron' && (
          <>
            <Line x1={34} y1={92} x2={41} y2={76} stroke={colors.paper} strokeWidth={3.5} />
            <Line x1={66} y1={92} x2={59} y2={76} stroke={colors.paper} strokeWidth={3.5} />
            <Path d="M32 92 H68 V132 H32 Z" fill={colors.paper} stroke={INK} strokeWidth={2.5} />
            <Path d="M44 104 H56 V112 C56 117 44 117 44 112 Z" fill="#5C3A17" />
            <Path d="M56 106 C61 106 61 112 56 112" stroke="#5C3A17" strokeWidth={2} fill="none" />
            <Path d="M47 101 Q48 98 47 96 M52 101 Q53 98 52 96" stroke="#5C3A17" strokeWidth={1.4} fill="none" strokeLinecap="round" />
          </>
        )}
        {a.outfit === 'cardigan' && (
          <>
            <Path d="M40 73 L50 104 L60 73 Z" fill={colors.paper} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
            <Line x1={50} y1={104} x2={50} y2={132} stroke={INK} strokeWidth={2.2} />
            <Circle cx={54} cy={112} r={2.2} fill={colors.gold} stroke={INK} strokeWidth={1} />
            <Circle cx={54} cy={123} r={2.2} fill={colors.gold} stroke={INK} strokeWidth={1} />
            {[14, 24, 76, 86].map((x) => (
              <Path key={x} d={`M${x} 100 l3 5 l3 -5 M${x} 114 l3 5 l3 -5`} stroke={dark} strokeOpacity={0.3} strokeWidth={1.6} fill="none" />
            ))}
          </>
        )}
        {a.outfit === 'uniform' && (
          <>
            <Path d="M41 73 L50 94 L59 73 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M38 74 L50 98 L41 104 L30 84 Z" fill="#1B2748" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
            <Path d="M62 74 L50 98 L59 104 L70 84 Z" fill="#1B2748" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
            <Path d="M48 80 L52 80 L54.5 102 L50 109 L45.5 102 Z" fill={colors.orange} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
            <Rect x={64} y={104} width={12} height={8} rx={1.5} fill={colors.gold} stroke={INK} strokeWidth={1.5} />
          </>
        )}
        {a.outfit === 'shirt' && (
          <>
            <Line x1={50} y1={86} x2={50} y2={132} stroke={INK} strokeWidth={1.8} opacity={0.55} />
            <Path d="M39 74 L50 88 L44 93 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M61 74 L50 88 L56 93 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M40 78 L52 108 L62 78" stroke={INK} strokeWidth={1.8} fill="none" />
            <Rect x={45} y={106} width={14} height={17} rx={2} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
            <Rect x={45} y={106} width={14} height={5} fill={colors.blue} />
            <Circle cx={52} cy={116} r={2.4} fill={INK} opacity={0.5} />
          </>
        )}
        {a.outfit === 'vest' && (
          <>
            <Path d="M42 100 L46 93 L50 100 L54 93 L58 100" stroke={colors.paper} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
            <Line x1={40} y1={104} x2={60} y2={104} stroke={colors.paper} strokeWidth={1.6} />
            <Path d="M4 132 C6 100 20 84 37 77 L40 132 Z" fill="#3D5A80" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Path d="M96 132 C94 100 80 84 63 77 L60 132 Z" fill="#3D5A80" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Rect x={14} y={104} width={15} height={10} fill={colors.red} stroke={INK} strokeWidth={1.5} transform="rotate(-8 21 109)" />
            <Polygon points="76,100 78.4,106 85,106 79.6,110 81.6,116.5 76,112.6 70.4,116.5 72.4,110 67,106 73.6,106" fill={colors.gold} stroke={INK} strokeWidth={1.3} />
            {[84, 91, 98].map((y) => (
              <Circle key={y} cx={35 - (y - 84) * 0.12} cy={y} r={1.6} fill="#D8D8E0" stroke={INK} strokeWidth={0.8} />
            ))}
            {[84, 91, 98].map((y) => (
              <Circle key={`r${y}`} cx={65 + (y - 84) * 0.12} cy={y} r={1.6} fill="#D8D8E0" stroke={INK} strokeWidth={0.8} />
            ))}
          </>
        )}
        {a.outfit === 'jacket' && (
          <>
            {[82, 92, 102, 112, 122].map((y) => (
              <Rect key={y} x={34} y={y} width={32} height={5} fill={colors.berry} />
            ))}
            <Path d="M4 132 C6 100 20 84 38 76 L44 100 L40 132 Z" fill="#26222F" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Path d="M96 132 C94 100 80 84 62 76 L56 100 L60 132 Z" fill="#26222F" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Line x1={22} y1={108} x2={34} y2={104} stroke="#D8D8E0" strokeWidth={2} />
            <Line x1={78} y1={108} x2={66} y2={104} stroke="#D8D8E0" strokeWidth={2} />
            <Circle cx={30} cy={92} r={2} fill="#D8D8E0" stroke={INK} strokeWidth={0.8} />
          </>
        )}
        {a.outfit === 'jersey' && (
          <>
            <Rect x={0} y={96} width={100} height={9} fill={colors.red} />
            <Rect x={0} y={105} width={100} height={3.5} fill={INK} />
            <Path d="M38 71 L50 86 L62 71" stroke={colors.red} strokeWidth={5} fill="none" strokeLinejoin="round" />
            <Path d="M46 78 L47.6 86 M50 79.5 L50 88 M54 78 L52.4 86" stroke={INK} strokeWidth={1.1} />
            <Path d="M41 113 L50 113 L50 118 L45.5 118 L45.5 120.5 L50 120.5 L50 130 L41 130 L41 125.5 L46 125.5 L46 124 L41 124 Z M54 113 L59 113 L59 130 L54 130 Z" fill={INK} />
          </>
        )}
        {a.outfit === 'santa' && (
          <>
            <Path d="M30 70 L50 82 L70 70 L74 80 L50 96 L26 80 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Rect x={44} y={90} width={12} height={42} fill="#FFFFFF" stroke={INK} strokeWidth={2.2} />
            <Rect x={0} y={116} width={100} height={9} fill={INK} />
            <Rect x={43} y={114} width={14} height={13} rx={2} fill={colors.gold} stroke={INK} strokeWidth={2.2} />
            <Rect x={47} y={118} width={6} height={5} fill={INK} />
          </>
        )}
        {a.outfit === 'tie' && (
          <>
            <Path d="M30 70 L38 70 L40 92 L60 92 L62 70 L70 70 L70 132 L30 132 Z" fill="#17141C" />
            <Path d="M0 70 H30 V132 H0 Z M70 70 H100 V132 H70 Z" fill={a.skin} />
            <Path d="M30 70 V132 M70 70 V132" stroke={INK} strokeWidth={2.4} />
            <Path d="M38 70 L40 92 L60 92 L62 70" stroke={INK} strokeWidth={2} fill="none" />
            <Path d="M47 76 L53 76 L54 81 L56.5 110 L50 119 L43.5 110 L46 81 Z" fill="#FF4FA3" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M46 86 L54.6 90 M45.4 95 L55.4 99.6 M44.8 104 L56 109" stroke={INK} strokeWidth={2.2} />
            <Path d="M46 71 L54 71 L53.4 78 L46.6 78 Z" fill="#FF4FA3" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          </>
        )}
        {a.outfit === 'labcoat' && (
          <>
            <Path d="M38 68 L50 96 L62 68 Z" fill="#1FBF8F" />
            <Path d="M0 68 L38 68 L50 100 L50 132 L0 132 Z M100 68 L62 68 L50 100 L50 132 L100 132 Z" fill="#FFFFFF" />
            <Path d="M38 68 L50 100 L62 68 M50 100 V132" stroke={INK} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
            <Path d="M36 70 L44 92 L37 96 L30 78 Z M64 70 L56 92 L63 96 L70 78 Z" fill="#E7ECF4" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Rect x={58} y={104} width={14} height={10} rx={1.5} fill="#E7ECF4" stroke={INK} strokeWidth={1.8} />
            <Path d="M62 104 V98 M66 104 V96" stroke={colors.blue} strokeWidth={2.2} strokeLinecap="round" />
            <Circle cx={54} cy={110} r={1.5} fill={INK} />
            <Circle cx={54} cy={122} r={1.5} fill={INK} />
          </>
        )}
        {a.outfit === 'scrubs' && (
          <>
            <Path d="M38 68 L50 90 L62 68 Z" fill={a.skin} />
            <Path d="M38 68 L50 90 L62 68" stroke={INK} strokeWidth={2.4} fill="none" strokeLinejoin="round" />
            <Path d="M40 68 L50 86 L60 68" stroke="#FFFFFF" strokeWidth={1.6} fill="none" opacity={0.6} />
            <Rect x={56} y={102} width={15} height={12} rx={1.5} fill="#000" opacity={0.14} stroke={INK} strokeWidth={1.8} />
            <Path d="M60 102 V96" stroke={colors.red} strokeWidth={2.4} strokeLinecap="round" />
            <Path d="M34 72 C30 96 38 106 46 108 M66 72 C70 92 66 100 60 100" stroke={INK} strokeWidth={4.6} fill="none" strokeLinecap="round" />
            <Path d="M34 72 C30 96 38 106 46 108 M66 72 C70 92 66 100 60 100" stroke="#8A93A8" strokeWidth={2.2} fill="none" strokeLinecap="round" />
            <Circle cx={48} cy={109} r={4.2} fill="#D8D8E0" stroke={INK} strokeWidth={2} />
          </>
        )}
        {a.outfit === 'tee' && (
          <>
            <Path d="M39 75 Q50 88 61 75" stroke={dark} strokeOpacity={0.5} strokeWidth={3} fill="none" />
            <Polygon points="50,97 44,109 50,109 46,121 57,106 51,106 55,97" fill="#FF4FA3" stroke={INK} strokeWidth={1.2} />
          </>
        )}
       </G>
        {/* hard shadow down the right side, and under the chin: the cel-shaded look */}
        <Path d="M58 75 L69 79 C87 84 91 97 91 130 L70 130 C72 106 67 88 58 75 Z" fill="#000" opacity={0.3} />
        <Path d="M42 75 L58 75 L56.5 83 L50 86 L44 81.5 Z" fill="#000" opacity={0.24} />
        {/* where the arms meet the body */}
        <Path d={fem ? 'M27 130 C27 116 28 108 31 101 M73 130 C73 116 72 108 69 101' : 'M22 130 C22 115 23 106 27 98 M78 130 C78 115 77 106 73 98'} stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7} />
      </G>
      <Path d={TORSO} fill="none" stroke={INK} strokeWidth={3} />
    </G>
  );
}

type Av = NonNullable<Character['avatar']>;
const MIRROR = 'translate(100 0) scale(-1 1)';
const MOUTH = '#6E1A26';
// Realistic proportions: a long head, eyes halfway down, an angular jaw.
const HEAD = 'M33 38 C33 16 67 16 67 38 L66 50 L62.5 58 L54.5 66 L45.5 66 L37.5 58 L34 50 Z';
const HEAD_SOFT = 'M33.4 38 C33.4 16 66.6 16 66.6 38 L65.6 49 C64 57 57.5 62.5 52.5 66 L47.5 66 C42.5 62.5 36 57 34.4 49 Z';
// The hair was drawn for a wider head; this fits it to the narrow one
const HAIR_FIT = 'translate(8 0) scale(0.84 0.9)';
const EYE_Y = 42;

/** A narrow, sharp eye: heavy upper lid, small iris tucked under it */
function Eye({ cx, flip, a, m, shut, far }: { cx: number; flip?: boolean; a: Av; m: string; shut?: boolean; far?: boolean }) {
  if (shut) return <Path d={`M${cx - 4.8} ${EYE_Y + 1} Q${cx} ${EYE_Y - 3} ${cx + 4.8} ${EYE_Y + 1}`} stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />;
  const has = (x: string) => a.extras?.includes(x);
  const round = a.eyeStyle !== 'sharp';
  const sy = (round ? 1.28 : 1) * (m === 'sad' ? 0.86 : m === 'angry' ? 0.8 : m === 'question' || m === 'excited' ? 1.16 : 1);
  return (
    <G transform={`translate(${cx} ${EYE_Y}) scale(${(flip ? -1 : 1) * (round ? 1.1 : 1.04) * (far ? 0.78 : 1)} ${sy})`}>
      <Path d="M-4.8 0.6 L-3 -2.2 L2.5 -2.6 L4.8 -1 L3.2 2 L-2.6 2.2 Z" fill="#FFFFFF" />
      <Circle cx={0.2} cy={-0.3} r={2.3} fill={a.eyes ?? '#5A3A22'} stroke={INK} strokeWidth={0.7} />
      <Circle cx={0.2} cy={-0.3} r={1} fill={INK} />
      <Circle cx={flip ? 0.9 : -0.6} cy={-1.1} r={0.62} fill="#FFFFFF" />
      {/* the lid: a solid wedge of ink, heavier at the outer corner */}
      <Path d="M-6 1.2 L-3.4 -2.9 L2.7 -3.4 L5.6 -1.2 L2.5 -2.1 L-2.8 -1.7 L-4.9 1 Z" fill={INK} stroke={INK} strokeWidth={0.7} strokeLinejoin="round" />
      {has('lashes') && <Path d="M-6 1.2 L-7.6 -0.6 M-4.6 -1.4 L-6.2 -3" stroke={INK} strokeWidth={1.1} strokeLinecap="round" />}
      <Path d="M-2.8 2.7 L3.2 2.5" stroke={INK} strokeWidth={has('eyeliner') ? 1.7 : 0.8} opacity={has('eyeliner') ? 1 : 0.6} strokeLinecap="round" />
    </G>
  );
}

/** Thin tapered brows, drawn over the fringe so the expression always reads */
function Brows({ m, a }: { m: string; a: Av }) {
  const has = (x: string) => a.extras?.includes(x);
  const flat = 'M36.4 38.4 L41 35.8 L47.6 37.2 L47.4 38.7 L41 37.5 Z';
  const angry = 'M36.4 36 L42 36.4 L48 39.6 L47.4 41 L41.6 38.2 Z';
  const sad = 'M36.4 39.8 L41 37 L47.4 35.2 L47.6 36.7 L41.4 38.6 Z';
  const d = m === 'angry' ? angry : m === 'sad' ? sad : flat;
  const lift = m === 'excited' ? -1.8 : 0;
  const p = { fill: INK, stroke: INK, strokeWidth: has('thickbrows') ? 1.5 : has('thinbrows') ? 0 : 0.6, strokeLinejoin: 'round' as const };
  return (
    <G>
      {a.hairStyle !== 'emo' && <Path d={d} {...p} transform={`translate(0 ${lift})`} />}
      <G transform={MIRROR}>
        <Path d={d} {...p} transform={`translate(0 ${m === 'question' ? -2.8 : m === 'wink' ? 1 : lift})`} />
      </G>
    </G>
  );
}

function Face({ m, a }: { m: string; a: Av }) {
  const has = (x: string) => a.extras?.includes(x);
  const turn = a.turn ?? 0;
  return (
    <G>
      {has('freckles') && [38, 40.2, 42.4, 57.6, 59.8, 62].map((x, i) => <Circle key={x} cx={x} cy={i % 3 === 1 ? 49.4 : 48} r={0.6} fill="#8A4B2A" opacity={0.75} />)}
      {has('wrinkles') &&
        [0, 1].map((i) => (
          <G key={i} transform={i ? MIRROR : undefined} opacity={0.55}>
            <Path d="M36.2 41 l-1.6 -1 M36 43 l-1.8 0.3 M44.6 53 Q43 56 44.4 59.4 M38 46.4 Q41 47.6 44 46.6" stroke={INK} strokeWidth={0.8} fill="none" strokeLinecap="round" />
          </G>
        ))}
      {has('mole') && <Circle cx={61} cy={47.2} r={0.8} fill={INK} />}
      {(m === 'wink' || has('blush')) && (
        <>
          <Path d="M36.4 49 l1.6 -1.6 M38.4 49.6 l1.6 -1.6 M40.4 50.2 l1.6 -1.6" stroke="#D93A57" strokeWidth={0.8} strokeLinecap="round" opacity={0.8} />
          <Path d="M58 50.2 l1.6 -1.6 M60 49.6 l1.6 -1.6 M62 49 l1.6 -1.6" stroke="#D93A57" strokeWidth={0.8} strokeLinecap="round" opacity={0.8} />
        </>
      )}

      {/* eye-socket shadow on the dark side of the face */}
      <Path d="M52.6 38.6 L63 37.6 L64.4 41 L62 44.6 L53 43 Z" fill="#000" opacity={0.1} />
      <Eye cx={42.5 + (turn === -1 ? 0.9 : 0)} a={a} m={m} shut={m === 'excited'} far={turn === -1} />
      <Eye cx={57.5 - (turn === 1 ? 0.9 : 0)} flip a={a} m={m} shut={m === 'excited' || m === 'wink'} far={turn === 1} />

      {/* nose: one line down the bridge and a wedge of shadow */}
      <G transform={turn === -1 ? 'translate(100 0) scale(-1 1)' : undefined}>
        <Path d={turn ? 'M50.6 44.4 L53.8 51.8 L50.4 53.4' : 'M51 44.4 L52.7 52.2 L50.2 53.3'} stroke={INK} strokeWidth={1.25} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {!turn && <Path d="M51.3 45 L54.4 52.4 L52.2 53.4 L52.7 52.2 Z" fill="#000" opacity={0.2} />}
      </G>

      {m === 'sad' ? (
        <Path d="M45.6 60.2 Q50 57.4 55 60.4" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ) : m === 'excited' ? (
        <>
          <Path d="M44.4 57.2 L56.2 56.8 Q55 63.4 50.2 63.6 Q45.8 63.4 44.4 57.2 Z" fill={MOUTH} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
          <Path d="M45.3 57.8 L55.4 57.5 L54.9 59.3 L45.8 59.5 Z" fill="#FFFFFF" />
        </>
      ) : m === 'question' ? (
        <Path d="M48 57.6 L52.8 57.4 L52.2 60.6 L48.6 60.6 Z" fill={MOUTH} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      ) : m === 'angry' ? (
        <>
          <Path d="M45 57.4 L55.6 57 L54.6 60.8 L46 61 Z" fill="#FFFFFF" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
          <Path d="M45.6 59.1 L55 58.8" stroke={INK} strokeWidth={0.9} />
        </>
      ) : m === 'wink' ? (
        <Path d="M45.4 59.2 Q51.5 61.4 56.8 56.4" stroke={INK} strokeWidth={1.7} fill="none" strokeLinecap="round" />
      ) : (
        <Path d="M45.2 58.2 Q50 61 55.8 57.6" stroke={INK} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      )}
      {/* lower lip */}
      {m !== 'excited' && <Path d="M48.2 62.4 L52.2 62.2" stroke={INK} strokeWidth={0.9} opacity={0.35} strokeLinecap="round" />}
    </G>
  );
}

// Fringes. Each is one closed shape so the shadow and the shine can be clipped to it.
const FRINGE: Record<string, string> = {
  bob: 'M26 46 C19 0 81 0 74 46 L70 34 L66 41 L62 31 L56 40 L51 30 L45 40 L40 31 L35 41 L31 34 Z',
  short: 'M28 43 C21 2 79 2 72 43 L68 33 L61 28 L52 33 L44 28 L35 35 Z',
  pony: 'M27 45 C19 0 81 0 73 42 L69 32 C61 25 50 27 44 36 L38 43 L36 35 L31 45 Z',
  bun: 'M27 45 C21 4 79 4 73 45 C69 33 59 27 50 27 C41 27 31 33 27 45 Z',
  long: 'M27 48 C19 0 81 0 73 48 L68 36 C62 26 54 25 50 31 C46 25 38 26 32 36 Z',
  emo: 'M26 47 C17 0 83 0 74 43 L70 33 C62 28 55 33 49 50 L45 59 L40 52 L35 59 L33 49 L29 53 Z',
  wolfcut: 'M27 46 C18 -2 82 -2 73 46 L69 33 L64 41 L60 30 L55 40 L50 29 L45 40 L40 30 L36 41 L31 33 Z',
  swept: 'M27 47 C18 0 80 -2 73 42 L68 33 C59 26 50 29 44 40 L40 50 L36 61 L30 59 C32 53 30 50 27 47 Z',
  undercut: 'M32 34 C27 2 75 0 69 34 L62 24 L55 32 L48 21 L41 32 Z',
  sidelocks: 'M27 46 C19 0 81 0 73 46 L70 35 L66 42 L61 31 L55 43 L50 32 L45 42 L40 31 L35 41 L31 35 Z',
};
// Fine ink lines that suggest separate locks
const STRANDS: Record<string, string> = {
  bob: 'M38 13 Q35 22 37 31 M62 13 Q65 22 63 30 M50 11 L50.6 28',
  short: 'M40 12 Q38 20 42 27 M58 12 Q61 20 56 28',
  pony: 'M40 12 Q46 22 62 26 M34 20 Q40 28 52 28',
  bun: 'M50 27 L50 9 M40 29 Q37 19 43 11 M60 29 Q63 19 57 11',
  long: 'M50 30 L50 10 M38 13 Q33 24 33 36 M62 13 Q67 24 67 36',
  emo: 'M40 12 Q34 30 37 54 M48 10 Q42 30 43 54 M62 14 Q66 24 68 32',
  wolfcut: 'M38 11 Q35 20 38 30 M62 11 Q65 20 62 30 M50 9 L50 27 M44 10 L43 30 M56 10 L57 30',
  swept: 'M36 14 Q32 34 34 56 M46 11 Q38 28 39 48 M58 11 Q52 20 46 36',
  undercut: 'M44 10 L45 28 M56 9 L56 28',
  sidelocks: 'M40 11 Q36 20 39 30 M50 9 L50 30 M60 11 Q64 20 61 30 M45 10 L44 40',
};
// Locks that hang in front of the ears
const SIDES: Record<string, string> = {
  bob: 'M29.5 36 C24 46 24 60 27 69 L33 62 L32 42 Z M70.5 36 C76 46 76 60 73 69 L67 62 L68 42 Z',
  pony: 'M30 39 L27 61 L32.5 53 Z M70 39 L73 59 L67.5 52 Z',
  wolfcut: 'M30 40 L24 67 L31.5 60 L33 46 Z M70 40 L76 67 L68.5 60 L67 46 Z',
  long: 'M30 40 L27 70 L33 64 Z M70 40 L73 70 L67 64 Z',
  sidelocks: 'M30.5 38 L25 78 L31 71 L34 46 Z M69.5 38 L75 78 L69 71 L66 46 Z',
};
const BACK: Record<string, string> = {
  bob: 'M25 42 C19 2 81 2 75 42 L79 68 C73 73 66 71 64 66 L64 46 L36 46 L36 66 C34 71 27 73 21 68 Z',
  pony: 'M64 16 C92 8 101 46 85 74 C84 62 79 57 72 55 C81 42 77 30 63 27 Z',
  long: 'M25 40 C19 0 81 0 75 40 L83 108 L64 102 L64 46 L36 46 L36 102 L17 108 Z',
  emo: 'M26 42 C21 6 79 6 74 42 L76 63 L64 65 L64 44 L36 44 L36 65 L24 63 Z',
  wolfcut: 'M25 40 C19 0 81 0 75 40 L83 66 L75 61 L79 81 L69 73 L67 86 L64 72 L64 46 L36 46 L36 72 L33 86 L31 73 L21 81 L25 61 L17 66 Z',
  swept: 'M62 26 C82 26 88 48 80 61 L72 53 C76 45 72 37 62 35 Z',
  sidelocks: 'M25 42 C19 2 81 2 75 42 L75 58 L64 60 L64 46 L36 46 L36 60 L25 58 Z M64 56 C82 58 90 74 84 94 L77 82 C77 74 73 68 64 66 Z',
};

/** Things a character carries that sit behind the body: Pekka's axe, Jere's guitar */
function PropBehind({ kind }: { kind?: string }) {
  if (kind === 'axe') {
    return (
      <G>
        <Line x1={81} y1={130} x2={91} y2={36} stroke={INK} strokeWidth={8.5} strokeLinecap="round" />
        <Line x1={81} y1={130} x2={91} y2={36} stroke="#B5793A" strokeWidth={4.5} strokeLinecap="round" />
        <Path d="M84 28 L99 22 C104 31 104 43 100 51 L85 44 Z" fill="#C9D1DC" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <Path d="M96 25 C101 33 101 42 98 48 L102 50 C105 42 105 31 100 22 Z" fill="#FFFFFF" />
        <Path d="M84 28 L99 22 C104 31 104 43 100 51 L85 44 Z" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      </G>
    );
  }
  if (kind === 'guitar') {
    return (
      <G>
        <Line x1={19} y1={130} x2={10} y2={44} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <Line x1={19} y1={130} x2={10} y2={44} stroke="#6B4423" strokeWidth={5} strokeLinecap="round" />
        {[62, 76, 90, 104].map((y) => (
          <Line key={y} x1={9.5 + (y - 44) * 0.105} y1={y} x2={15 + (y - 44) * 0.105} y2={y - 0.6} stroke="#D8D8E0" strokeWidth={1.3} />
        ))}
        <Path d="M2 22 L15 20 L17 46 L5 48 Z" fill="#E0102F" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        {[27, 34, 41].map((y) => (
          <Circle key={y} cx={1.5} cy={y} r={2.1} fill="#D8D8E0" stroke={INK} strokeWidth={1.2} />
        ))}
      </G>
    );
  }
  return null;
}

function Person({ c, mood }: { c: Character; mood: Mood }) {
  const a = c.avatar as Av;
  const m = norm(mood);
  const has = (x: string) => a.extras?.includes(x);
  const hs = a.hairStyle;
  const fringe = FRINGE[hs];
  const clip = `hair-${c.id}`;
  const hat = a.hat ?? '#4A5A7A';
  const fem = c.voice.gender === 'f';
  const turn = a.turn ?? 0;
  // the head is a little larger than life and can tilt; both pivot on the chin
  const headT = `rotate(${a.tilt ?? 0} 50 66) translate(50 66) scale(1.12) translate(-50 -66)`;
  const faceT = `translate(${turn * 2.6} 0)`;
  const outline = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const };
  const thin = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' as const };
  return (
    <G>
      <PropBehind kind={a.prop} />

      {/* hair behind the head */}
      <G transform={headT}>
      <G transform={HAIR_FIT}>
        {BACK[hs] && <Path d={BACK[hs]} fill={a.hair} {...outline} />}
        {BACK[hs] && hs !== 'pony' && hs !== 'swept' && hs !== 'sidelocks' && <Path d="M64 46 L64 70 L78 66 L75 40 Z" fill="#000" opacity={0.3} />}
        {hs === 'pony' && (
          <>
            <Path d="M72 22 C86 26 90 46 84 62" stroke={INK} strokeWidth={1.2} opacity={0.5} fill="none" />
            <Path d="M80 22 C92 34 92 54 85 72 C84 62 80 58 76 56 C84 44 84 32 80 22 Z" fill="#000" opacity={0.25} />
            <Circle cx={66} cy={22} r={4.6} fill={colors.berry} stroke={INK} strokeWidth={2.2} />
          </>
        )}
        {hs === 'bun' && (
          <>
            <Circle cx={50} cy={12} r={10.5} fill={a.hair} stroke={INK} strokeWidth={3} />
            <Path d="M50 1.5 A10.5 10.5 0 0 1 50 22.5 A14 14 0 0 0 50 1.5 Z" fill="#000" opacity={0.22} />
            <Path d="M43 10 Q50 5 57 10" stroke={INK} strokeWidth={1.1} opacity={0.5} fill="none" />
          </>
        )}
        {a.prop === 'needles' &&
          [
            [34, 2, 64, 20],
            [66, 2, 36, 20],
          ].map(([x1, y1, x2, y2]) => (
            <G key={x1}>
              <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={4.6} strokeLinecap="round" />
              <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.gold} strokeWidth={2} strokeLinecap="round" />
              <Circle cx={x1} cy={y1} r={2.8} fill={colors.red} stroke={INK} strokeWidth={1.5} />
            </G>
          ))}
      </G>
      </G>

      <Outfit a={a} id={c.id} fem={fem} />
      {a.prop === 'headphones' && (
        <>
          <Path d="M36 78 Q50 94 64 78" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d="M36 78 Q50 94 64 78" stroke="#9B6BFF" strokeWidth={4} fill="none" strokeLinecap="round" />
          <Rect x={29} y={69} width={10.5} height={15} rx={4} fill="#26222F" stroke={INK} strokeWidth={2.4} />
          <Rect x={60.5} y={69} width={10.5} height={15} rx={4} fill="#26222F" stroke={INK} strokeWidth={2.4} />
          <Rect x={31.4} y={72} width={2.8} height={9} rx={1.4} fill="#9B6BFF" />
        </>
      )}

      {/* neck, with the jaw's hard shadow across it */}
      <Path d={fem ? 'M43.6 56 L43.2 77 Q50 81 56.8 77 L56.4 56 Z' : 'M41.6 56 L41.2 76 Q50 81 58.8 76 L58.4 56 Z'} fill={a.skin} {...thin} />
      <Path d={fem ? 'M43.6 60 L56.4 60 L56.6 75 L50.6 71.5 L43.4 70 Z' : 'M41.6 60 L58.4 60 L58.6 75 L51 71.5 L41.4 70 Z'} fill="#000" opacity={0.34} />
      {has('pearls') && [44.4, 47.2, 50, 52.8, 55.6].map((x, i) => <Circle key={x} cx={x} cy={77 + [0, 1.6, 2.2, 1.6, 0][i]} r={1.9} fill="#FFFFFF" stroke={INK} strokeWidth={1} />)}
      {has('necktattoo') && <Path d="M46.4 72 l2.4 2.4 l-2.4 2.4 l-2.4 -2.4 Z M49.2 74.4 L53 74.4 M54.6 72.2 l1.6 2.2 l-1.6 2.2" stroke={INK} strokeWidth={1.1} fill="none" opacity={0.8} strokeLinejoin="round" />}
      {has('chain') && <Path d="M41 77 Q50 91 59 77" stroke="#D8D8E0" strokeWidth={2} fill="none" strokeDasharray="2.5 1.5" />}

      <G transform={headT}>
      {/* ears, then the head. The far ear disappears when the head is turned. */}
      {[0, 1].filter((i) => !(turn === 1 && i === 1) && !(turn === -1 && i === 0)).map((i) => (
        <G key={i} transform={i ? MIRROR : undefined}>
          <Path d="M33.8 39.6 C29.4 38 29.8 49.6 34.6 50.4 Z" fill={a.skin} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <Path d="M32.8 42.4 Q31.4 44.6 33 47.4" stroke={INK} strokeWidth={0.8} opacity={0.5} fill="none" />
        </G>
      ))}
      <Path d={a.jaw === 'soft' ? HEAD_SOFT : HEAD} fill={a.skin} {...thin} />
      {/* hard shadows: the far side of the face, under the fringe, under the cheekbone */}
      <G transform={turn === -1 ? MIRROR : undefined}>
        <Path d={turn ? 'M62.5 23 C66 26 67 32 67 38 L66 50 L62.5 58 L54.5 66 L53.4 66 L60.4 57 L63.6 48 C64.4 38 64.4 30 62.5 23 Z' : 'M60.5 22 C65 25 67 31 67 38 L66 50 L62.5 58 L54.5 66 L52.4 66 L58.6 57 L61.6 48 C62.6 38 62.8 30 60.5 22 Z'} fill="#000" opacity={0.24} />
      </G>
      <Path d="M33.4 36 C36 27 64 27 66.6 36 L66.8 30 C63 21 37 21 33.2 30 Z" fill="#000" opacity={0.16} />
      {a.jaw !== 'soft' && <Path d="M35 50.6 L38.6 52.4 L41 58.6 L38 58 Z" fill="#000" opacity={0.12} />}
      {hs === 'undercut' && <Path d="M33.4 40 C33 31 35 26 39 23 L39 36 Z M66.6 40 C67 31 65 26 61 23 L61 36 Z" fill="#000" opacity={0.3} />}
      {hs === 'swept' && <Path d="M66.8 31 L66.4 44 L62.4 36 Z" fill="#000" opacity={0.34} />}
      {has('stubble') && <Path d="M34 49 L37.5 58 L45.5 66 L54.5 66 L62.5 58 L66 49 C62 56 57 61.5 50 61.5 C43 61.5 38 56 34 49 Z M44 55.8 Q50 53.4 56 55.8 L55 56.8 Q50 55.4 45 56.8 Z" fill="#000" opacity={0.2} />}
      {has('beard') && (
        <>
          <Path d="M33.4 45 L34 50 L37.5 58.4 L45.5 67 L54.5 67 L62.5 58.4 L66 50 L66.6 45 L63 52.4 C60 55.4 56 54.6 50 54.6 C44 54.6 40 55.4 37 52.4 Z" fill={a.hair} {...thin} />
          <Path d="M45 57 Q50 55.6 55.6 57 Q55 61.6 50 61.8 Q45.4 61.6 45 57 Z" fill={a.skin} />
        </>
      )}
      {has('bigbeard') && (
        <>
          <Path
            d="M33.2 44 L34 50 C33 62 38 74 42 77 L44.5 73 L47 82 L50 75.5 L53 82 L55.5 73 L58 77 C62 74 67 62 66 50 L66.8 44 L62.5 51.6 C59 54.6 55 53.8 50 53.8 C45 53.8 41 54.6 37.5 51.6 Z"
            fill={a.hair}
            {...thin}
          />
          <Path d="M57 55 C62 55 64.6 52 66.8 46 C67.6 60 62.6 73.6 58 77 L55.5 73 L53 82 C56.4 73 59 64 57 55 Z" fill="#000" opacity={0.28} />
          <Path d="M40 60 Q41 68 43.6 72 M50 64 L50 74 M60 60 Q59 68 56.4 72" stroke={INK} strokeWidth={1} opacity={0.45} fill="none" strokeLinecap="round" />
          <Path d="M45 56.6 Q50 55.4 55.6 56.6 Q55 61.4 50 61.6 Q45.4 61.4 45 56.6 Z" fill={a.skin} />
        </>
      )}

      <G transform={faceT}>
      <Face m={m} a={a} />

      {has('moustache') && <Path d="M41.6 56.6 Q46.5 52.4 50 55.2 Q53.5 52.4 58.4 56.6 Q53.5 58 50 56.6 Q46.5 58 41.6 56.6 Z" fill={a.hair} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />}
      {has('goatee') && <Path d="M46 62.4 Q50 61 54 62.4 L52.4 66.4 L47.6 66.4 Z" fill={a.hair} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />}
      {has('glasses') && (
        <>
          <Circle cx={42.5} cy={EYE_Y + 0.4} r={6} fill="#FFFFFF" fillOpacity={0.2} stroke={INK} strokeWidth={1.9} />
          <Circle cx={57.5} cy={EYE_Y + 0.4} r={6} fill="#FFFFFF" fillOpacity={0.2} stroke={INK} strokeWidth={1.9} />
          <Path d="M48.5 41.6 Q50 40.6 51.5 41.6 M36.5 41.6 L33.6 40.6 M63.5 41.6 L66.4 40.6" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M39 40 L41.4 37.8 M54 40.4 L57 37.8" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.8} strokeLinecap="round" />
        </>
      )}
      {has('earring') && turn !== -1 && <Circle cx={31.6 - turn * 2.6} cy={51.6} r={2.2} fill={colors.gold} stroke={INK} strokeWidth={1.3} />}
      {has('liprings') && (
        <>
          <Circle cx={46.6} cy={59.8} r={0.95} fill="none" stroke="#E4E4EC" strokeWidth={0.9} />
          <Circle cx={54} cy={59.4} r={0.95} fill="none" stroke="#E4E4EC" strokeWidth={0.9} />
        </>
      )}
      {has('lipring') && <Circle cx={46.4} cy={60} r={1.2} fill="none" stroke="#D8D8E0" strokeWidth={1.1} />}
      </G>

      {/* hair in front */}
      <G transform={HAIR_FIT}>
        {SIDES[hs] && <Path d={SIDES[hs]} fill={a.hair} stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />}
        {fringe && (
          <>
            <Defs>
              <ClipPath id={clip}>
                <Path d={fringe} />
              </ClipPath>
            </Defs>
            <Path d={fringe} fill={a.hair} />
            <G clipPath={`url(#${clip})`}>
              <Path d="M58 -4 C82 8 82 40 78 72 L64 72 C70 46 70 20 58 -4 Z" fill="#000" opacity={0.3} />
              {hs === 'emo' && <Path d="M55 4 L65 8 L49 52 L43 60 Z" fill={c.color} />}
              {has('streak') && <Path d="M34 14 L41 10 L37 40 L31 44 Z" fill="#FF4FA3" />}
              <Path d="M27 31 L33 23 L36 28 L42 19 L45 25 L52 17 L54 24 L45 31 L42 27 L36 34 L33 30 Z" fill="#FFFFFF" opacity={0.3} />
              {STRANDS[hs] && <Path d={STRANDS[hs]} stroke={INK} strokeWidth={1.2} opacity={0.5} fill="none" strokeLinecap="round" />}
            </G>
            <Path d={fringe} fill="none" {...outline} />
          </>
        )}
        {hs === 'curly' && (
          <>
            <G fill={a.hair} stroke={INK} strokeWidth={3}>
              <Circle cx={30.5} cy={37} r={7.5} />
              <Circle cx={69.5} cy={37} r={7.5} />
              <Circle cx={33} cy={26} r={9} />
              <Circle cx={67} cy={26} r={9} />
              <Circle cx={41} cy={17} r={9.5} />
              <Circle cx={59} cy={17} r={9.5} />
              <Circle cx={50} cy={14} r={9} />
              <Path d="M31 36 C33 18 67 18 69 36 C62 30 38 30 31 36 Z" stroke="none" />
            </G>
            <Path d="M36 22 a5 5 0 0 1 8 -4 M48 12 a5 5 0 0 1 8 0 M32 34 a4 4 0 0 1 5 -4 M60 20 a5 5 0 0 1 7 4" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.4} fill="none" strokeLinecap="round" />
            <Path d="M63 9 C76 14 79 30 75 42 C72 34 70 24 63 9 Z" fill="#000" opacity={0.25} />
          </>
        )}
        {hs === 'cap' && (
          <>
            <Path d="M29 40 L28.5 51 L33 46 L33 39 Z M71 40 L71.5 51 L67 46 L67 39 Z" fill={a.hair} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Path d="M27 31 C24 -2 76 -2 73 31 Z" fill={a.shirt} {...outline} />
            <Path d="M58 8 C70 12 73 22 73 31 L64 31 C65 22 63 14 58 8 Z" fill="#000" opacity={0.3} />
            <Path d="M24 29 L78 29 L89 36 L24 36 Z" fill={INK} />
            <Path d="M27 30.6 L76 30.6" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.35} />
            <Path d="M43 12 L57 12 L55 24 L50 27 L45 24 Z" fill={colors.gold} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
            <Path d="M47 16 h6 M47 19.5 h6" stroke={INK} strokeWidth={1.3} />
          </>
        )}
        {hs === 'santa' && (
          <>
            <Path d="M29 38 L26 56 L33 50 L33 38 Z M71 38 L74 56 L67 50 L67 38 Z" fill={a.hair} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Path d="M26 28 C24 4 52 -8 74 6 C90 16 96 34 94 50 L84 50 C84 36 80 28 72 24 L74 28 Z" fill={colors.red} {...outline} />
            <Path d="M60 0 C82 8 94 28 94 50 L88 50 C88 30 78 12 60 0 Z" fill="#000" opacity={0.28} />
            <Circle cx={89} cy={54} r={7.5} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
            <Rect x={22} y={21} width={56} height={13} rx={6.5} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
            <Path d="M30 30 q4 -4 8 0 M46 30 q4 -4 8 0 M62 30 q4 -4 8 0" stroke="#BCD2EC" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          </>
        )}
        {hs === 'beanie' && (
          <>
            <Path d="M29 38 L27 54 L32.5 48 L33 38 Z M71 38 L73 54 L67.5 48 L67 38 Z" fill={a.hair} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <Path d="M26 30 C21 -6 79 -6 74 30 Z" fill={hat} {...outline} />
            <Path d="M58 4 C72 8 76 20 74 30 L65 30 C67 20 64 11 58 4 Z" fill="#000" opacity={0.3} />
            <Path d="M36 9 L44 4 L47 7 L40 12 Z" fill="#FFFFFF" opacity={0.28} />
            <Rect x={24} y={22.5} width={52} height={11.5} rx={3.5} fill={hat} stroke={INK} strokeWidth={3} />
            <Rect x={24} y={22.5} width={52} height={11.5} rx={3.5} fill="#FFFFFF" opacity={0.2} />
            {[31, 38, 45, 52, 59, 66].map((x) => (
              <Line key={x} x1={x} y1={24.3} x2={x} y2={32.3} stroke={INK} strokeWidth={1.4} opacity={0.5} />
            ))}
          </>
        )}
        {a.prop === 'pencil' && (
          <G>
            <Line x1={67} y1={23} x2={80} y2={45} stroke={INK} strokeWidth={5.6} strokeLinecap="round" />
            <Line x1={67.5} y1={24} x2={78.6} y2={42.6} stroke={colors.gold} strokeWidth={3} strokeLinecap="butt" />
            <Line x1={67} y1={23} x2={68.2} y2={25} stroke="#FF8FA3" strokeWidth={3} strokeLinecap="round" />
          </G>
        )}
      </G>

      <G transform={faceT}>
        <Brows m={m} a={a} />
        {has('browring') && <Circle cx={61} cy={36.4} r={1.4} fill="none" stroke="#E4E4EC" strokeWidth={1.2} />}
      </G>
      </G>

      <MoodMark mood={m} x={84} y={22} />
    </G>
  );
}

/** Comic marks around the head: sparkles, a sweat drop, a question mark */
function MoodMark({ mood, x, y, scale = 1 }: { mood: string; x: number; y: number; scale?: number }) {
  if (mood === 'excited') {
    return (
      <G transform={`translate(${x} ${y}) scale(${scale})`}>
        <Polygon points="0,-9 2.4,-2.4 9,0 2.4,2.4 0,9 -2.4,2.4 -9,0 -2.4,-2.4" fill={colors.gold} stroke={INK} strokeWidth={1.6} />
        <Polygon points="-66,6 -64.6,10 -60,11.4 -64.6,12.8 -66,17 -67.4,12.8 -72,11.4 -67.4,10" fill={colors.gold} stroke={INK} strokeWidth={1.3} />
      </G>
    );
  }
  if (mood === 'sad') {
    return (
      <G transform={`translate(${x - 8} ${y + 10}) scale(${scale})`}>
        <Path d="M0 -8 C5 0 6 4 0 7 C-6 4 -5 0 0 -8 Z" fill="#7FD4FF" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      </G>
    );
  }
  if (mood === 'wink') {
    return (
      <G transform={`translate(${x} ${y}) scale(${scale})`}>
        <Path d="M0 6 C-9 -1 -5 -8 0 -3 C5 -8 9 -1 0 6 Z" fill={colors.berry} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      </G>
    );
  }
  if (mood === 'angry') {
    return (
      <G transform={`translate(${x} ${y}) scale(${scale})`}>
        <Path d="M-7 -2 Q-2 -2 -2 -7 M2 -7 Q2 -2 7 -2 M7 2 Q2 2 2 7 M-2 7 Q-2 2 -7 2" stroke={colors.red} strokeWidth={3} fill="none" strokeLinecap="round" />
      </G>
    );
  }
  if (mood === 'question') {
    return (
      <G transform={`translate(${x} ${y}) scale(${scale})`}>
        <Circle r={11.5} fill={colors.gold} stroke={INK} strokeWidth={2.4} />
        <Path d="M-4 -3.5 C-4 -9 4 -9 4 -3.5 C4 -0.5 0 -0.5 0 3" stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" />
        <Circle cx={0} cy={7} r={1.7} fill={INK} />
      </G>
    );
  }
  return null;
}

// ── The mascot: a fluffy white seal pup, drawn in a 120 × 120 box ───────────

function SealShapes({ mood }: { mood: Mood }) {
  const m = norm(mood);
  const up = m === 'excited';
  return (
    <G>
      <Path d="M95 96 C108 86 119 92 113 101 C120 107 110 116 98 108 Z" fill="#FFFFFF" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <Path d="M104 100 L112 101" stroke="#BCD2EC" strokeWidth={2} strokeLinecap="round" />
      <Path d={up ? 'M26 66 C10 56 6 40 15 34 C23 42 29 52 31 64 Z' : 'M22 80 C10 82 8 94 17 97 C24 94 28 88 28 82 Z'} fill="#FFFFFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <Path d={up ? 'M94 66 C110 56 114 40 105 34 C97 42 91 52 89 64 Z' : 'M98 80 C110 82 112 94 103 97 C96 94 92 88 92 82 Z'} fill="#E3EDF8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {/* body with three tufts of fluff on top */}
      <Path
        d="M17 92 C5 60 26 22 56 22 Q57 13 64 14 Q61 18 64 22 C94 23 115 60 103 92 C98 113 22 113 17 92 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path d="M82 28 C98 37 112 64 103 92 C100 106 86 110 70 110 C89 100 97 80 95 60 C93 45 89 36 82 28 Z" fill="#BCD2EC" opacity={0.6} />
      <Ellipse cx={58} cy={94} rx={23} ry={11} fill="#F4F9FF" stroke="#BCD2EC" strokeWidth={2} />
      {/* fluff ticks */}
      <Path d="M30 86 l4 -4 M34 96 l5 -3 M82 100 l-5 -3" stroke="#BCD2EC" strokeWidth={2.2} strokeLinecap="round" />
      <Ellipse cx={32} cy={68} rx={8} ry={5} fill="#FFB3C1" />
      <Ellipse cx={88} cy={68} rx={8} ry={5} fill="#FFB3C1" />

      {m === 'excited' ? (
        <>
          <Path d="M35 54 Q44 42 53 54" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <Path d="M67 54 Q76 42 85 54" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx={44} cy={53} r={10.5} fill={INK} />
          <Circle cx={47.8} cy={48.4} r={4} fill="#fff" />
          <Circle cx={40.5} cy={56} r={1.7} fill="#fff" />
          {m === 'wink' ? (
            <Path d="M67 54 Q76 42 85 54" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          ) : (
            <>
              <Circle cx={76} cy={53} r={10.5} fill={INK} />
              <Circle cx={79.8} cy={48.4} r={4} fill="#fff" />
              <Circle cx={72.5} cy={56} r={1.7} fill="#fff" />
            </>
          )}
          {m === 'angry' && (
            <>
              <Path d="M31 36 L53 45 L53 40 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
              <Path d="M89 36 L67 45 L67 40 Z" fill={INK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            </>
          )}
          {m === 'sad' && (
            <>
              <Line x1={33} y1={42} x2={50} y2={37} stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
              <Line x1={87} y1={42} x2={70} y2={37} stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
              <Path d="M38 62 C41 67 41 70 38 71 C35 70 35 67 38 62 Z" fill="#7FD4FF" stroke={INK} strokeWidth={1.5} />
            </>
          )}
          {m === 'question' && <Path d="M67 39 Q76 33 85 38" stroke={INK} strokeWidth={3.2} fill="none" strokeLinecap="round" />}
        </>
      )}

      <Path d="M46 68 l-15 -3 M46 71 l-15 3 M74 68 l15 -3 M74 71 l15 3" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <Ellipse cx={54} cy={68} rx={8} ry={6.2} fill="#FFFFFF" stroke={INK} strokeWidth={2.6} />
      <Ellipse cx={66} cy={68} rx={8} ry={6.2} fill="#FFFFFF" stroke={INK} strokeWidth={2.6} />
      <Rect x={54} y={63.5} width={12} height={6} fill="#FFFFFF" />
      <Path d="M55.5 61 Q60 58 64.5 61 Q62.5 66.5 60 66.5 Q57.5 66.5 55.5 61 Z" fill={INK} />
      {m === 'excited' || m === 'wink' ? (
        <Path d="M54 73 Q60 86 66 73 Z" fill="#FF7A93" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      ) : m === 'sad' || m === 'angry' ? (
        <Path d="M55 78 Q60 74 65 78" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      ) : m === 'question' ? (
        <Ellipse cx={60} cy={77.5} rx={2.6} ry={3} fill={INK} />
      ) : null}
      <MoodMark mood={m} x={102} y={22} scale={1.15} />
    </G>
  );
}

// ── Public components ───────────────────────────────────────────────────────

/** Small portrait in a cut-corner frame */
export function Avatar({ id, size = 56, mood = 'happy' }: { id?: string; size?: number; mood?: Mood }) {
  const c = getCharacter(id) ?? getCharacter('norppa');
  if (!c) return null;
  const clip = `av-${c.id}`;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <ClipPath id={clip}>
            <Polygon points={FRAME} />
          </ClipPath>
          <Pattern id={`${clip}-dots`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <Circle cx={4} cy={4} r={1.7} fill={c.color === colors.ink ? '#FFFFFF' : INK} />
          </Pattern>
        </Defs>
        <G clipPath={`url(#${clip})`}>
          <Rect width={100} height={100} fill={c.color === colors.ink ? '#3A1420' : c.color} />
          <Rect width={100} height={100} fill={`url(#${clip}-dots)`} opacity={0.16} />
          <Polygon points="0,62 100,22 100,48 0,88" fill="#fff" opacity={0.2} />
          {c.avatar ? (
            <Person c={c} mood={mood} />
          ) : (
            <G transform="translate(-2 2) scale(0.87)">
              <SealShapes mood={mood} />
            </G>
          )}
        </G>
        <Polygon points={FRAME} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      </Svg>
    </View>
  );
}

/** Large character sprite on a slanted colour block, for headers and the cast screen */
export function Sprite({ id, size = 150, mood = 'happy' }: { id?: string; size?: number; mood?: Mood }) {
  const c = getCharacter(id) ?? getCharacter('norppa');
  if (!c) return null;
  const clip = `sp-${c.id}`;
  const bg = c.color === colors.ink ? '#E0102F' : c.color;
  return (
    <View style={{ width: size, height: size * 1.2 }}>
      <Svg width={size} height={size * 1.2} viewBox="-4 -6 108 130">
        <Defs>
          <ClipPath id={clip}>
            <Polygon points="-4,-6 104,-6 104,118 -4,118" />
          </ClipPath>
          <Pattern id={`${clip}-dots`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <Circle cx={4.5} cy={4.5} r={1.9} fill={INK} />
          </Pattern>
        </Defs>
        {/* slanted backdrop with its own hard shadow */}
        <Polygon points="10,22 100,8 96,122 4,122" fill={INK} />
        <Polygon points="6,18 96,4 92,118 0,118" fill={bg} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <Polygon points="6,18 96,4 92,118 0,118" fill={`url(#${clip}-dots)`} opacity={0.16} />
        <Polygon points="2,84 95,40 94,62 1,104" fill="#fff" opacity={0.22} />
        <G clipPath={`url(#${clip})`}>
          {c.avatar ? (
            <Person c={c} mood={mood} />
          ) : (
            <G transform="translate(-6 10) scale(0.93)">
              <SealShapes mood={mood} />
            </G>
          )}
        </G>
        <Line x1={0} y1={118} x2={92} y2={118} stroke={INK} strokeWidth={3.5} />
      </Svg>
    </View>
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
        <SealShapes mood={mood} />
      </Svg>
    </View>
  );
}

/** Each character's name in their own style: Jere's is a punk patch, Pekka's a plank, Helvi's is lace… */
export function NameTag({ id, size = 13 }: { id?: string; size?: number }) {
  const c = getCharacter(id);
  if (!c) return null;
  const t = c.tag;
  const icon = <Ionicons name={t.icon as never} size={size} color={t.style === 'punk' ? colors.gold : t.accent} />;
  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: t.bg,
    borderWidth: 2,
    borderColor: INK,
  };
  const byStyle: Record<string, ViewStyle> = {
    punk: { transform: [{ rotate: '-5deg' }], borderWidth: 2.5, boxShadow: hardShadow(INK, 2) },
    plank: { borderRadius: 2, borderColor: t.accent, borderBottomWidth: 4, transform: [{ rotate: '-2deg' }] },
    note: { transform: [{ rotate: '4deg' }], borderWidth: 0, boxShadow: hardShadow(INK, 2) },
    sleeve: { borderRadius: 10, borderColor: t.accent, transform: [{ rotate: '-3deg' }] },
    lace: { borderRadius: 10, borderStyle: 'dashed', borderColor: t.accent, transform: [{ rotate: '2deg' }] },
    ticket: { borderLeftWidth: 5, borderStyle: 'dashed', transform: [{ rotate: '-3deg' }] },
    badge: { borderRadius: 4, borderTopWidth: 6, borderTopColor: t.accent, transform: [{ rotate: '2deg' }] },
    ice: { borderRadius: 10, borderColor: t.accent, transform: [{ rotate: '-3deg' }] },
    tape: { transform: [{ rotate: '5deg' }], borderColor: t.accent },
    jersey: { borderRadius: 3, borderBottomWidth: 5, borderBottomColor: t.accent, transform: [{ rotate: '-2deg' }] },
    gift: { borderRadius: 4, borderColor: t.accent, borderStyle: 'dashed', boxShadow: hardShadow(INK, 2), transform: [{ rotate: '2deg' }] },
    neon: { borderRadius: 4, borderColor: t.accent, boxShadow: hardShadow(t.accent, 2), transform: [{ rotate: '-3deg' }] },
  };
  const loud = t.style === 'punk' || t.style === 'tape' || t.style === 'neon';
  return (
    <View style={[base, byStyle[t.style]]}>
      {icon}
      <Text
        style={{
          fontFamily: loud ? font.display : font.label,
          fontSize: size,
          letterSpacing: loud ? 1.5 : 0.8,
          color: t.fg,
          textTransform: t.style === 'note' || t.style === 'lace' ? 'none' : 'uppercase',
        }}
      >
        {c.name}
      </Text>
      {t.style === 'punk' && icon}
    </View>
  );
}

/**
 * Who is teaching the current lesson, and how they feel about your last answer.
 * Any Speech without a speaker falls back to them, so one character carries a lesson.
 */
export const HostContext = createContext<{ id: string; mood: Mood }>({ id: 'norppa', mood: 'happy' });
export const useHost = () => useContext(HostContext);

/** A character saying something: portrait, their name tag, and a speech bubble */
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
  const host = useHost();
  const who = speaker ?? host.id;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }, style]}>
      <View style={{ alignItems: 'center' }}>
        <Avatar id={who} size={size} mood={mood ?? (who === host.id ? host.mood : undefined)} />
        <View style={{ marginTop: -7 }}>
          <NameTag id={who} size={12} />
        </View>
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

// ── Unit backdrops ──────────────────────────────────────────────────────────

const tree = (x: number, h: number) => `M${x} ${120 - h} L${x + h * 0.26} ${120 - h * 0.55} L${x + h * 0.14} ${120 - h * 0.55} L${x + h * 0.34} 120 L${x - h * 0.34} 120 L${x - h * 0.14} ${120 - h * 0.55} L${x - h * 0.26} ${120 - h * 0.55} Z`;

/**
 * A silhouette scene that fills its parent, drawn in ink and paper at low
 * opacity so it sits on any unit colour. Each unit names one in its JSON.
 */
export function Scene({ kind }: { kind?: string }) {
  if (!kind) return null;
  const dark = { fill: INK, opacity: 0.24 };
  const light = { fill: '#FFFFFF', opacity: 0.22 };
  return (
    <Svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }} width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="xMaxYMax slice" pointerEvents="none">
      {(kind === 'lake' || kind === 'forest') && (
        <>
          <Circle cx={330} cy={34} r={20} {...light} />
          {[214, 244, 262, 296, 372, 392].map((x, i) => (
            <Path key={x} d={tree(x, [58, 82, 50, 70, 88, 60][i])} {...dark} />
          ))}
          <Path d="M200 108 H400 V120 H200 Z" {...light} />
          <Path d="M300 112 h44 M250 116 h30 M356 116 h26" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={2.5} />
        </>
      )}
      {kind === 'river' && (
        <>
          {/* cathedral tower and a bridge over the river */}
          <Path d="M330 120 V54 L326 54 L342 22 L358 54 L354 54 V120 Z" {...dark} />
          <Path d="M338 22 h8 v-12 h-8 Z" {...dark} />
          <Path d="M354 120 V82 H398 V120 Z" {...dark} />
          <Path d="M210 120 V96 H322 V120 H300 C300 104 274 104 274 120 H258 C258 104 232 104 232 120 Z" {...dark} />
          <Path d="M200 114 H400 V120 H200 Z" {...light} />
          <Circle cx={250} cy={36} r={14} {...light} />
        </>
      )}
      {kind === 'cafe' && (
        <>
          {[236, 300, 364].map((x) => (
            <Path key={x} d={`M${x} 0 V26 M${x - 14} 44 C${x - 14} 24 ${x + 14} 24 ${x + 14} 44 Z`} stroke={INK} strokeOpacity={0.24} strokeWidth={3} {...dark} />
          ))}
          <Path d="M290 120 V84 H346 V120 Z M346 92 C366 92 366 112 346 112" {...dark} />
          <Path d="M304 74 q6 -10 0 -20 M318 74 q6 -10 0 -20 M332 74 q6 -10 0 -20" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M214 120 C214 96 262 96 262 120 Z" {...dark} />
          <Path d="M222 108 q16 -14 32 0" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} fill="none" />
        </>
      )}
      {kind === 'city' && (
        <>
          <Path d="M204 120 V70 H232 V120 Z M238 120 V46 H270 V120 Z M276 120 V80 H300 V120 Z M360 120 V56 H396 V120 Z" {...dark} />
          {[52, 62, 72, 82, 92].map((y) => (
            <Path key={y} d={`M244 ${y} h6 M256 ${y} h6 M366 ${y + 8} h6 M378 ${y + 8} h6`} stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={3} />
          ))}
          {/* a bus */}
          <Path d="M296 120 V96 Q296 90 302 90 H352 Q358 90 358 96 V120 Z" fill={INK} opacity={0.34} />
          <Path d="M302 96 h14 v10 h-14 Z M320 96 h14 v10 h-14 Z M338 96 h14 v10 h-14 Z" {...light} />
          <Circle cx={310} cy={120} r={6} fill={INK} opacity={0.5} />
          <Circle cx={344} cy={120} r={6} fill={INK} opacity={0.5} />
        </>
      )}
      {kind === 'bar' && (
        <>
          <Path d="M206 60 H398 V66 H206 Z" {...dark} />
          {[222, 246, 270, 366, 388].map((x, i) => (
            <Path key={x} d={`M${x - 6} 60 V${38 - (i % 2) * 6} Q${x - 6} ${32 - (i % 2) * 6} ${x - 2} ${30 - (i % 2) * 6} V${20 - (i % 2) * 6} H${x + 2} V${30 - (i % 2) * 6} Q${x + 6} ${32 - (i % 2) * 6} ${x + 6} ${38 - (i % 2) * 6} V60 Z`} {...dark} />
          ))}
          {/* cocktail glass and a neon bolt */}
          <Path d="M300 78 H340 L320 100 Z M318 100 h4 v16 h-4 Z M308 116 h24 v4 h-24 Z" {...dark} />
          <Polygon points="322,10 306,36 320,36 312,56 338,28 324,28 332,10" fill="#FFFFFF" opacity={0.3} />
        </>
      )}
    </Svg>
  );
}

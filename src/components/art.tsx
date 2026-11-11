import { Ionicons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Pattern, Polygon, Rect } from 'react-native-svg';
import { getCharacter, type Character } from '../content';
import { colors, font, hardShadow, OUTLINE } from '../theme';
import { Surface, Text } from './Text';

const INK = colors.ink;
const FRAME = '14,0 100,0 100,86 86,100 0,100 0,14';
const TORSO = 'M6 130 C6 92 28 72 50 72 C72 72 94 92 94 130 Z';

/** 'cheer' is the old name for 'excited' and still works */
export type Mood = 'happy' | 'excited' | 'sad' | 'question' | 'cheer';
const norm = (m: Mood) => (m === 'cheer' ? 'excited' : m);

// ── People ──────────────────────────────────────────────────────────────────
// Drawn in a 100 × 128 box: head around (50, 44), torso from y = 72 down.

function Outfit({ a, id }: { a: NonNullable<Character['avatar']>; id: string }) {
  const clip = `torso-${id}`;
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
        {a.outfit === 'tee' && (
          <>
            <Path d="M39 75 Q50 88 61 75" stroke={dark} strokeOpacity={0.5} strokeWidth={3} fill="none" />
            <Polygon points="50,97 44,109 50,109 46,121 57,106 51,106 55,97" fill="#FF4FA3" stroke={INK} strokeWidth={1.2} />
          </>
        )}
        {/* hard shadow down the right side: the cel-shaded look */}
        <Path d="M50 72 C72 72 94 92 94 130 L66 130 C68 100 62 82 50 72 Z" fill="#000" opacity={0.22} />
      </G>
      <Path d={TORSO} fill="none" stroke={INK} strokeWidth={3} />
    </G>
  );
}

function Face({ mood, a }: { mood: Mood; a: NonNullable<Character['avatar']> }) {
  const m = norm(mood);
  const has = (x: string) => a.extras?.includes(x);
  return (
    <G>
      {/* brows */}
      {m === 'sad' ? (
        <>
          <Line x1={37} y1={40.5} x2={46} y2={37.5} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={54} y1={37.5} x2={63} y2={40.5} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        </>
      ) : m === 'question' ? (
        <>
          <Line x1={37} y1={40} x2={46} y2={39} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M54 36 Q59 31.5 63.5 35" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Line x1={37} y1={m === 'excited' ? 37.5 : 39.5} x2={46} y2={m === 'excited' ? 36 : 38} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <Line x1={54} y1={m === 'excited' ? 36 : 38} x2={63} y2={m === 'excited' ? 37.5 : 39.5} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        </>
      )}
      {/* eyes */}
      {m === 'excited' ? (
        <>
          <Path d="M38 46 Q42 41 46 46" stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <Path d="M54 46 Q58 41 62 46" stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Polygon points="38,43.5 46,43 45.2,47.8 39,47.8" fill={INK} />
          <Polygon points="54,43 62,43.5 61,47.8 54.8,47.8" fill={INK} />
          <Rect x={42.4} y={44} width={1.9} height={1.7} fill="#fff" />
          <Rect x={58.2} y={44} width={1.9} height={1.7} fill="#fff" />
          {m === 'sad' && (
            <>
              <Line x1={37.5} y1={43} x2={46.5} y2={44} stroke={a.skin} strokeWidth={2.2} />
              <Line x1={53.5} y1={44} x2={62.5} y2={43} stroke={a.skin} strokeWidth={2.2} />
            </>
          )}
        </>
      )}
      {has('eyeliner') && (
        <>
          <Line x1={37} y1={48.6} x2={46.5} y2={48.6} stroke={INK} strokeWidth={1.6} />
          <Line x1={53.5} y1={48.6} x2={63} y2={48.6} stroke={INK} strokeWidth={1.6} />
        </>
      )}
      <Path d="M50 46 L48 53 L51.5 53" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* mouth */}
      {m === 'sad' ? (
        <Path d="M44 61 Q50 56 56 61" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      ) : m === 'excited' ? (
        <Path d="M43 57 Q50 67 57 57 Z" fill="#fff" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      ) : m === 'question' ? (
        <Ellipse cx={51.5} cy={59.5} rx={2.6} ry={3} fill={INK} />
      ) : (
        <Path d="M44 58 Q50 62.5 57 57" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      )}
    </G>
  );
}

function Person({ c, mood }: { c: Character; mood: Mood }) {
  const a = c.avatar as NonNullable<Character['avatar']>;
  const m = norm(mood);
  const has = (x: string) => a.extras?.includes(x);
  const hs = a.hairStyle;
  return (
    <G>
      {/* hair behind the head */}
      {hs === 'bob' && <Path d="M27 40 C25 14 75 14 73 40 L76 66 L64 68 L64 46 L36 46 L36 68 L24 66 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'pony' && <Path d="M66 24 C86 20 92 46 80 62 L72 52 C78 42 74 34 64 32 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'bun' && <Circle cx={50} cy={15} r={10} fill={a.hair} stroke={INK} strokeWidth={3} />}
      {hs === 'long' && <Path d="M26 40 C22 10 78 10 74 40 L81 106 L64 101 L64 46 L36 46 L36 101 L19 106 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'emo' && <Path d="M28 42 C24 14 76 14 72 42 L73 60 L64 62 L64 44 L36 44 L36 62 L27 60 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}

      {hs === 'wolfcut' && (
        <Path d="M27 40 C23 12 77 12 73 40 L79 62 L72 58 L75 73 L66 66 L64 77 L64 46 L36 46 L36 77 L34 66 L25 73 L28 58 L21 62 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      )}
      {hs === 'swept' && <Path d="M62 28 C80 28 86 48 79 60 L72 52 C75 45 72 38 62 36 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}

      <Outfit a={a} id={c.id} />

      {/* neck */}
      <Path d="M42 58 L42 74 Q50 81 58 74 L58 58 Z" fill={a.skin} stroke={INK} strokeWidth={3} />
      <Path d="M42 62 L58 62 L58 69 Q50 72 42 67 Z" fill="#000" opacity={0.24} />
      {has('pearls') && [43, 46.5, 50, 53.5, 57].map((x, i) => <Circle key={x} cx={x} cy={75 + [0, 1.6, 2.2, 1.6, 0][i]} r={1.9} fill="#FFFFFF" stroke={INK} strokeWidth={1} />)}
      {has('chain') && <Path d="M40 77 Q50 92 60 77" stroke="#D8D8E0" strokeWidth={2.2} fill="none" strokeDasharray="2.5 1.5" />}

      {/* head */}
      <Path d="M31 40 C31 24 69 24 69 40 L68 50 C66 60 58 67 50 67 C42 67 34 60 32 50 Z" fill={a.skin} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M54 26 C64 27 69 33 69 40 L68 50 C66 60 58 67 50 67 C58 60 61 52 61 44 C61 36 58 30 54 26 Z" fill="#000" opacity={0.16} />
      {hs === 'undercut' && (
        <>
          <Path d="M31.5 42 C31 32 33 27 38 24 L38 38 Z" fill="#000" opacity={0.3} />
          <Path d="M68.5 42 C69 32 67 27 62 24 L62 38 Z" fill="#000" opacity={0.3} />
        </>
      )}
      {has('stubble') && <Path d="M33 52 C36 62 43 67 50 67 C57 67 64 62 67 52 C62 59 56 61 50 61 C44 61 38 59 33 52 Z" fill="#000" opacity={0.2} />}
      {has('beard') && <Path d="M32 50 C34 60 42 67 50 67 C58 67 66 60 68 50 L63 55 C59 59 55 56 50 56 C45 56 41 59 37 55 Z" fill={a.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />}
      {has('bigbeard') && <Path d="M30.5 46 C30 68 40 80 50 80 C60 80 70 68 69.5 46 L64 53 C60 57 55 55 50 55 C45 55 40 57 36 53 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {has('bigbeard') && <Path d="M56 56 C62 56 66 52 69 47 C69 66 61 79 51 80 C58 74 60 64 56 56 Z" fill="#000" opacity={0.2} />}

      <Face mood={mood} a={a} />

      {has('moustache') && <Path d="M39 56 Q45 50.5 50 54 Q55 50.5 61 56 Q55 58.5 50 56.5 Q45 58.5 39 56 Z" fill={a.hair} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />}
      {has('goatee') && <Path d="M45 62 Q50 60 55 62 L53 69 Q50 72 47 69 Z" fill={a.hair} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />}
      {has('glasses') && (
        <>
          <Rect x={35} y={40.5} width={12.5} height={9} rx={2} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={2.4} />
          <Rect x={52.5} y={40.5} width={12.5} height={9} rx={2} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={2.4} />
          <Line x1={47.5} y1={44} x2={52.5} y2={44} stroke={INK} strokeWidth={2.4} />
        </>
      )}
      {has('earring') && <Circle cx={32} cy={54} r={2.6} fill={colors.gold} stroke={INK} strokeWidth={1.5} />}
      {has('liprings') && (
        <>
          <Circle cx={45.5} cy={60.8} r={1.9} fill="none" stroke="#E4E4EC" strokeWidth={1.6} />
          <Circle cx={55} cy={60.2} r={1.9} fill="none" stroke="#E4E4EC" strokeWidth={1.6} />
        </>
      )}
      {has('browring') && <Circle cx={62.5} cy={36.6} r={2} fill="none" stroke="#E4E4EC" strokeWidth={1.6} />}
      {has('lipring') && <Circle cx={46} cy={60.5} r={1.9} fill="none" stroke="#D8D8E0" strokeWidth={1.5} />}
      {has('piercings') && (
        <>
          <Circle cx={62.5} cy={36.5} r={1.9} fill="none" stroke={colors.gold} strokeWidth={1.5} />
          <Circle cx={48.2} cy={53.6} r={1.7} fill="none" stroke={colors.gold} strokeWidth={1.4} />
          <Circle cx={55.5} cy={60.5} r={1.8} fill="none" stroke={colors.gold} strokeWidth={1.4} />
          <Circle cx={31.4} cy={50} r={2.8} fill={INK} stroke={colors.gold} strokeWidth={1.5} />
        </>
      )}

      {/* hair in front */}
      {hs === 'short' && <Path d="M30 42 C25 16 75 14 70 42 L66 33 L58 29 L49 33 L41 29 L34 35 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'bob' && <Path d="M30 43 C27 18 73 18 70 43 L62 33 L51 37 L44 31 L36 37 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'pony' && <Path d="M30 42 C26 16 74 16 70 40 L60 30 L45 33 L36 39 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'bun' && <Path d="M30 42 C27 20 73 20 70 42 C64 32 57 29 50 29 C43 29 36 32 30 42 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'long' && <Path d="M30 46 C25 14 75 14 70 46 L66 36 C61 26 54 25 50 31 C46 25 39 26 34 36 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'emo' && (
        <>
          <Path d="M29 44 C23 12 79 12 71 40 L68 33 C60 29 54 34 48 49 L37 51 C36 45 33 42 29 44 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M53 22 L61 21 L50 45 L45 48 Z" fill={colors.berry} />
        </>
      )}
      {hs === 'wolfcut' && (
        <>
          <Path d="M30 45 C24 11 76 11 70 45 L67 34 L62 41 L58 30 L53 40 L50 29 L46 40 L42 30 L38 41 L33 34 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M55 16 L63 19 L58 29 Z" fill="#000" opacity={0.14} />
        </>
      )}
      {hs === 'swept' && (
        <>
          <Path d="M66 35 L70.5 42 L69.5 59 L65 61 Z" fill={a.hair} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
          <Path d="M30 46 C23 13 77 11 70 42 L66 34 C58 27 50 30 44 41 L40 51 L36.5 62 L31.5 59 C33 53 31 49 30 46 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M52 20 L62 22 L50 34 Z" fill="#fff" opacity={0.28} />
        </>
      )}
      {hs === 'undercut' && <Path d="M33 33 C29 10 73 8 68 33 L62 24 L55 31 L48 21 L41 31 Z" fill={a.hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      {hs === 'curly' && (
        <G fill={a.hair} stroke={INK} strokeWidth={3}>
          <Circle cx={33} cy={35} r={7.5} />
          <Circle cx={67} cy={35} r={7.5} />
          <Circle cx={37} cy={26} r={8.5} />
          <Circle cx={63} cy={26} r={8.5} />
          <Circle cx={50} cy={22} r={9.5} />
          <Path d="M34 34 C36 24 64 24 66 34 C60 30 40 30 34 34 Z" stroke="none" />
        </G>
      )}
      {hs === 'cap' && (
        <>
          <Path d="M29 36 C29 12 71 12 71 36 Z" fill={a.shirt} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M26 35 L80 35 L86 41 L26 41 Z" fill={INK} />
          <Path d="M40 22 L48 19 L48 30 L40 31 Z" fill={colors.gold} stroke={INK} strokeWidth={1.5} />
        </>
      )}
      {hs === 'beanie' && (
        <>
          <Path d="M29 37 C26 10 74 10 71 37 Z" fill="#4A5A7A" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Rect x={26.5} y={31} width={47} height={9.5} rx={3} fill="#6C7FA6" stroke={INK} strokeWidth={3} />
          {[34, 42, 50, 58, 66].map((x) => (
            <Line key={x} x1={x} y1={32.5} x2={x} y2={39} stroke={INK} strokeWidth={1.4} opacity={0.5} />
          ))}
        </>
      )}
      {!['cap', 'curly', 'beanie'].includes(hs) && <Path d="M38 26 L46 23 L42 31 Z" fill="#fff" opacity={0.3} />}

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
      <Path d="M96 99 C109 96 114 105 105 110 C100 109 97 105 96 99 Z" fill="#FFFFFF" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <Path d={up ? 'M26 66 C10 56 6 40 15 34 C23 42 29 52 31 64 Z' : 'M24 78 C8 80 5 96 17 99 C25 95 30 87 30 80 Z'} fill="#FFFFFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <Path d={up ? 'M94 66 C110 56 114 40 105 34 C97 42 91 52 89 64 Z' : 'M96 78 C112 80 115 96 103 99 C95 95 90 87 90 80 Z'} fill="#E3EDF8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {/* body with three tufts of fluff on top */}
      <Path
        d="M20 96 C10 66 26 32 43 25 L47 15 L53 24 L60 12 L67 24 L73 15 L77 25 C94 32 110 66 100 96 C96 113 24 113 20 96 Z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path d="M79 27 C95 35 109 66 100 96 C98 107 84 111 68 111 C87 101 95 81 93 61 C91 45 87 35 79 27 Z" fill="#BCD2EC" opacity={0.75} />
      <Ellipse cx={58} cy={94} rx={23} ry={11} fill="#F4F9FF" stroke="#BCD2EC" strokeWidth={2} />
      {/* fluff ticks */}
      <Path d="M30 86 l4 -4 M34 96 l5 -3 M82 100 l-5 -3" stroke="#BCD2EC" strokeWidth={2.2} strokeLinecap="round" />
      <Ellipse cx={35} cy={66} rx={7.5} ry={4.8} fill="#FFB3C1" />
      <Ellipse cx={85} cy={66} rx={7.5} ry={4.8} fill="#FFB3C1" />

      {m === 'excited' ? (
        <>
          <Path d="M35 54 Q44 42 53 54" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <Path d="M67 54 Q76 42 85 54" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx={44} cy={52} r={9.5} fill={INK} />
          <Circle cx={76} cy={52} r={9.5} fill={INK} />
          <Circle cx={47.5} cy={48} r={3.4} fill="#fff" />
          <Circle cx={79.5} cy={48} r={3.4} fill="#fff" />
          <Circle cx={40.5} cy={56} r={1.7} fill="#fff" />
          <Circle cx={72.5} cy={56} r={1.7} fill="#fff" />
          {m === 'sad' && (
            <>
              <Line x1={33} y1={38} x2={50} y2={42} stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
              <Line x1={87} y1={38} x2={70} y2={42} stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
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
      {m === 'excited' ? (
        <Path d="M54 73 Q60 86 66 73 Z" fill="#FF7A93" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      ) : m === 'sad' ? (
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
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }, style]}>
      <View style={{ alignItems: 'center' }}>
        <Avatar id={speaker} size={size} mood={mood} />
        <View style={{ marginTop: -7 }}>
          <NameTag id={speaker ?? 'norppa'} size={12} />
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

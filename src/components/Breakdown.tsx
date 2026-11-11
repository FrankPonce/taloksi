import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { breakdown } from '../content';
import { colors, font, OUTLINE } from '../theme';
import { Text } from './Text';
import { Tag } from './ui';

const ENDING_COLORS = [colors.red, colors.blue, colors.berry];

/**
 * A Finnish sentence taken apart: every word shows its stem and endings in
 * different colours with a gloss underneath. Tap a word for the explanation.
 * Designed to sit on a paper surface.
 */
export function Breakdown({ fi }: { fi: string }) {
  const tokens = useMemo(() => breakdown(fi), [fi]);
  const firstInteresting = Math.max(0, tokens.findIndex((t) => t.parts.length > 1));
  const [open, setOpen] = useState(firstInteresting);
  const t = tokens[open];
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tokens.map((tok, i) => (
          <Pressable
            key={i}
            onPress={() => setOpen(i)}
            style={{
              borderWidth: OUTLINE - 1,
              borderColor: colors.ink,
              borderRadius: 4,
              backgroundColor: i === open ? colors.gold : '#FFFFFF',
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 19, fontFamily: font.bold }}>
              {tok.parts.map((p, pi) => (
                <Text key={pi} style={{ fontSize: 19, fontFamily: font.bold, color: pi === 0 ? colors.ink : ENDING_COLORS[(pi - 1) % ENDING_COLORS.length] }}>
                  {p}
                </Text>
              ))}
            </Text>
            <Text style={{ fontSize: 12, color: colors.mutedOnPaper }}>{tok.en || '·'}</Text>
          </Pressable>
        ))}
      </View>
      {t && t.known && (
        <View style={{ borderLeftWidth: 5, borderColor: colors.ink, paddingLeft: 10, gap: 4 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <Tag label={t.lemma} color={colors.ink} tilt={-1} size={14} />
            {t.parts.length > 1 && (
              <Text style={{ fontSize: 16, fontFamily: font.bold }}>
                {t.parts.map((p, pi) => (
                  <Text key={pi} style={{ fontSize: 16, fontFamily: font.bold, color: pi === 0 ? colors.ink : ENDING_COLORS[(pi - 1) % ENDING_COLORS.length] }}>
                    {pi === 0 ? p : `  +  -${p}`}
                  </Text>
                ))}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 15, lineHeight: 21 }}>{t.why}</Text>
        </View>
      )}
    </View>
  );
}

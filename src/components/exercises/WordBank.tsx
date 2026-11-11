import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { checkAnswer, type Lang } from '../../engine/text';
import { colors, font, hardShadow, OUTLINE, radius } from '../../theme';
import { Text } from '../Text';
import { Button } from '../ui';
import type { ExerciseResult } from './types';

/** Tile bank: tap tiles to build the answer */
export function WordBank({
  tiles,
  accepted,
  lang,
  locked,
  onSubmit,
}: {
  tiles: string[];
  accepted: string[];
  lang: Lang;
  locked: boolean;
  onSubmit: (r: ExerciseResult) => void;
}) {
  const [picked, setPicked] = useState<number[]>([]);
  const answer = picked.map((i) => tiles[i]).join(' ');
  return (
    <View style={{ gap: 18 }}>
      <View style={styles.answerRow}>
        {picked.map((i) => (
          <Tile key={i} label={tiles[i]} onPress={() => !locked && setPicked(picked.filter((p) => p !== i))} />
        ))}
      </View>
      <View style={styles.bank}>
        {tiles.map((t, i) => (
          <Tile key={i} label={t} used={picked.includes(i)} onPress={() => !locked && !picked.includes(i) && setPicked([...picked, i])} />
        ))}
      </View>
      {!locked && (
        <Button
          title="Tarkista · Check"
          disabled={!picked.length}
          onPress={() => {
            const r = checkAnswer(answer, accepted, lang, { allowTypos: false, strictUmlauts: true });
            onSubmit({ correct: r.correct, expected: r.expected, note: r.note });
          }}
        />
      )}
    </View>
  );
}

function Tile({ label, onPress, used }: { label: string; onPress: () => void; used?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, used ? styles.used : { boxShadow: hardShadow(colors.ink, 3) }]}>
      <Text style={[styles.tileText, used && { color: 'transparent' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  answerRow: {
    minHeight: 70,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    borderBottomWidth: OUTLINE,
    borderStyle: 'dashed',
    borderColor: colors.mutedOnNight,
    paddingBottom: 12,
    alignItems: 'flex-end',
  },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  tile: {
    backgroundColor: colors.paper,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  used: { backgroundColor: colors.nightSoft, borderColor: colors.nightSoft },
  tileText: { fontSize: 18, color: colors.ink, fontFamily: font.bold },
});

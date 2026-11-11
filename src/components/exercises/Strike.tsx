import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { sfx } from '../../audio/sfx';
import type { Exercise } from '../../engine/exercises';
import { colors, font } from '../../theme';
import { Speech } from '../art';
import { Text } from '../Text';
import { Button } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'strike' }>;

/** A sentence with one word too many. Tap the intruder to cross it out. */
export function Strike({ ex, locked, onSubmit }: ExProps<E>) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.red}>Yliviivaa · Cross out the extra word</ExTitle>
      <Speech speaker={ex.speaker} size={68}>
        <Text style={{ fontSize: 16, color: colors.mutedOnPaper }}>This should say: “{ex.en}”</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ex.words.map((w, i) => {
            const struck = sel === i;
            const reveal = locked && i === ex.extra;
            return (
              <Pressable
                key={i}
                disabled={locked}
                onPress={() => {
                  sfx('tap');
                  setSel(struck ? null : i);
                }}
                style={{
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: struck || reveal ? colors.ink : 'transparent',
                  backgroundColor: reveal ? colors.success : struck ? (locked ? colors.red : colors.gold) : 'transparent',
                  transform: [{ rotate: struck ? '-3deg' : '0deg' }],
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: font.bold,
                    textDecorationLine: struck || reveal ? 'line-through' : 'none',
                    color: colors.ink,
                  }}
                >
                  {w}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Speech>
      {!locked && (
        <Button
          title="Tarkista · Check"
          disabled={sel === null}
          onPress={() => onSubmit({ correct: sel === ex.extra, expected: ex.fi, note: `“${ex.words[ex.extra]}” does not belong there.` })}
        />
      )}
    </View>
  );
}

import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { sfx } from '../../audio/sfx';
import { speak } from '../../audio/speak';
import type { Exercise } from '../../engine/exercises';
import { useApp } from '../../state/store';
import { colors, font, hardShadow, OUTLINE } from '../../theme';
import { Text } from '../Text';
import { Button, Chip, Options, WordPic } from '../ui';
import { ExTitle, Prompt } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'picture' }>;

const TINTS = [colors.gold, colors.aurora, colors.blue, colors.orange];

/** Picture cards: hear and read a word, pick its picture. Or see a picture, pick its word. */
export function Picture({ ex, locked, onSubmit }: ExProps<E>) {
  const rate = useApp((s) => s.settings.audioRate);
  const [sel, setSel] = useState<string | null>(null);
  const toPic = ex.mode === 'word-to-pic';
  useEffect(() => {
    if (toPic) speak(ex.fi, { id: ex.itemId, rate });
  }, [ex.key]);
  const check = () => onSubmit({ correct: sel === ex.answerId, expected: `${ex.fi} = ${ex.en}` });

  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.gold}>{toPic ? 'Valitse kuva · Pick the picture' : 'Mikä tämä on? · What is this?'}</ExTitle>
      {toPic ? (
        <Prompt text={ex.fi} big audio={{ text: ex.fi, id: ex.itemId }} />
      ) : (
        <View style={{ alignItems: 'center', paddingVertical: 6 }}>
          <WordPic icon={ex.icon} size={150} color={colors.paper} />
        </View>
      )}

      {toPic ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          {ex.options.map((o, i) => {
            const right = locked && o.id === ex.answerId;
            const wrong = locked && sel === o.id && !right;
            const bg = right ? colors.success : wrong ? colors.red : sel === o.id ? colors.paper : TINTS[i % TINTS.length];
            return (
              <Pressable
                key={o.id}
                disabled={locked}
                onPress={() => {
                  sfx('tap');
                  setSel(o.id);
                }}
                style={{
                  width: '45%',
                  maxWidth: 190,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: sel === o.id ? OUTLINE + 2 : OUTLINE,
                  borderColor: colors.ink,
                  borderRadius: 8,
                  backgroundColor: bg,
                  boxShadow: hardShadow(colors.ink, sel === o.id ? 2 : 5),
                  transform: [{ rotate: `${[-2, 1.5, 1.5, -2][i % 4]}deg` }, { translateY: sel === o.id ? 3 : 0 }],
                }}
              >
                <WordPic icon={o.icon} size={96} color={bg} tilt={0} />
                {locked && <Text style={{ fontFamily: font.label, fontSize: 16, color: colors.ink, marginTop: 4 }}>{o.fi}</Text>}
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Options labels={ex.options.map((o) => o.fi)}>
          {ex.options.map((o) => (
            <Chip
              key={o.id}
              label={o.fi}
              selected={sel === o.id}
              disabled={locked}
              tone={locked ? (o.id === ex.answerId ? 'success' : sel === o.id ? 'danger' : undefined) : undefined}
              onPress={() => setSel(o.id)}
            />
          ))}
        </Options>
      )}
      {!locked && <Button title="Tarkista · Check" disabled={!sel} onPress={check} />}
    </View>
  );
}

import { useState } from 'react';
import { View } from 'react-native';
import type { Exercise } from '../../engine/exercises';
import { colors } from '../../theme';
import { Button, Chip, Options } from '../ui';
import { ExTitle, Prompt } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'pick' }>;

export function Pick({ ex, locked, onSubmit }: ExProps<E>) {
  const [sel, setSel] = useState<string | null>(null);
  const toFinnish = ex.dir === 'en-fi';
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={ex.warmup ? colors.orange : colors.gold}>
        {ex.warmup
          ? 'Lämmittely · Warm-up: remember this one?'
          : toFinnish
            ? 'Valitse suomeksi · Pick the Finnish word'
            : 'Mitä tämä tarkoittaa? · What does this mean?'}
      </ExTitle>
      <Prompt text={ex.prompt} big audio={toFinnish ? undefined : { text: ex.fi, id: ex.itemId }} />
      <Options labels={ex.choices}>
        {ex.choices.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={sel === c}
            disabled={locked}
            tone={locked ? (c === ex.answer ? 'success' : sel === c ? 'danger' : undefined) : undefined}
            onPress={() => setSel(c)}
          />
        ))}
      </Options>
      {!locked && <Button title="Tarkista · Check" disabled={!sel} onPress={() => onSubmit({ correct: sel === ex.answer, expected: ex.answer })} />}
    </View>
  );
}

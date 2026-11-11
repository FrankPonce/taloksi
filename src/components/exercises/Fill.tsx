import { useState } from 'react';
import { View } from 'react-native';
import type { Exercise } from '../../engine/exercises';
import { colors } from '../../theme';
import { Speech } from '../art';
import { Text } from '../Text';
import { Button, Chip } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'fill' }>;

export function Fill({ ex, locked, onSubmit }: ExProps<E>) {
  const f = ex.fill;
  const [sel, setSel] = useState<string | null>(null);
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.aurora}>Täydennä · Fill in the blank</ExTitle>
      <Speech size={68}>
        <Text style={{ fontSize: 24, lineHeight: 34, fontWeight: '700' }}>
          {f.before}{' '}
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.blue, textDecorationLine: 'underline' }}>{sel ?? '______'}</Text>{' '}
          {f.after}
        </Text>
        <Text style={{ fontSize: 16, color: colors.mutedOnPaper }}>{f.en}</Text>
      </Speech>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {f.options.map((o) => (
          <Chip
            key={o}
            label={o}
            selected={sel === o}
            disabled={locked}
            tone={locked ? (o === f.answer ? 'success' : sel === o ? 'danger' : undefined) : undefined}
            onPress={() => setSel(o)}
          />
        ))}
      </View>
      {!locked && (
        <Button
          title="Tarkista · Check"
          disabled={!sel}
          onPress={() => onSubmit({ correct: sel === f.answer, expected: `${f.before} ${f.answer} ${f.after}`.trim().replace(/\s+([.?!,])/g, '$1'), note: f.hint })}
        />
      )}
    </View>
  );
}

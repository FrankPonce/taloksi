import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { speak } from '../../audio/speak';
import type { ChoiceVariant, Exercise } from '../../engine/exercises';
import { useApp } from '../../state/store';
import { colors } from '../../theme';
import { Speech } from '../art';
import { Text } from '../Text';
import { Button, Chip, SpeakerButton } from '../ui';
import { ExTitle, Prompt } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'choice' }>;

const TITLE_COLOR: Record<ChoiceVariant, string> = {
  odd: colors.orange,
  ending: colors.aurora,
  register: colors.berry,
  judge: colors.gold,
  hear: colors.red,
  form: colors.blue,
};

/** One component for every "pick one answer" exercise: odd one out, ending detective, street Finnish, true/false, long-or-short */
export function Choice({ ex, locked, onSubmit }: ExProps<E>) {
  const rate = useApp((s) => s.settings.audioRate);
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => {
    if (ex.audio) speak(ex.audio.text, { id: ex.audio.id, rate });
  }, [ex.key]);
  const twoUp = ex.variant === 'judge';
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={TITLE_COLOR[ex.variant]}>{ex.title}</ExTitle>
      {ex.fi ? (
        <Prompt text={ex.fi} fi speaker={ex.speaker} audio={{ text: ex.fi, id: ex.itemId }}>
          {ex.sub ? <Text style={{ fontSize: 16, color: colors.mutedOnPaper }}>{ex.sub}</Text> : null}
        </Prompt>
      ) : ex.audio ? (
        <Speech speaker="norppa" size={68}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <SpeakerButton text={ex.audio.text} id={ex.audio.id} size="md" />
            <Text style={{ fontSize: 17, flexShrink: 1 }}>{ex.sub}</Text>
          </View>
        </Speech>
      ) : (
        <Speech speaker="norppa" size={68}>
          <Text style={{ fontSize: 18, lineHeight: 24, fontWeight: '700' }}>{ex.sub ?? 'Three of these belong together. One is an intruder. Tap it.'}</Text>
        </Speech>
      )}
      <View style={twoUp ? { flexDirection: 'row', gap: 12 } : { gap: 12 }}>
        {ex.choices.map((c) => (
          <View key={c} style={twoUp ? { flex: 1 } : undefined}>
            <Chip
              label={c}
              selected={sel === c}
              disabled={locked}
              tone={locked ? (c === ex.answer ? 'success' : sel === c ? 'danger' : undefined) : undefined}
              onPress={() => setSel(c)}
            />
          </View>
        ))}
      </View>
      {!locked && (
        <Button title="Tarkista · Check" disabled={!sel} onPress={() => onSubmit({ correct: sel === ex.answer, expected: ex.answer, note: ex.note })} />
      )}
    </View>
  );
}

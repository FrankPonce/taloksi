import { useState } from 'react';
import { TextInput, View } from 'react-native';
import type { Exercise } from '../../engine/exercises';
import { checkAnswer } from '../../engine/text';
import { useApp } from '../../state/store';
import { colors, font, hardShadow, OUTLINE, radius } from '../../theme';
import { Button, Chip } from '../ui';
import { ExTitle, Prompt } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'type' }>;

export function TypeAnswer({ ex, locked, onSubmit }: ExProps<E>) {
  const strict = useApp((s) => s.settings.strictUmlauts);
  const [text, setText] = useState('');
  const toFinnish = ex.dir === 'en-fi';
  const submit = () => {
    const r = checkAnswer(text, ex.accepted, toFinnish ? 'fi' : 'en', { strictUmlauts: strict });
    onSubmit({ correct: r.correct, expected: r.expected, note: r.note });
  };
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.orange}>{toFinnish ? 'Kirjoita suomeksi · Type it in Finnish' : 'Kirjoita englanniksi · Type it in English'}</ExTitle>
      <Prompt text={ex.prompt} speaker={toFinnish ? 'norppa' : ex.speaker} audio={toFinnish ? undefined : { text: ex.fi, id: ex.itemId }} />
      <TextInput
        value={text}
        onChangeText={setText}
        editable={!locked}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
        placeholder={toFinnish ? 'Kirjoita tähän…' : 'Type here…'}
        placeholderTextColor={colors.mutedOnPaper}
        onSubmitEditing={submit}
        style={{
          minHeight: 96,
          borderWidth: OUTLINE,
          borderColor: colors.ink,
          borderRadius: radius.md,
          backgroundColor: colors.paper,
          boxShadow: hardShadow(colors.ink, 4),
          padding: 12,
          fontSize: 20,
          fontFamily: font.bold,
          color: colors.ink,
          textAlignVertical: 'top',
        }}
      />
      {toFinnish && !locked && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {['ä', 'ö', 'å'].map((ch) => (
            <Chip key={ch} label={ch} onPress={() => setText((t) => t + ch)} />
          ))}
        </View>
      )}
      {!locked && <Button title="Tarkista · Check" disabled={!text.trim()} onPress={submit} />}
    </View>
  );
}

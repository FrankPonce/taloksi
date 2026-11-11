import { useEffect } from 'react';
import { View } from 'react-native';
import { speak } from '../../audio/speak';
import type { Exercise } from '../../engine/exercises';
import { useApp } from '../../state/store';
import { colors } from '../../theme';
import { Speech } from '../art';
import { Text } from '../Text';
import { SpeakerButton } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';
import { WordBank } from './WordBank';

type E = Extract<Exercise, { kind: 'listen' }>;

export function Listen({ ex, locked, onSubmit }: ExProps<E>) {
  const rate = useApp((s) => s.settings.audioRate);
  useEffect(() => {
    speak(ex.fi, { id: ex.itemId, rate, speaker: ex.speaker });
  }, [ex.key]);
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.red}>Kuuntele · Tap what you hear</ExTitle>
      <Speech speaker={ex.speaker} size={68}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <SpeakerButton text={ex.fi} id={ex.itemId} speaker={ex.speaker} size="md" />
          {locked ? <Text style={{ fontSize: 18, fontWeight: '700', flexShrink: 1 }}>{ex.fi}</Text> : null}
        </View>
      </Speech>
      <WordBank key={ex.key} tiles={ex.tiles} accepted={ex.accepted} lang="fi" locked={locked} onSubmit={onSubmit} />
    </View>
  );
}

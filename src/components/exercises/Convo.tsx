import { useEffect } from 'react';
import { View } from 'react-native';
import { speak } from '../../audio/speak';
import type { Exercise } from '../../engine/exercises';
import { useApp } from '../../state/store';
import { colors, OUTLINE } from '../../theme';
import { Avatar, Speech } from '../art';
import { Text } from '../Text';
import { Glossed, SpeakerButton } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';
import { WordBank } from './WordBank';

type E = Extract<Exercise, { kind: 'convo' }>;

/** One turn of a conversation. Earlier turns stay on screen so it reads like a chat. */
export function Convo({ ex, locked, onSubmit }: ExProps<E>) {
  const rate = useApp((s) => s.settings.audioRate);
  useEffect(() => {
    speak(ex.them.fi, { id: ex.audioId, rate, speaker: ex.with });
  }, [ex.key]);
  return (
    <View style={{ gap: 14 }}>
      <ExTitle color={colors.berry}>{`Keskustelu ${ex.step}/${ex.total} · ${ex.title}`}</ExTitle>

      {ex.history.map((h, i) =>
        h.who === 'them' ? (
          <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', opacity: 0.75 }}>
            <Avatar id={ex.with} size={30} />
            <View style={{ backgroundColor: colors.paperDim, borderWidth: 2, borderColor: colors.ink, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 1 }}>
              <Text style={{ fontSize: 15, color: colors.ink }}>{h.fi}</Text>
            </View>
          </View>
        ) : (
          <View key={i} style={{ alignSelf: 'flex-end', backgroundColor: colors.gold, borderWidth: 2, borderColor: colors.ink, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, maxWidth: '85%', opacity: 0.85 }}>
            <Text style={{ fontSize: 15, color: colors.ink, fontWeight: '700' }}>{h.fi}</Text>
          </View>
        )
      )}

      <Speech speaker={ex.with} size={68} mood="question">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <SpeakerButton text={ex.them.fi} id={ex.audioId} speaker={ex.with} size="sm" />
          <Glossed text={ex.them.fi} size={20} />
        </View>
      </Speech>

      <View style={{ alignSelf: 'flex-end', maxWidth: '90%', borderWidth: OUTLINE, borderStyle: 'dashed', borderColor: colors.gold, borderRadius: 6, padding: 10 }}>
        <Text style={{ fontSize: 13, color: colors.mutedOnNight }}>Vastaa · Your reply</Text>
        <Text style={{ fontSize: 19, lineHeight: 24, fontWeight: '700' }}>{ex.you.en}</Text>
      </View>

      <WordBank key={ex.key} tiles={ex.tiles} accepted={[ex.you.fi]} lang="fi" locked={locked} onSubmit={onSubmit} />
    </View>
  );
}

import { View } from 'react-native';
import type { Exercise } from '../../engine/exercises';
import { colors } from '../../theme';
import { Speech } from '../art';
import { Text } from '../Text';
import { SpeakerButton, WordPic } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';
import { WordBank } from './WordBank';

type E = Extract<Exercise, { kind: 'spell' }>;

/** Spell a word from letter tiles. Finnish is written as it sounds, so listen for the long letters. */
export function Spell({ ex, locked, onSubmit }: ExProps<E>) {
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.aurora}>Tavaa · Spell the word</ExTitle>
      <Speech speaker="norppa" size={68}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {ex.icon ? <WordPic icon={ex.icon} size={64} /> : null}
          <View style={{ flexShrink: 1, gap: 6 }}>
            <Text style={{ fontSize: 24, fontWeight: '700' }}>{ex.en}</Text>
            <SpeakerButton text={ex.fi} id={ex.itemId} size="sm" />
          </View>
        </View>
      </Speech>
      <WordBank key={ex.key} tiles={ex.tiles} accepted={[ex.fi]} lang="fi" joiner="" locked={locked} onSubmit={onSubmit} />
    </View>
  );
}

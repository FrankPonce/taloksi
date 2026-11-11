import { View } from 'react-native';
import type { Exercise } from '../../engine/exercises';
import { ExTitle, Prompt } from './parts';
import type { ExProps } from './types';
import { WordBank } from './WordBank';

type E = Extract<Exercise, { kind: 'build' }>;

export function Build({ ex, locked, onSubmit }: ExProps<E>) {
  const fromFinnish = ex.dir === 'fi-en';
  return (
    <View style={{ gap: 18 }}>
      <ExTitle>{fromFinnish ? 'Käännä englanniksi · Translate to English' : 'Käännä suomeksi · Translate to Finnish'}</ExTitle>
      <Prompt text={ex.prompt} fi={fromFinnish} speaker={fromFinnish ? ex.speaker : undefined} audio={fromFinnish ? { text: ex.fi, id: ex.itemId } : undefined} />
      <WordBank key={ex.key} tiles={ex.tiles} accepted={ex.accepted} lang={fromFinnish ? 'en' : 'fi'} locked={locked} onSubmit={onSubmit} />
    </View>
  );
}

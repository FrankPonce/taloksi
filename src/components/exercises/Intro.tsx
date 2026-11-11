import { useEffect } from 'react';
import { View } from 'react-native';
import { speak } from '../../audio/speak';
import type { Exercise } from '../../engine/exercises';
import { useApp } from '../../state/store';
import { colors, font } from '../../theme';
import { Norppa } from '../art';
import { Text } from '../Text';
import { Button, Muted, Panel, PosTag, PuheLine, SpeakerButton, WordPic } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'intro' }>;

export function Intro({ ex, onSubmit }: ExProps<E>) {
  const rate = useApp((s) => s.settings.audioRate);
  const w = ex.word;
  useEffect(() => {
    speak(w.fi, { id: w.id, rate });
  }, [w.id]);
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.aurora}>Uusi sana · New word</ExTitle>
      <Panel halftone tilt={-0.6} style={{ alignItems: 'center', paddingVertical: 28, gap: 14 }}>
        <WordPic icon={w.icon} size={112} />
        <Text style={{ fontFamily: font.display, fontSize: 48, lineHeight: 52, textAlign: 'center' }}>{w.fi}</Text>
        <PosTag pos={w.pos} />
        <SpeakerButton text={w.fi} id={w.id} />
        <View style={{ backgroundColor: colors.ink, paddingHorizontal: 14, paddingVertical: 4, transform: [{ rotate: '1.5deg' }] }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.paper, textAlign: 'center' }}>{w.en}</Text>
        </View>
        <PuheLine puhe={w.puhe} id={w.id} />
      </Panel>
      {w.note ? (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Norppa size={54} />
          <Muted style={{ flex: 1 }}>{w.note}</Muted>
        </View>
      ) : null}
      <Button title="Jatka · Continue" onPress={() => onSubmit({ correct: true })} />
    </View>
  );
}

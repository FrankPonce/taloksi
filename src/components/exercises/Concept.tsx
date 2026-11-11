import { View } from 'react-native';
import { exampleAudio, type Exercise } from '../../engine/exercises';
import { colors, font } from '../../theme';
import { Speech, useHost } from '../art';
import { Text } from '../Text';
import { Button, Panel, SpeakerButton } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'concept' }>;

/**
 * A concept card: the lesson's host explains one new ending or rule, with
 * examples side by side, before it shows up in any sentence.
 */
export function Concept({ ex, onSubmit }: ExProps<E>) {
  const c = ex.card;
  const host = useHost();
  return (
    <View style={{ gap: 18 }}>
      <ExTitle color={colors.berry}>Uusi asia · Something new</ExTitle>
      <Speech speaker={host.id} size={68} mood="excited">
        <Text style={{ fontFamily: font.display, fontSize: 28, lineHeight: 32 }}>{c.title}</Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.mutedOnPaper }}>{c.titleEn}</Text>
      </Speech>
      <Panel halftone tilt={-0.4} style={{ gap: 12 }}>
        {c.body.map((p, i) => (
          <Text key={i} style={{ fontSize: 16, lineHeight: 23 }}>
            {p}
          </Text>
        ))}
        <View style={{ gap: 8, marginTop: 4 }}>
          {c.examples.map((e, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 6,
                paddingHorizontal: 8,
                backgroundColor: i % 2 ? 'transparent' : colors.paperDim,
              }}
            >
              <SpeakerButton text={e.fi} id={exampleAudio(c, i)} size="sm" />
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 8 }}>
                {e.from ? <Text style={{ fontSize: 17, color: colors.mutedOnPaper }}>{e.from} →</Text> : null}
                <Text style={{ fontFamily: font.display, fontSize: 22 }}>{e.fi}</Text>
                <Text style={{ fontSize: 15, color: colors.mutedOnPaper }}>{e.en}</Text>
              </View>
            </View>
          ))}
        </View>
      </Panel>
      <Button title="Selvä · Got it" onPress={() => onSubmit({ correct: true })} />
    </View>
  );
}

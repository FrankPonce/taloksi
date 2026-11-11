import { type ReactNode } from 'react';
import { View } from 'react-native';
import { colors } from '../../theme';
import { Speech } from '../art';
import { Text } from '../Text';
import { Glossed, SpeakerButton, Tag } from '../ui';

/** Slanted instruction label at the top of every exercise */
export function ExTitle({ children, color = colors.gold }: { children: string; color?: string }) {
  return <Tag label={children} color={color} size={16} tilt={-1.5} style={{ marginBottom: 4 }} />;
}

/** A character saying the prompt, with an audio button when it is Finnish */
export function Prompt({
  text,
  speaker,
  audio,
  big,
  fi,
  children,
}: {
  text: string;
  speaker?: string;
  audio?: { text: string; id?: string };
  big?: boolean;
  /** the text is a Finnish sentence: make its words tappable for a translation */
  fi?: boolean;
  children?: ReactNode;
}) {
  return (
    <Speech speaker={speaker ?? 'norppa'} size={68}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {audio && <SpeakerButton text={audio.text} id={audio.id} speaker={speaker} size="sm" />}
        {fi ? <Glossed text={text} /> : <Text style={{ fontSize: big ? 30 : 22, lineHeight: big ? 34 : 28, fontWeight: '700', flexShrink: 1 }}>{text}</Text>}
      </View>
      {children}
    </Speech>
  );
}

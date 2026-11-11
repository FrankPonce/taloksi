import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { speak } from '../../src/audio/speak';
import { Norppa, Speech } from '../../src/components/art';
import { Breakdown } from '../../src/components/Breakdown';
import { BackButton, goBack, Button, Chip, H1, Muted, Panel, Screen, SpeakerButton, Tag, Text } from '../../src/components/ui';
import { getCharacter, getStory } from '../../src/content';
import { useApp } from '../../src/state/store';
import { colors, font } from '../../src/theme';

export default function StoryScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  // Listening mode: hear each line first; the text stays hidden until you tap it
  const listening = mode === 'listen';
  const story = getStory(String(id));
  const s = useApp();
  const [shown, setShown] = useState(1);
  const [open, setOpen] = useState<string[]>([]);
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);

  const last = story?.lines[shown - 1];
  useEffect(() => {
    if (last) speak(last.fi, { id: last.id, rate: s.settings.audioRate, speaker: last.speakerId });
  }, [shown]);

  if (!story) {
    return (
      <Screen>
        <H1>Not found</H1>
      </Screen>
    );
  }
  const allShown = shown >= story.lines.length;
  const question = story.questions[q];

  if (done) {
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 18, paddingTop: 24 }}>
          <Norppa size={200} mood="cheer" burst={colors.aurora} />
          <H1 accent={colors.aurora}>Tarina luettu!</H1>
          <Muted>
            {right}/{story.questions.length} questions right · +15 XP
          </Muted>
          <Button title="Jatka · Continue" onPress={() => goBack()} style={{ alignSelf: 'stretch' }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackButton />
      <H1 accent={colors.red}>{story.title}</H1>
      {listening && <Tag label="Kuuntelu // Listening" color={colors.red} />}
      <Muted>
        {story.titleEn} · {listening ? 'listen first. Tap a line only if you need to read it' : 'tap a line to translate it and take it apart'}
      </Muted>

      {story.lines.slice(0, shown).map((l) => {
        const c = getCharacter(l.speakerId);
        const isOpen = open.includes(l.id);
        return (
          <Pressable key={l.id} onPress={() => setOpen((o) => (o.includes(l.id) ? o.filter((x) => x !== l.id) : [...o, l.id]))}>
            <Speech speaker={l.speakerId} size={60} color={l.speakerId === 'sofia' ? '#FFE9B0' : colors.paper}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <SpeakerButton text={l.fi} id={l.id} speaker={l.speakerId} size="sm" />
                <View style={{ flexShrink: 1 }}>
                  {!c && l.speaker ? <Text style={{ fontFamily: font.label, fontSize: 12, letterSpacing: 1 }}>{l.speaker.toUpperCase()}</Text> : null}
                  <Text style={{ fontSize: 19, lineHeight: 25, fontWeight: '700', color: listening && !isOpen ? colors.mutedOnPaper : colors.ink }}>
                    {listening && !isOpen ? '• • •   tap to read' : l.fi}
                  </Text>
                </View>
              </View>
              {isOpen && (
                <>
                  <Text style={{ fontSize: 16, color: colors.mutedOnPaper }}>{l.en}</Text>
                  <Breakdown fi={l.fi} />
                </>
              )}
            </Speech>
          </Pressable>
        );
      })}

      {!allShown && <Button title="Seuraava · Next" icon="arrow-forward" onPress={() => setShown(shown + 1)} />}

      {allShown && question && (
        <Panel color={colors.gold} halftone>
          <Tag label={`Kysymys ${q + 1}/${story.questions.length}`} tilt={-2} />
          <Text style={{ fontSize: 21, lineHeight: 26, fontWeight: '700' }}>{question.q}</Text>
          <View style={{ gap: 10 }}>
            {question.choices.map((c, i) => (
              <Chip
                key={c}
                label={c}
                disabled={picked !== null}
                tone={picked === null ? undefined : i === question.answer ? 'success' : picked === i ? 'danger' : undefined}
                onPress={() => {
                  setPicked(i);
                  if (i === question.answer) setRight((r) => r + 1);
                }}
              />
            ))}
          </View>
          {picked !== null && (
            <Button
              title="Jatka · Continue"
              onPress={() => {
                setPicked(null);
                if (q + 1 >= story.questions.length) {
                  s.completeStory(story.id, 15);
                  setDone(true);
                } else setQ(q + 1);
              }}
            />
          )}
        </Panel>
      )}
    </Screen>
  );
}

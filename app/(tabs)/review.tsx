import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Norppa } from '../../src/components/art';
import { Breakdown } from '../../src/components/Breakdown';
import { Button, H1, Muted, Panel, ProgressBar, PuheLine, Screen, SpeakerButton, Tag, Text } from '../../src/components/ui';
import { getItem } from '../../src/content';
import { sample } from '../../src/engine/random';
import { dueIds, type Grade } from '../../src/engine/srs';
import { useApp } from '../../src/state/store';
import { colors, font, hardShadow, onColor, OUTLINE } from '../../src/theme';

const SESSION = 15;
const GRADES: { g: Grade; fi: string; en: string; color: string }[] = [
  { g: 'again', fi: 'Uudelleen', en: 'Again', color: colors.red },
  { g: 'hard', fi: 'Vaikea', en: 'Hard', color: colors.orange },
  { g: 'good', fi: 'Hyvä', en: 'Good', color: colors.success },
  { g: 'easy', fi: 'Helppo', en: 'Easy', color: colors.blue },
];

export default function ReviewScreen() {
  const s = useApp();
  const visible = (id: string) => {
    const it = getItem(id);
    return !!it && (s.settings.adult || !it.adult);
  };
  const due = dueIds(s.srs).filter(visible);
  const learned = Object.keys(s.srs).filter(visible);
  const [session, setSession] = useState<{ ids: string[]; i: number; front: 'fi' | 'en' } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  const start = (ids: string[]) => {
    setSession({ ids: ids.slice(0, SESSION), i: 0, front: Math.random() < 0.5 ? 'fi' : 'en' });
    setRevealed(false);
    setDoneCount(0);
  };

  const id = session?.ids[session.i];
  const item = useMemo(() => (id ? getItem(id) : undefined), [id]);

  const rate = (g: Grade) => {
    if (!session || !id) return;
    s.review(id, g);
    const n = doneCount + 1;
    setDoneCount(n);
    if (session.i + 1 >= session.ids.length) {
      s.earnXp(Math.max(3, n));
      if (n >= 5) s.gainHeart();
      setSession(null);
    } else {
      setSession({ ...session, i: session.i + 1, front: Math.random() < 0.5 ? 'fi' : 'en' });
      setRevealed(false);
    }
  };

  if (session && item) {
    const front = session.front === 'fi' ? item.fi : item.en;
    const back = session.front === 'fi' ? item.en : item.fi;
    return (
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Tag label={`${session.i + 1}/${session.ids.length} · ${item.kind === 'word' ? 'Sana' : 'Lause'}`} color={colors.gold} />
          <ProgressBar value={session.i / session.ids.length} color={colors.gold} />
        </View>
        <Pressable onPress={() => setRevealed(true)}>
          <Panel halftone tilt={-0.8} style={{ minHeight: 280, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            {item.speaker && <Avatar id={item.speaker} size={56} />}
            <Text style={styles.front}>{front}</Text>
            {session.front === 'fi' && <SpeakerButton text={item.fi} id={item.id} speaker={item.speaker} />}
            {revealed ? (
              <>
                <View style={styles.divider} />
                <Text style={styles.back}>{back}</Text>
                {session.front === 'en' && <SpeakerButton text={item.fi} id={item.id} speaker={item.speaker} />}
                <PuheLine puhe={item.puhe} id={item.id} />
                {item.kind === 'sentence' && (
                  <View style={{ alignSelf: 'stretch' }}>
                    <Breakdown fi={item.fi} />
                  </View>
                )}
              </>
            ) : (
              <Tag label="Napauta · Tap to reveal" color={colors.ink} tilt={2} />
            )}
          </Panel>
        </Pressable>
        {revealed && (
          <>
            <Muted>How well did you remember it? Be honest. It sets when you see this card again.</Muted>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {GRADES.map(({ g, fi, en, color }) => (
                <Pressable key={g} onPress={() => rate(g)} style={[styles.grade, { backgroundColor: color }]}>
                  <Text style={{ fontFamily: font.label, fontSize: 16, color: onColor(color), textTransform: 'uppercase' }}>{fi}</Text>
                  <Text style={{ fontSize: 12, color: onColor(color) }}>{en}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        <Button title="Lopeta · Stop" variant="ghost" onPress={() => setSession(null)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <H1 accent={colors.gold}>Kertaus · Review</H1>
      <Muted>Flashcards on a spaced-repetition schedule (FSRS). Each card comes back just before you would forget it.</Muted>
      <Panel color={due.length ? colors.gold : colors.paper} halftone style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Norppa size={86} mood={due.length ? 'happy' : 'cheer'} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontFamily: font.display, fontSize: 60, lineHeight: 60 }}>{due.length}</Text>
          <Text style={{ fontFamily: font.label, fontSize: 17, textTransform: 'uppercase' }}>kerrattavaa nyt · cards due now</Text>
          <Text style={{ fontSize: 14 }}>{learned.length} learned in total</Text>
        </View>
      </Panel>
      <Button title={due.length ? 'Aloita kertaus · Start review' : 'Kaikki kerrattu · All caught up'} icon="flash" disabled={!due.length} onPress={() => start(due)} />
      {learned.length > 0 && (
        <Panel>
          <Text style={{ fontFamily: font.label, fontSize: 19, textTransform: 'uppercase' }}>Lisäharjoitus · Extra practice</Text>
          <Muted>Shuffle through things you already know. Finishing five or more cards earns back a heart.</Muted>
          <Button title="Sekoita · Shuffle" variant="gold" icon="shuffle" onPress={() => start(sample(learned, SESSION))} />
        </Panel>
      )}
      {!learned.length && <Muted>Finish a lesson first. Its words and sentences land here automatically.</Muted>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  front: { fontFamily: font.display, fontSize: 34, lineHeight: 38, textAlign: 'center' },
  back: { fontSize: 24, lineHeight: 30, fontWeight: '700', textAlign: 'center' },
  divider: { height: OUTLINE, alignSelf: 'stretch', backgroundColor: colors.ink },
  grade: {
    flex: 1,
    borderRadius: 6,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    paddingVertical: 10,
    alignItems: 'center',
    boxShadow: hardShadow(colors.ink, 3),
  },
});

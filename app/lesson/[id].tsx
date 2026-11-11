import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Norppa } from '../../src/components/art';
import { Breakdown } from '../../src/components/Breakdown';
import { ExerciseView, isSilent, type ExerciseResult } from '../../src/components/exercises';
import { Surface } from '../../src/components/Text';
import { BackButton, goBack, Button, H1, Muted, Panel, ProgressBar, PuheLine, Screen, Tag, Text, Verdict } from '../../src/components/ui';
import { getItem, getLesson } from '../../src/content';
import { buildLessonExercises, lessonItemIds, type Exercise } from '../../src/engine/exercises';
import { sample } from '../../src/engine/random';
import { useApp } from '../../src/state/store';
import { colors, font, hardShadow, OUTLINE } from '../../src/theme';

const PRAISE = ['Oikein!', 'Hienoa!', 'Mahtavaa!', 'Loistavaa!', 'Hyvin menee!', 'Just noin!'];

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(String(id));
  const s = useApp();
  const replay = !!s.lessons[String(id)];

  const initialQueue = useMemo(() => {
    if (!lesson) return [];
    // Warm up with two words learned in earlier lessons (spaced retrieval)
    const mine = new Set(lessonItemIds(lesson));
    const older = Object.keys(s.srs).filter((x) => !mine.has(x) && getItem(x)?.kind === 'word');
    return buildLessonExercises(lesson, {
      replay,
      adult: lesson.track === 'adult',
      warmupIds: sample(older, 2),
      lessonIndex: lesson.order,
    });
  }, [id]);
  const [queue, setQueue] = useState<Exercise[]>(initialQueue);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [summary, setSummary] = useState<{ xp: number; accuracy: number } | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!lesson) {
    return (
      <Screen>
        <H1>Lesson not found</H1>
        <Button title="Takaisin · Back" onPress={() => goBack()} />
      </Screen>
    );
  }

  const ex = queue[index];
  const outOfHearts = !s.settings.unlimitedHearts && s.hearts.count <= 0 && !summary && !result;

  const finish = (sc = score) => {
    const accuracy = sc.answered ? sc.correct / sc.answered : 1;
    const xp = (replay ? 5 : 10) + (accuracy === 1 ? 5 : 0);
    s.completeLesson(lesson.id, lessonItemIds(lesson), accuracy, xp);
    setSummary({ xp, accuracy });
  };

  const advance = (sc = score) => {
    setResult(null);
    setShowBreakdown(false);
    if (index + 1 >= queue.length) finish(sc);
    else setIndex(index + 1);
  };

  const onSubmit = (r: ExerciseResult) => {
    if (isSilent(ex)) return advance();
    const sc = { correct: score.correct + (r.correct ? 1 : 0), answered: score.answered + 1 };
    setScore(sc);
    s.recordAnswer(r.correct);
    if (!r.correct) {
      s.loseHeart();
      // Missed exercises come back once at the end of the lesson
      if (!ex.key.endsWith('-r')) setQueue((q) => [...q, { ...ex, key: `${ex.key}-r` } as Exercise]);
    }
    setResult(r);
  };

  if (summary) {
    const perfect = summary.accuracy === 1;
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 18, paddingTop: 24 }}>
          <Norppa size={210} mood="cheer" burst={perfect ? colors.gold : colors.aurora} />
          <View style={{ transform: [{ rotate: '-3deg' }], alignItems: 'center' }}>
            <Text style={{ fontFamily: font.display, fontSize: 52, lineHeight: 54, textTransform: 'uppercase', textAlign: 'center' }}>
              {perfect ? 'Täydellinen!' : 'Valmis!'}
            </Text>
            <Tag label={perfect ? 'Perfect lesson' : 'Lesson complete'} color={colors.gold} size={18} tilt={2} style={{ alignSelf: 'center' }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 14, alignSelf: 'stretch' }}>
            <Panel color={colors.gold} tilt={-2} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.big}>+{summary.xp}</Text>
              <Text style={styles.bigLabel}>XP</Text>
            </Panel>
            <Panel color={colors.aurora} tilt={2} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.big}>{Math.round(summary.accuracy * 100)}%</Text>
              <Text style={styles.bigLabel}>Tarkkuus · Accuracy</Text>
            </Panel>
          </View>
          {s.newAchievements.length > 0 && (
            <Panel color={colors.berry} style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="trophy" size={26} color={colors.paper} />
              <Text style={{ fontFamily: font.label, fontSize: 19, textTransform: 'uppercase' }}>Uusi saavutus · New achievement</Text>
            </Panel>
          )}
          <Button
            title="Jatka · Continue"
            onPress={() => {
              s.clearNewAchievements();
              goBack();
            }}
            style={{ alignSelf: 'stretch' }}
          />
        </View>
      </Screen>
    );
  }

  if (outOfHearts) {
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 18, paddingTop: 24 }}>
          <Norppa size={190} mood="sad" burst={colors.red} />
          <H1 accent={colors.red}>Sydämet loppuivat</H1>
          <Muted>Out of hearts. They refill over time, or you can earn one back by reviewing flashcards.</Muted>
          <Button title="Kertaa · Review to earn a heart" icon="flash" onPress={() => router.replace('/review')} style={{ alignSelf: 'stretch' }} />
          <Button title="Lopeta · Quit" variant="secondary" onPress={() => goBack()} style={{ alignSelf: 'stretch' }} />
        </View>
      </Screen>
    );
  }

  const item = ex && 'itemId' in ex && ex.itemId ? getItem(ex.itemId) : undefined;
  const isSentence = item?.kind === 'sentence';

  return (
    <Screen>
      <View style={styles.top}>
        <BackButton />
        <ProgressBar value={index / queue.length} />
        <View style={styles.hearts}>
          <Ionicons name="heart" size={18} color={colors.paper} />
          <Text style={{ fontFamily: font.display, fontSize: 20, color: colors.paper }}>{s.settings.unlimitedHearts ? '∞' : s.hearts.count}</Text>
        </View>
      </View>

      {ex && <ExerciseView ex={ex} locked={!!result} onSubmit={onSubmit} />}

      {result && (
        <Verdict ok={result.correct} title={result.correct ? PRAISE[index % PRAISE.length] : 'Ei aivan · Not quite'}>
          {!result.correct && result.expected ? (
            <Text style={styles.fbText}>
              <Text style={[styles.fbText, { fontFamily: font.label, textTransform: 'uppercase' }]}>Oikea vastaus: </Text>
              {result.expected}
            </Text>
          ) : null}
          {result.note ? <Text style={styles.fbText}>{result.note}</Text> : null}
          {item && (
            <Text style={styles.fbText}>
              {item.fi} = {item.en}
            </Text>
          )}
          <PuheLine puhe={item?.puhe} id={item?.id} />
          {isSentence && item && (
            <>
              <Pressable onPress={() => setShowBreakdown((v) => !v)} style={styles.breakBtn}>
                <Ionicons name={showBreakdown ? 'chevron-up' : 'cut'} size={18} color={colors.ink} />
                <Text style={{ fontFamily: font.label, fontSize: 16, color: colors.ink, textTransform: 'uppercase' }}>
                  {showBreakdown ? 'Piilota · Hide breakdown' : 'Pura lause · Break it down'}
                </Text>
              </Pressable>
              {showBreakdown && (
                <Surface.Provider value="paper">
                  <View style={styles.breakBox}>
                    <Breakdown fi={item.fi} />
                  </View>
                </Surface.Provider>
              )}
            </>
          )}
          <Button title="Jatka · Continue" variant="secondary" onPress={() => advance()} />
        </Verdict>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  hearts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.red,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    transform: [{ rotate: '3deg' }],
    boxShadow: hardShadow(colors.ink, 3),
  },
  fbText: { fontSize: 17, lineHeight: 23, fontWeight: '700' },
  big: { fontFamily: font.display, fontSize: 44, lineHeight: 46 },
  bigLabel: { fontFamily: font.label, fontSize: 15, letterSpacing: 0.6, textTransform: 'uppercase' },
  breakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    transform: [{ rotate: '-1deg' }],
  },
  breakBox: { backgroundColor: colors.paper, borderWidth: OUTLINE, borderColor: colors.ink, borderRadius: 6, padding: 10 },
});

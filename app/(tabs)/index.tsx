import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Norppa } from '../../src/components/art';
import { Halftone, Muted, Panel, ProgressBar, Screen, StatPill, Tag, Text } from '../../src/components/ui';
import { cultureFor, currentStage, isLessonUnlocked, visibleUnits } from '../../src/content';
import { todayKey } from '../../src/engine/dates';
import { liveStreak, useApp } from '../../src/state/store';
import { colors, font, hardShadow, levelColors, onColor, OUTLINE } from '../../src/theme';

/** Which character fronts each lesson node, in rotation */
const HOSTS = ['anna', 'pekka', 'aino', 'helvi', 'mikko', 'samir'];

export default function LearnScreen() {
  const s = useApp();
  useFocusEffect(
    useCallback(() => {
      s.syncHearts();
    }, [])
  );
  const dailyXp = s.daily.day === todayKey() ? s.daily.xp : 0;
  const { stage, progress } = currentStage(s.lessons);
  const units = visibleUnits(s.settings.adult);
  let host = 0;

  return (
    <Screen>
      <View style={styles.statsRow}>
        <StatPill icon="flame" value={liveStreak(s)} color={colors.orange} />
        <StatPill icon="star" value={s.xp} color={colors.gold} />
        <StatPill icon="heart" value={s.settings.unlimitedHearts ? '∞' : s.hearts.count} color={colors.red} />
      </View>

      {/* Where you are on the road to C2 */}
      <Pressable onPress={() => router.push('/journey')}>
        <Panel color={levelColors[stage.cefr]} halftone style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.levelBadge}>
            <Text style={{ fontFamily: font.display, fontSize: 26, color: colors.paper }}>{stage.code}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: font.display, fontSize: 24, textTransform: 'uppercase' }}>
              {stage.name} · {stage.nameEn}
            </Text>
            <ProgressBar value={progress} color={colors.paper} />
            <Text style={{ fontSize: 13, fontWeight: '700' }}>Matka A1 → C2 · See the whole journey</Text>
          </View>
          <Ionicons name="chevron-forward" size={26} color={onColor(levelColors[stage.cefr])} />
        </Panel>
      </Pressable>

      <Panel style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Norppa size={58} mood={dailyXp >= s.settings.dailyGoal ? 'cheer' : 'happy'} />
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ fontFamily: font.label, fontSize: 17, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Päivän tavoite · Daily goal
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <ProgressBar value={dailyXp / s.settings.dailyGoal} color={colors.gold} />
            <Text style={{ fontFamily: font.label, fontSize: 16 }}>
              {Math.min(dailyXp, s.settings.dailyGoal)}/{s.settings.dailyGoal} XP
            </Text>
          </View>
        </View>
      </Panel>

      {units.map((u, ui) => {
        const done = u.lessons.filter((l) => s.lessons[l.id]).length;
        const adult = u.track === 'adult';
        const notes = cultureFor(u.id);
        return (
          <View key={u.id} style={{ gap: 16, marginTop: 14 }}>
            <View style={[styles.unitHeader, { backgroundColor: u.color }]}>
              <Halftone color={colors.ink} opacity={0.16} />
              <View style={{ flex: 1, gap: 2 }}>
                <Tag label={adult ? '18+ · Lisäosa // Bonus pack' : `Osa ${ui + 1} // Unit ${ui + 1}`} tilt={-2} />
                <Text style={[styles.unitTitle, { color: onColor(u.color) }]}>{u.title}</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: onColor(u.color) }}>
                  {u.titleEn} · {done}/{u.lessons.length}
                </Text>
              </View>
              <Pressable onPress={() => router.push(`/grammar/${u.grammar[0].id}`)} style={styles.tipsBtn} accessibilityLabel="Grammar tips">
                <Ionicons name="book" size={22} color={colors.ink} />
                <Text style={{ fontFamily: font.label, fontSize: 11, color: colors.ink }}>KIELIOPPI</Text>
              </Pressable>
            </View>

            {u.lessons.map((l, li) => {
              const unlocked = isLessonUnlocked(l.id, s.lessons, s.settings.unlockAll);
              const rec = s.lessons[l.id];
              const offset = [0, 46, 80, 46][li % 4];
              const who = HOSTS[host++ % HOSTS.length];
              const fill = !unlocked ? colors.nightSoft : rec ? colors.gold : colors.paper;
              return (
                <Pressable key={l.id} disabled={!unlocked} onPress={() => router.push(`/lesson/${l.id}`)} style={[styles.node, { marginLeft: offset }]}>
                  <View style={{ opacity: unlocked ? 1 : 0.45 }}>
                    <Avatar id={who} size={70} mood={rec ? 'cheer' : 'happy'} />
                    <View style={[styles.nodeBadge, { backgroundColor: !unlocked ? colors.locked : rec ? colors.gold : u.color }]}>
                      <Ionicons name={!unlocked ? 'lock-closed' : rec ? 'checkmark' : 'play'} size={14} color={colors.ink} />
                    </View>
                  </View>
                  <View style={[styles.nodeLabel, { backgroundColor: fill, boxShadow: hardShadow(colors.ink, unlocked ? 4 : 0) }]}>
                    <Text style={{ fontFamily: font.display, fontSize: 22, color: unlocked ? colors.ink : colors.mutedOnNight }}>{l.title}</Text>
                    <Text style={{ fontSize: 14, color: unlocked ? colors.mutedOnPaper : colors.mutedOnNight }}>
                      {l.titleEn}
                      {rec ? ` · ${Math.round(rec.bestAccuracy * 100)}%` : ''}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            {notes.map((c) => (
              <Pressable key={c.id} onPress={() => router.push(`/culture/${c.id}`)}>
                <View style={styles.culture}>
                  <Ionicons name={c.icon as never} size={22} color={colors.aurora} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: font.label, fontSize: 12, letterSpacing: 1, color: colors.aurora }}>KULTTUURI · CULTURE</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>{c.titleEn}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.mutedOnNight} />
                </View>
              </Pressable>
            ))}
          </View>
        );
      })}
      <Muted>Lisää osia tulossa · More units are on the way. The journey map shows what is planned.</Muted>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, paddingTop: 4 },
  levelBadge: {
    backgroundColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 6,
    transform: [{ rotate: '-5deg' }],
    borderRadius: 4,
  },
  unitHeader: {
    borderRadius: 6,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    boxShadow: hardShadow(colors.ink, 6),
    overflow: 'hidden',
    transform: [{ rotate: '-0.6deg' }],
  },
  unitTitle: { fontFamily: font.display, fontSize: 34, lineHeight: 36, textTransform: 'uppercase', marginTop: 4 },
  tipsBtn: {
    backgroundColor: colors.paper,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    boxShadow: hardShadow(colors.ink, 3),
    transform: [{ rotate: '3deg' }],
  },
  node: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nodeBadge: {
    position: 'absolute',
    right: -6,
    bottom: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabel: {
    flexShrink: 1,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    transform: [{ rotate: '-1deg' }],
  },
  culture: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.aurora,
    borderRadius: 6,
    padding: 12,
  },
});

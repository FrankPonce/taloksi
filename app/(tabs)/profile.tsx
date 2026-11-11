import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Norppa } from '../../src/components/art';
import { Button, Chip, H1, H2, Muted, Panel, Screen, Tag, Text, type IconName } from '../../src/components/ui';
import { currentStage, MAIN_LESSONS } from '../../src/content';
import { ACHIEVEMENTS } from '../../src/engine/achievements';
import { liveStreak, useApp, type Settings } from '../../src/state/store';
import { colors, font, levelColors } from '../../src/theme';

function Stat({ icon, value, label, color, tilt }: { icon: IconName; value: string | number; label: string; color: string; tilt: number }) {
  return (
    <Panel color={color} tilt={tilt} style={{ flexBasis: '46%', flexGrow: 1, gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name={icon} size={22} color={colors.ink} />
        <Text style={{ fontFamily: font.display, fontSize: 34, lineHeight: 36, color: colors.ink }}>{value}</Text>
      </View>
      <Text style={{ fontFamily: font.label, fontSize: 14, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.ink }}>{label}</Text>
    </Panel>
  );
}

function Toggle({ k, label, sub, onChange }: { k: keyof Settings; label: string; sub: string; onChange?: (v: boolean) => boolean }) {
  const value = useApp((s) => s.settings[k]) as boolean;
  const set = useApp((s) => s.setSetting);
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Muted>{sub}</Muted>
      </View>
      <Switch
        value={value}
        trackColor={{ true: colors.blue, false: colors.locked }}
        thumbColor={colors.paper}
        onValueChange={(v) => {
          if (!onChange || onChange(v)) set(k, v as never);
        }}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const s = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmAdult, setConfirmAdult] = useState(false);
  const accuracy = s.stats.answered ? Math.round((s.stats.correct / s.stats.answered) * 100) : 0;
  const done = MAIN_LESSONS.filter((l) => s.lessons[l.id]).length;
  const { stage } = currentStage(s.lessons);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Norppa size={104} burst={levelColors[stage.cefr]} />
        <View style={{ flex: 1 }}>
          <H1>Minä · Me</H1>
          <Tag label={`Taso · Level ${stage.code} · ${stage.nameEn}`} color={levelColors[stage.cefr]} />
        </View>
      </View>

      <View style={styles.grid}>
        <Stat icon="flame" value={liveStreak(s)} label="Putki · Streak" color={colors.orange} tilt={-1} />
        <Stat icon="ribbon" value={s.streak.best} label="Paras · Best streak" color={colors.paper} tilt={1} />
        <Stat icon="star" value={s.xp} label="XP" color={colors.gold} tilt={1} />
        <Stat icon="map" value={`${done}/${MAIN_LESSONS.length}`} label="Oppitunnit · Lessons" color={colors.paper} tilt={-1} />
        <Stat icon="albums" value={Object.keys(s.srs).length} label="Opittu · Items learned" color={colors.paper} tilt={-1} />
        <Stat icon="locate" value={`${accuracy}%`} label="Tarkkuus · Accuracy" color={colors.aurora} tilt={1} />
      </View>

      <H2 color={colors.gold}>Saavutukset · Achievements</H2>
      <View style={styles.grid}>
        {ACHIEVEMENTS.map((a) => {
          const got = s.achievements.includes(a.id);
          return (
            <Panel key={a.id} color={got ? colors.paper : colors.nightSoft} shadow={got ? colors.ink : colors.nightDeep} style={{ flexBasis: '46%', flexGrow: 1, gap: 4 }}>
              <Ionicons name={(got ? a.icon : 'lock-closed') as never} size={26} color={got ? colors.blue : colors.mutedOnNight} />
              <Text style={{ fontFamily: font.label, fontSize: 18, textTransform: 'uppercase' }}>{a.title}</Text>
              <Muted>{a.desc}</Muted>
            </Panel>
          );
        })}
      </View>

      <H2 color={colors.aurora}>Asetukset · Settings</H2>
      <Panel style={{ gap: 12 }}>
        <Text style={styles.toggleLabel}>Päivän tavoite · Daily goal</Text>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          {[10, 20, 30, 50].map((g) => (
            <Chip key={g} label={`${g} XP`} selected={s.settings.dailyGoal === g} onPress={() => s.setSetting('dailyGoal', g)} />
          ))}
        </View>
        <Text style={styles.toggleLabel}>Puhenopeus · Audio speed</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[0.75, 1, 1.25].map((r) => (
            <Chip key={r} label={`${r}×`} selected={s.settings.audioRate === r} onPress={() => s.setSetting('audioRate', r)} />
          ))}
        </View>
        <Toggle k="showPuhekieli" label="Näytä puhekieli" sub="Show spoken-Finnish variants next to textbook Finnish" />
        <Toggle k="strictUmlauts" label="Tarkat ä ja ö" sub="Count a/o typed instead of ä/ö as a mistake" />
        <Toggle k="unlimitedHearts" label="Rajattomat sydämet" sub="Unlimited hearts: no penalty for mistakes" />
        <Toggle k="unlockAll" label="Avaa kaikki" sub="Unlock every lesson and story" />
      </Panel>

      <Panel color={colors.berry} halftone style={{ gap: 8 }}>
        <Tag label="18+" color={colors.ink} size={18} />
        <Toggle
          k="adult"
          label="Aikuisten suomi · Finnish after dark"
          sub="Bar talk, swearing and dating. The Finnish adults actually use and textbooks leave out."
          onChange={(v) => {
            if (!v) return true;
            setConfirmAdult(true);
            return false;
          }}
        />
        {confirmAdult && !s.settings.adult && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '700' }}>
              This adds a bonus unit with strong language and alcohol and dating vocabulary. Are you 18 or older?
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button
                title="Olen · Yes, I am 18+"
                variant="gold"
                style={{ flex: 1 }}
                onPress={() => {
                  s.setSetting('adult', true);
                  setConfirmAdult(false);
                }}
              />
              <Button title="En · No" variant="secondary" onPress={() => setConfirmAdult(false)} />
            </View>
          </View>
        )}
      </Panel>

      <Button
        title={confirmReset ? 'Varmasti? Tap again to erase all progress' : 'Nollaa edistyminen · Reset progress'}
        variant={confirmReset ? 'danger' : 'ghost'}
        onPress={() => {
          if (confirmReset) {
            s.resetProgress();
            setConfirmReset(false);
          } else setConfirmReset(true);
        }}
      />
      <Muted>Suomeksi v0.2 · Content is AI-drafted and waiting for native-speaker review.</Muted>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  toggleLabel: { fontFamily: font.label, fontSize: 18, letterSpacing: 0.4, textTransform: 'uppercase' },
});

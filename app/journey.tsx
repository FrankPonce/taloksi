import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Speech } from '../src/components/art';
import { Surface } from '../src/components/Text';
import { BackButton, H1, Halftone, Muted, ProgressBar, Screen, Tag, Text } from '../src/components/ui';
import { currentStage, CURRICULUM_NOTE, CURRICULUM_SOURCES, STAGES, type Stage } from '../src/content';
import { useApp } from '../src/state/store';
import { colors, font, hardShadow, levelColors, onColor, OUTLINE } from '../src/theme';

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ gap: 3 }}>
      <Text style={styles.listTitle}>{title}</Text>
      {items.map((x) => (
        <View key={x} style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '700' }}>▸</Text>
          <Text style={{ fontSize: 15, lineHeight: 21, flex: 1 }}>{x}</Text>
        </View>
      ))}
    </View>
  );
}

function StageCard({ stage, state, progress, last }: { stage: Stage; state: 'done' | 'here' | 'ahead'; progress: number; last: boolean }) {
  const [open, setOpen] = useState(state === 'here');
  const color = levelColors[stage.cefr];
  const fg = onColor(color);
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {/* the road */}
      <View style={{ alignItems: 'center', width: 54 }}>
        <View style={[styles.node, { backgroundColor: state === 'ahead' ? colors.nightSoft : color }]}>
          {state === 'done' ? (
            <Ionicons name="checkmark" size={26} color={fg} />
          ) : (
            <Text style={{ fontFamily: font.display, fontSize: 19, color: state === 'ahead' ? colors.mutedOnNight : fg }}>{stage.code}</Text>
          )}
        </View>
        {!last && <View style={{ flex: 1, width: 8, backgroundColor: state === 'done' ? color : colors.nightSoft, borderLeftWidth: 2, borderRightWidth: 2, borderColor: colors.ink }} />}
      </View>

      <Pressable onPress={() => setOpen(!open)} style={{ flex: 1, marginBottom: 18 }}>
        <View style={[styles.card, { boxShadow: hardShadow(state === 'ahead' ? colors.nightDeep : colors.ink, 5) }]}>
          <View style={[styles.cardHead, { backgroundColor: color }]}>
            <Halftone color={colors.ink} opacity={0.16} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.display, fontSize: 28, lineHeight: 30, textTransform: 'uppercase', color: fg }}>{stage.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: fg }}>
                {stage.nameEn} · YKI {stage.yki}
              </Text>
            </View>
            {state === 'here' && <Tag label="Olet tässä" color={colors.ink} tilt={4} />}
            {stage.status === 'planned' && <Tag label="Tulossa" color={colors.paper} tilt={4} />}
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={fg} />
          </View>
          <Surface.Provider value="paper">
            <View style={{ padding: 12, gap: 10 }}>
              {state === 'here' && <ProgressBar value={progress} color={color} />}
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                <Ionicons name="flag" size={18} color={colors.red} />
                <Text style={{ fontSize: 16, lineHeight: 21, fontWeight: '700', flex: 1 }}>{stage.milestone}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                <Text style={styles.meta}>~{stage.words.toLocaleString('en')} words</Text>
                <Text style={styles.meta}>{stage.hours} hours</Text>
              </View>
              {open && (
                <>
                  <List title="Osaat · You can" items={stage.canDo} />
                  <List title="Kielioppi · Grammar" items={stage.grammar} />
                  <List title="Aiheet · Themes" items={stage.themes} />
                  {stage.status === 'planned' && (
                    <Text style={{ fontSize: 13, color: colors.mutedOnPaper }}>Lessons for this stage are planned but not built yet.</Text>
                  )}
                </>
              )}
            </View>
          </Surface.Provider>
        </View>
      </Pressable>
    </View>
  );
}

export default function JourneyScreen() {
  const s = useApp();
  const { stage: here, progress } = currentStage(s.lessons);
  const hereIndex = STAGES.findIndex((x) => x.id === here.id);
  return (
    <Screen>
      <BackButton icon="arrow-back" />
      <H1 accent={colors.gold}>Matka · The journey</H1>
      <Speech speaker="norppa" size={64}>
        <Text style={{ fontSize: 16, lineHeight: 22 }}>
          Eleven stages from your first “moi” to reading the classics. They follow the European CEFR levels and Finland's own YKI exam. Tap a stage to see
          what is inside.
        </Text>
      </Speech>

      <View style={{ marginTop: 8 }}>
        {STAGES.map((st, i) => (
          <StageCard
            key={st.id}
            stage={st}
            state={i < hereIndex ? 'done' : i === hereIndex ? 'here' : 'ahead'}
            progress={progress}
            last={i === STAGES.length - 1}
          />
        ))}
      </View>

      <Muted>{CURRICULUM_NOTE}</Muted>
      <Text style={{ fontFamily: font.label, fontSize: 15, letterSpacing: 1, color: colors.mutedOnNight }}>LÄHTEET · SOURCES</Text>
      {CURRICULUM_SOURCES.map((src) => (
        <Pressable key={src.url} onPress={() => Linking.openURL(src.url)}>
          <Text style={{ fontSize: 14, color: colors.aurora, textDecorationLine: 'underline' }}>{src.label}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  node: {
    width: 54,
    height: 54,
    borderWidth: OUTLINE,
    borderColor: colors.ink,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
    boxShadow: hardShadow(colors.ink, 3),
  },
  card: { backgroundColor: colors.paper, borderWidth: OUTLINE, borderColor: colors.ink, borderRadius: 6, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderBottomWidth: OUTLINE, borderColor: colors.ink, overflow: 'hidden' },
  listTitle: { fontFamily: font.label, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: colors.blue },
  meta: { fontFamily: font.label, fontSize: 15, letterSpacing: 0.5, color: colors.mutedOnPaper, textTransform: 'uppercase' },
});

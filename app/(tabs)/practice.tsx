import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { H1, H2, Muted, Panel, Screen, Text, type IconName } from '../../src/components/ui';
import { getLesson, STORIES, visibleUnits } from '../../src/content';
import { useApp } from '../../src/state/store';
import { colors, font } from '../../src/theme';

function Tile({
  icon,
  title,
  sub,
  onPress,
  locked,
  color = colors.paper,
  tilt = 0,
}: {
  icon: IconName;
  title: string;
  sub: string;
  onPress: () => void;
  locked?: boolean;
  color?: string;
  tilt?: number;
}) {
  return (
    <Pressable onPress={onPress} disabled={locked} style={{ opacity: locked ? 0.5 : 1 }}>
      <Panel color={color} tilt={tilt} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 46, height: 46, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', borderRadius: 4, transform: [{ rotate: '-5deg' }] }}>
          <Ionicons name={locked ? 'lock-closed' : icon} size={24} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font.label, fontSize: 21, textTransform: 'uppercase', letterSpacing: 0.4 }}>{title}</Text>
          <Text style={{ fontSize: 14 }}>{sub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.ink} />
      </Panel>
    </Pressable>
  );
}

export default function PracticeScreen() {
  const s = useApp();
  const grammar = visibleUnits(s.settings.adult).flatMap((u) => u.grammar);
  return (
    <Screen>
      <H1 accent={colors.red}>Treeni · Practice</H1>

      <H2 color={colors.gold}>Kuntosali · The gyms</H2>
      <Tile icon="grid" color={colors.gold} tilt={-0.6} title="Sijamuotosali" sub="Case gym: drill the ten most useful noun cases" onPress={() => router.push('/gym/cases')} />
      <Tile icon="repeat" color={colors.aurora} tilt={0.6} title="Verbisali" sub="Verb gym: conjugate in textbook or spoken Finnish" onPress={() => router.push('/gym/verbs')} />

      <H2 color={colors.red}>Tarinat · Stories</H2>
      {STORIES.map((st) => {
        const locked = !s.settings.unlockAll && !s.lessons[st.unlockAfter];
        const done = s.storiesDone.includes(st.id);
        return (
          <Tile
            key={st.id}
            icon={done ? 'checkmark-done' : 'chatbubbles'}
            title={st.title}
            sub={locked ? `Unlocks after “${getLesson(st.unlockAfter)?.title}”` : st.titleEn}
            locked={locked}
            onPress={() => router.push(`/story/${st.id}`)}
          />
        );
      })}

      <H2 color={colors.aurora}>Kielioppi · Grammar notes</H2>
      <Muted>Short explanations with examples you can take apart word by word.</Muted>
      {grammar.map((g) => (
        <Tile key={g.id} icon="book" title={g.title} sub={g.titleEn} onPress={() => router.push(`/grammar/${g.id}`)} />
      ))}
    </Screen>
  );
}

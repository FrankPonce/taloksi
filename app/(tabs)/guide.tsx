import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Avatar, Speech } from '../../src/components/art';
import { H1, H2, Muted, Panel, ProgressBar, Screen, Tag, Text } from '../../src/components/ui';
import { CHARACTERS, CULTURE, currentStage, GUIDE } from '../../src/content';
import { useApp } from '../../src/state/store';
import { colors, font, levelColors, onColor } from '../../src/theme';

function Row({ icon, title, sub, onPress, color = colors.paper }: { icon: string; title: string; sub: string; onPress: () => void; color?: string }) {
  return (
    <Pressable onPress={onPress}>
      <Panel color={color} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <View style={{ width: 40, height: 40, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }], borderRadius: 4 }}>
          <Ionicons name={icon as never} size={22} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font.label, fontSize: 19, letterSpacing: 0.4, textTransform: 'uppercase' }}>{title}</Text>
          <Text style={{ fontSize: 14, color: onColor(color) === colors.ink ? colors.mutedOnPaper : colors.paper }}>{sub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={onColor(color)} />
      </Panel>
    </Pressable>
  );
}

export default function GuideScreen() {
  const s = useApp();
  const { stage, progress } = currentStage(s.lessons);
  const culture = CULTURE.filter((c) => s.settings.adult || !c.adult);
  return (
    <Screen>
      <H1 accent={colors.aurora}>Opas · Guide</H1>
      <Speech speaker="norppa" size={64}>
        <Text style={{ fontSize: 16, lineHeight: 22 }}>
          Here is the map, the method and the people. Finnish is a long road. Knowing where you are on it makes it shorter.
        </Text>
      </Speech>

      <H2 color={colors.gold}>Matka · The journey</H2>
      <Pressable onPress={() => router.push('/journey')}>
        <Panel color={levelColors[stage.cefr]} halftone>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Tag label={`Olet tässä · You are here: ${stage.code}`} tilt={-2} />
          </View>
          <Text style={{ fontFamily: font.display, fontSize: 30, textTransform: 'uppercase' }}>From zero to C2</Text>
          <ProgressBar value={progress} color={colors.paper} />
          <Text style={{ fontSize: 15, fontWeight: '700' }}>
            11 stages, what you can do at each one, and the grammar that gets you there. Next milestone: {stage.milestone}
          </Text>
        </Panel>
      </Pressable>

      <H2 color={colors.aurora}>Opiskeluvinkit · How to study</H2>
      <Muted>Short, practical, and every one links to its source.</Muted>
      {GUIDE.map((t) => (
        <Row key={t.id} icon={t.icon} title={t.titleEn} sub={t.summary} onPress={() => router.push(`/tip/${t.id}`)} />
      ))}

      <H2 color={colors.red}>Kulttuuri · Culture</H2>
      {culture.map((c) => (
        <Row key={c.id} icon={c.icon} title={c.titleEn} sub={c.title + (c.adult ? ' · 18+' : '')} onPress={() => router.push(`/culture/${c.id}`)} />
      ))}

      <H2 color={colors.berry}>Hahmot · The cast</H2>
      <Pressable onPress={() => router.push('/cast')}>
        <Panel style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CHARACTERS.map((c) => (
              <Avatar key={c.id} id={c.id} size={58} />
            ))}
          </View>
          <Text style={{ fontSize: 15, fontWeight: '700' }}>Meet the seven voices you will hear in every lesson.</Text>
        </Panel>
      </Pressable>
    </Screen>
  );
}

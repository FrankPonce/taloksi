import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Speech } from '../../src/components/art';
import { BackButton, H1, Panel, Screen, Tag, Text } from '../../src/components/ui';
import { getTip } from '../../src/content';
import { colors, font } from '../../src/theme';

export default function TipScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tip = getTip(String(id));
  if (!tip) {
    return (
      <Screen>
        <BackButton icon="arrow-back" />
        <H1>Not found</H1>
      </Screen>
    );
  }
  return (
    <Screen>
      <BackButton icon="arrow-back" />
      <Tag label="Opiskeluvinkki // Study tip" color={colors.aurora} />
      <H1 accent={colors.aurora}>{tip.titleEn}</H1>
      <Text style={{ fontFamily: font.label, fontSize: 18, letterSpacing: 0.6, color: colors.mutedOnNight, textTransform: 'uppercase' }}>{tip.title}</Text>

      <Panel color={colors.gold} halftone tilt={-0.6}>
        <Text style={{ fontSize: 19, lineHeight: 25, fontWeight: '700' }}>{tip.summary}</Text>
      </Panel>

      {tip.body.map((p, i) => (
        <Text key={i} style={{ fontSize: 17, lineHeight: 25 }}>
          {p}
        </Text>
      ))}

      <Panel>
        <Tag label="Tee näin · Do this" color={colors.red} />
        {tip.doThis.map((d, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View style={{ backgroundColor: colors.ink, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] }}>
              <Text style={{ fontFamily: font.display, fontSize: 16, color: colors.paper }}>{i + 1}</Text>
            </View>
            <Text style={{ fontSize: 16, lineHeight: 22, flex: 1 }}>{d}</Text>
          </View>
        ))}
      </Panel>

      <Speech speaker="norppa" size={60}>
        <Text style={{ fontFamily: font.label, fontSize: 13, letterSpacing: 1, color: colors.blue }}>IN THIS APP</Text>
        <Text style={{ fontSize: 16, lineHeight: 22 }}>{tip.inApp}</Text>
      </Speech>

      <Text style={{ fontFamily: font.label, fontSize: 15, letterSpacing: 1, color: colors.mutedOnNight }}>LÄHTEET · SOURCES</Text>
      {tip.sources.map((src) => (
        <Pressable key={src.url} onPress={() => Linking.openURL(src.url)} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <Ionicons name="open-outline" size={16} color={colors.aurora} />
          <Text style={{ fontSize: 14, lineHeight: 19, color: colors.aurora, textDecorationLine: 'underline', flex: 1 }}>{src.label}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

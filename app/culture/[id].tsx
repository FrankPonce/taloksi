import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { BackButton, H1, Muted, Panel, Screen, SpeakerButton, Tag, Text } from '../../src/components/ui';
import { getCulture } from '../../src/content';
import { useApp } from '../../src/state/store';
import { colors, font } from '../../src/theme';

export default function CultureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const adult = useApp((s) => s.settings.adult);
  const note = getCulture(String(id));
  if (!note || (note.adult && !adult)) {
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
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Tag label="Kulttuuri // Culture" color={colors.red} />
        {note.adult && <Tag label="18+" color={colors.berry} tilt={3} />}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 56, height: 56, backgroundColor: colors.red, borderWidth: 3, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', borderRadius: 6, transform: [{ rotate: '-6deg' }] }}>
          <Ionicons name={note.icon as never} size={30} color={colors.paper} />
        </View>
        <View style={{ flex: 1 }}>
          <H1 accent={colors.red}>{note.title}</H1>
        </View>
      </View>
      <Text style={{ fontFamily: font.label, fontSize: 19, letterSpacing: 0.6, color: colors.mutedOnNight, textTransform: 'uppercase' }}>{note.titleEn}</Text>

      {note.body.map((p, i) => (
        <Text key={i} style={{ fontSize: 17, lineHeight: 25 }}>
          {p}
        </Text>
      ))}

      <Panel halftone>
        <Tag label="Sanat · Words to know" color={colors.gold} />
        {note.words.map((w) => (
          <View key={w.fi} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <SpeakerButton text={w.fi.replace(' / ', ', ')} size="sm" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 19, fontWeight: '700' }}>{w.fi}</Text>
              <Muted>{w.en}</Muted>
            </View>
          </View>
        ))}
      </Panel>

      {note.source && (
        <Pressable onPress={() => Linking.openURL(note.source!.url)} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Ionicons name="open-outline" size={16} color={colors.aurora} />
          <Text style={{ fontSize: 14, color: colors.aurora, textDecorationLine: 'underline' }}>{note.source.label}</Text>
        </Pressable>
      )}
    </Screen>
  );
}

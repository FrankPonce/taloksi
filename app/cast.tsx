import { View } from 'react-native';
import { Avatar } from '../src/components/art';
import { BackButton, H1, Muted, Panel, Screen, SpeakerButton, Tag, Text } from '../src/components/ui';
import { CHARACTERS } from '../src/content';
import { colors, font } from '../src/theme';

export default function CastScreen() {
  return (
    <Screen>
      <BackButton icon="arrow-back" />
      <H1 accent={colors.berry}>Hahmot · The cast</H1>
      <Muted>
        Seven voices, from careful textbook Finnish to full-speed street talk. Hearing different speakers is how your ear learns to cope with real people.
      </Muted>
      {CHARACTERS.map((c, i) => (
        <Panel key={c.id} tilt={i % 2 ? 0.6 : -0.6} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
          <Avatar id={c.id} size={92} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={{ fontFamily: font.display, fontSize: 32, lineHeight: 34, textTransform: 'uppercase' }}>{c.name}</Text>
            <Tag label={`${c.role} · ${c.roleEn}`} color={c.color} tilt={-1.5} size={13} />
            <Text style={{ fontSize: 15, lineHeight: 21 }}>{c.bio}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <SpeakerButton text={c.hello} id={`cast_${c.id}`} speaker={c.id} size="sm" />
              <Text style={{ fontSize: 15, fontStyle: 'italic', flex: 1 }}>{c.hello}</Text>
            </View>
          </View>
        </Panel>
      ))}
    </Screen>
  );
}

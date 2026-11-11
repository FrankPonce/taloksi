import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { NameTag, Sprite, type Mood } from '../src/components/art';
import { Pop } from '../src/components/motion';
import { BackButton, H1, Muted, Panel, Screen, SpeakerButton, Tag, Text } from '../src/components/ui';
import { CHARACTERS, UNITS } from '../src/content';
import { useApp } from '../src/state/store';
import { colors, font } from '../src/theme';

const MOODS: { mood: Mood; label: string }[] = [
  { mood: 'happy', label: 'iloinen' },
  { mood: 'excited', label: 'innoissaan' },
  { mood: 'question', label: 'ihmeissään' },
  { mood: 'sad', label: 'surullinen' },
  { mood: 'wink', label: 'ovela' },
  { mood: 'angry', label: 'vihainen' },
];

/** Lessons each character hosts, so the cast page shows what they actually teach */
const hosted = (id: string, adult: boolean) =>
  UNITS.filter((u) => adult || u.track !== 'adult').flatMap((u) => u.lessons.filter((l) => l.host === id).map((l) => l.title));

export default function CastScreen() {
  const adult = useApp((s) => s.settings.adult);
  // 18+ characters are always listed, but stay locked until the setting is on
  const cast = CHARACTERS;
  // Tap a portrait to cycle through that character's expressions
  const [moods, setMoods] = useState<Record<string, number>>({});
  return (
    <Screen>
      <BackButton icon="arrow-back" />
      <H1 accent={colors.berry}>Hahmot · The cast</H1>
      <Muted>
        Everyone teaches what they know best, in their own voice. Tap a portrait to see their moods. The word under it is the Finnish for the feeling.
      </Muted>
      {cast.map((c, i) => {
        const m = MOODS[(moods[c.id] ?? 0) % MOODS.length];
        const lessons = hosted(c.id, adult);
        if (c.adult && !adult) {
          return (
            <Pop key={c.id} delay={i * 60}>
              <Panel color={colors.nightSoft} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <View style={{ opacity: 0.35 }}>
                  <Sprite id={c.id} size={84} />
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <Tag label="18+" color={colors.berry} tilt={3} size={13} />
                    <Text style={{ fontFamily: font.display, fontSize: 24, color: colors.paper }}>{c.name}</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.mutedOnNight }}>
                    {c.roleEn}. Turn on Aikuisten suomi · Finnish after dark in your profile to meet them.
                  </Text>
                </View>
              </Panel>
            </Pop>
          );
        }
        return (
          <Pop key={c.id} delay={i * 60}>
            <Panel tilt={i % 2 ? 0.5 : -0.5} style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <Pressable onPress={() => setMoods((x) => ({ ...x, [c.id]: (x[c.id] ?? 0) + 1 }))} style={{ alignItems: 'center', gap: 2 }}>
                <Sprite id={c.id} size={118} mood={m.mood} />
                <Text style={{ fontFamily: font.label, fontSize: 13, letterSpacing: 0.6, color: colors.mutedOnPaper }}>{m.label}</Text>
              </Pressable>
              <View style={{ flex: 1, gap: 7 }}>
                <View style={{ alignSelf: 'flex-start' }}>
                  <NameTag id={c.id} size={22} />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  <Tag label={c.role} color={colors.ink} tilt={-1.5} size={13} />
                  {c.adult && <Tag label="18+" color={colors.berry} tilt={3} size={13} />}
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700' }}>{c.roleEn}</Text>
                <Text style={{ fontSize: 15, lineHeight: 21 }}>{c.bio}</Text>
                <Text style={{ fontSize: 13, color: colors.mutedOnPaper }}>Teaches: {c.likes}</Text>
                <Text style={{ fontSize: 13, color: colors.mutedOnPaper }}>{lessons.length ? `Hosts: ${lessons.join(' · ')}` : 'Lessons coming: see the roadmap'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <SpeakerButton text={c.hello} id={`cast_${c.id}`} speaker={c.id} size="sm" />
                  <Text style={{ fontSize: 15, fontStyle: 'italic', flex: 1 }}>{c.hello}</Text>
                </View>
              </View>
            </Panel>
          </Pop>
        );
      })}
    </Screen>
  );
}

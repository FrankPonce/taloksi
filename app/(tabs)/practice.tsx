import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { H1, Muted, Panel, Screen, Tag, Text, type IconName } from '../../src/components/ui';
import { getLesson, STORIES, visibleUnits, WRITING } from '../../src/content';
import { useApp } from '../../src/state/store';
import { colors, font, hardShadow, onColor, OUTLINE } from '../../src/theme';

type Skill = 'listen' | 'read' | 'write' | 'speak' | 'grammar';
const SKILLS: { id: Skill; fi: string; en: string; icon: IconName; color: string; blurb: string }[] = [
  { id: 'listen', fi: 'Kuuntelu', en: 'Listening', icon: 'headset', color: colors.red, blurb: 'Hear a conversation without seeing the text, then answer questions about it.' },
  { id: 'read', fi: 'Lukeminen', en: 'Reading', icon: 'book', color: colors.aurora, blurb: 'Read dialogues at your own pace. Tap any line to translate it and take it apart.' },
  { id: 'write', fi: 'Kirjoittaminen', en: 'Writing', icon: 'create', color: colors.orange, blurb: 'Write a short text on a task and get a score with feedback. Plus typing drills for endings.' },
  { id: 'speak', fi: 'Puhuminen', en: 'Speaking', icon: 'mic', color: colors.gold, blurb: 'Shadow the characters: listen, speak along, then say it alone.' },
  { id: 'grammar', fi: 'Kielioppi', en: 'Grammar', icon: 'construct', color: colors.berry, blurb: 'Short notes with examples you can take apart, and the two gyms for cases and verbs.' },
];

function Tile({ icon, title, sub, onPress, locked, done }: { icon: IconName; title: string; sub: string; onPress: () => void; locked?: boolean; done?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={locked} style={{ opacity: locked ? 0.5 : 1 }}>
      <Panel style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
        <View style={{ width: 44, height: 44, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', borderRadius: 4, transform: [{ rotate: '-5deg' }] }}>
          <Ionicons name={locked ? 'lock-closed' : done ? 'checkmark-done' : icon} size={23} color={done ? colors.aurora : colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font.label, fontSize: 20, textTransform: 'uppercase', letterSpacing: 0.4 }}>{title}</Text>
          <Text style={{ fontSize: 14 }}>{sub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.ink} />
      </Panel>
    </Pressable>
  );
}

export default function PracticeScreen() {
  const s = useApp();
  const [skill, setSkill] = useState<Skill>('listen');
  const active = SKILLS.find((k) => k.id === skill) as (typeof SKILLS)[number];
  const grammar = visibleUnits(s.settings.adult).flatMap((u) => u.grammar);
  const unlocked = (lessonId: string) => s.settings.unlockAll || !!s.lessons[lessonId];
  const lockedSub = (lessonId: string) => `Unlocks after “${getLesson(lessonId)?.title}”`;

  return (
    <Screen>
      <H1 accent={colors.red}>Treeni · Practice</H1>
      <Muted>Lessons mix all four skills. Here you can train one at a time.</Muted>

      {/* skill switcher */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {SKILLS.map((k) => {
          const on = k.id === skill;
          return (
            <Pressable
              key={k.id}
              onPress={() => setSkill(k.id)}
              style={{
                flexGrow: 1,
                flexBasis: '30%',
                alignItems: 'center',
                gap: 2,
                paddingVertical: 8,
                backgroundColor: on ? k.color : colors.nightSoft,
                borderWidth: OUTLINE,
                borderColor: colors.ink,
                borderRadius: 6,
                boxShadow: hardShadow(colors.ink, on ? 2 : 4),
                transform: [{ rotate: on ? '-2deg' : '0deg' }, { translateY: on ? 2 : 0 }],
              }}
            >
              <Ionicons name={k.icon} size={22} color={on ? onColor(k.color) : colors.mutedOnNight} />
              <Text style={{ fontFamily: font.label, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', color: on ? onColor(k.color) : colors.mutedOnNight }}>
                {k.fi}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Panel color={active.color} halftone tilt={-0.5}>
        <Tag label={`${active.fi} // ${active.en}`} />
        <Text style={{ fontSize: 16, lineHeight: 22, fontWeight: '700' }}>{active.blurb}</Text>
      </Panel>

      {skill === 'listen' &&
        STORIES.map((st) => (
          <Tile
            key={st.id}
            icon="headset"
            title={st.title}
            sub={unlocked(st.unlockAfter) ? `${st.titleEn} · audio first, text hidden` : lockedSub(st.unlockAfter)}
            locked={!unlocked(st.unlockAfter)}
            onPress={() => router.push(`/story/${st.id}?mode=listen`)}
          />
        ))}

      {skill === 'read' &&
        STORIES.map((st) => (
          <Tile
            key={st.id}
            icon="chatbubbles"
            done={s.storiesDone.includes(st.id)}
            title={st.title}
            sub={unlocked(st.unlockAfter) ? st.titleEn : lockedSub(st.unlockAfter)}
            locked={!unlocked(st.unlockAfter)}
            onPress={() => router.push(`/story/${st.id}`)}
          />
        ))}

      {skill === 'write' && (
        <>
          {WRITING.map((w) => {
            const best = s.writing[w.id];
            return (
              <Tile
                key={w.id}
                icon="create"
                done={best !== undefined && best >= 4}
                title={w.title}
                sub={unlocked(w.after) ? `${w.titleEn}${best !== undefined ? ` · best ${best}/5` : ''}` : lockedSub(w.after)}
                locked={!unlocked(w.after)}
                onPress={() => router.push(`/write/${w.id}`)}
              />
            );
          })}
          <Tile icon="grid" title="Sijamuotosali" sub="Case gym: type the right ending" onPress={() => router.push('/gym/cases')} />
          <Tile icon="repeat" title="Verbisali" sub="Verb gym: type the conjugation" onPress={() => router.push('/gym/verbs')} />
        </>
      )}

      {skill === 'speak' && (
        <>
          <Tile icon="mic" title="Varjostus" sub="Shadowing: six sentences you have learned, said out loud" onPress={() => router.push('/speak')} />
          <Tile icon="people" title="Hahmot" sub="Hear how each character sounds" onPress={() => router.push('/cast')} />
          <Muted>Speech recognition that listens and corrects you is planned for a later sprint.</Muted>
        </>
      )}

      {skill === 'grammar' && (
        <>
          <Tile icon="grid" title="Sijamuotosali" sub="Case gym: drill the ten most useful noun cases" onPress={() => router.push('/gym/cases')} />
          <Tile icon="repeat" title="Verbisali" sub="Verb gym: textbook or spoken Finnish" onPress={() => router.push('/gym/verbs')} />
          {grammar.map((g) => (
            <Tile key={g.id} icon="book" title={g.title} sub={g.titleEn} onPress={() => router.push(`/grammar/${g.id}`)} />
          ))}
        </>
      )}
    </Screen>
  );
}

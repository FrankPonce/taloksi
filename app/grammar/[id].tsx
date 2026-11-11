import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Speech } from '../../src/components/art';
import { Breakdown } from '../../src/components/Breakdown';
import { BackButton, Button, H1, Muted, Panel, PuheLine, Screen, SpeakerButton, Tag, Text } from '../../src/components/ui';
import { breakdown, getGrammar, UNITS } from '../../src/content';
import { colors, font, OUTLINE } from '../../src/theme';

function Example({ fi, en, puhe }: { fi: string; en: string; puhe?: string }) {
  const [open, setOpen] = useState(false);
  // Only offer the breakdown when every word is in the lexicon
  const canBreak = breakdown(fi).every((t) => t.known);
  return (
    <Pressable onPress={() => canBreak && setOpen(!open)}>
      <Panel style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <SpeakerButton text={fi} size="sm" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 19, fontWeight: '700' }}>{fi}</Text>
            <Muted>{en}</Muted>
          </View>
        </View>
        <PuheLine puhe={puhe} />
        {open && <Breakdown fi={fi} />}
        {canBreak && !open && <Text style={{ fontFamily: font.label, fontSize: 12, letterSpacing: 1, color: colors.blue }}>TAP TO TAKE IT APART</Text>}
      </Panel>
    </Pressable>
  );
}

export default function GrammarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = getGrammar(String(id));
  const unit = UNITS.find((u) => u.grammar.some((g) => g.id === id));
  if (!note) {
    return (
      <Screen>
        <H1>Not found</H1>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackButton />
      <Tag label="Kielioppi // Grammar" color={colors.aurora} />
      <H1 accent={colors.aurora}>{note.title}</H1>
      <Muted>{note.titleEn}</Muted>
      {note.blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return (
              <Text key={i} style={styles.p}>
                {b.text}
              </Text>
            );
          case 'tip':
            return (
              <Speech key={i} speaker="norppa" size={56} color="#FFE9B0">
                <Text style={{ fontSize: 16, lineHeight: 22, fontWeight: '700' }}>{b.text}</Text>
              </Speech>
            );
          case 'example':
            return <Example key={i} fi={b.fi} en={b.en} puhe={b.puhe} />;
          case 'table':
            return (
              <Panel key={i} style={{ padding: 0, gap: 0 }}>
                <View style={[styles.row, { backgroundColor: colors.ink }]}>
                  {b.head.map((h) => (
                    <Text key={h} style={[styles.cell, { fontFamily: font.label, color: colors.paper, textTransform: 'uppercase', letterSpacing: 0.6 }]}>
                      {h}
                    </Text>
                  ))}
                </View>
                {b.rows.map((r, ri) => (
                  <View key={ri} style={[styles.row, ri % 2 === 1 && { backgroundColor: colors.paperDim }]}>
                    {r.map((c, ci) => (
                      <Text key={ci} style={[styles.cell, ci === 0 && { fontWeight: '700' }]}>
                        {c}
                      </Text>
                    ))}
                  </View>
                ))}
              </Panel>
            );
        }
      })}
      {unit && unit.grammar.length > 1 && (
        <View style={{ gap: 10, marginTop: 12 }}>
          <Muted>More in {unit.titleEn}:</Muted>
          {unit.grammar
            .filter((g) => g.id !== note.id)
            .map((g) => (
              <Button key={g.id} title={g.title} variant="secondary" onPress={() => router.replace(`/grammar/${g.id}`)} />
            ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  p: { fontSize: 17, lineHeight: 25 },
  row: { flexDirection: 'row', borderBottomWidth: OUTLINE - 1, borderColor: colors.ink },
  cell: { flex: 1, padding: 9, fontSize: 15 },
});

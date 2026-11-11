import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { BackButton, Button, Chip, H1, inputStyle, Muted, Panel, ProgressBar, Screen, SpeakerButton, Tag, Text, Verdict } from '../../src/components/ui';
import { VERBS, type Verb } from '../../src/content';
import { pick } from '../../src/engine/random';
import { checkAnswer } from '../../src/engine/text';
import { useApp } from '../../src/state/store';
import { colors, font } from '../../src/theme';

const KIRJA = ['minä', 'sinä', 'hän', 'me', 'te', 'he'];
const PUHE = ['mä', 'sä', 'se', 'me', 'te', 'ne'];
const ROUND = 10;

export default function VerbGym() {
  const s = useApp();
  const [register, setRegister] = useState<'kirja' | 'puhe'>('kirja');
  const [q, setQ] = useState<{ v: Verb; p: number } | null>(null);
  const [n, setN] = useState(0);
  const [right, setRight] = useState(0);
  const [text, setText] = useState('');
  const [res, setRes] = useState<{ ok: boolean; note?: string } | null>(null);

  const expected = q ? (register === 'kirja' ? q.v.forms[q.p] : q.v.puhe[q.p]) : '';
  const pronoun = q ? (register === 'kirja' ? KIRJA[q.p] : PUHE[q.p]) : '';
  // Aino speaks puhekieli, Helvi speaks by the book
  const voice = register === 'puhe' ? 'aino' : 'helvi';

  const next = () => {
    setQ({ v: pick(VERBS), p: Math.floor(Math.random() * 6) });
    setText('');
    setRes(null);
  };
  const check = () => {
    // Accept the answer with or without the pronoun typed in front
    const r = checkAnswer(text.replace(new RegExp(`^${pronoun}\\s+`, 'i'), ''), [expected], 'fi', {
      strictUmlauts: s.settings.strictUmlauts,
      allowTypos: false,
    });
    s.gymAnswer(r.correct);
    if (r.correct) setRight((x) => x + 1);
    setRes({ ok: r.correct, note: r.note });
  };
  const advance = () => {
    if (n + 1 >= ROUND) {
      s.earnXp(right);
      setQ(null);
      setN(0);
      return;
    }
    setN(n + 1);
    next();
  };

  if (!q) {
    return (
      <Screen>
        <BackButton />
        <H1 accent={colors.aurora}>Verbisali</H1>
        <Muted>Verb gym. Conjugate common verbs in the present tense. Puhekieli mode drills how people actually talk.</Muted>
        {right > 0 && (
          <Panel color={colors.aurora} tilt={-1}>
            <Text style={{ fontFamily: font.display, fontSize: 26 }}>
              Last round: {right}/{ROUND} · +{right} XP
            </Text>
          </Panel>
        )}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Chip label="Kirjakieli (textbook)" selected={register === 'kirja'} onPress={() => setRegister('kirja')} />
          <Chip label="Puhekieli (spoken)" selected={register === 'puhe'} onPress={() => setRegister('puhe')} />
        </View>
        <Button
          title="Aloita · Start"
          icon="play"
          onPress={() => {
            setRight(0);
            setN(0);
            next();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <BackButton />
        <ProgressBar value={n / ROUND} color={colors.aurora} />
      </View>
      <Panel halftone tilt={-0.6} style={{ alignItems: 'center', gap: 10, paddingVertical: 26 }}>
        <Tag label={register === 'puhe' ? 'Puhekieli' : 'Kirjakieli'} color={register === 'puhe' ? colors.berry : colors.blue} style={{ alignSelf: 'center' }} />
        <Text style={{ fontFamily: font.display, fontSize: 42, lineHeight: 46, textAlign: 'center' }}>
          {pronoun} + {q.v.inf}
        </Text>
        <Muted>{q.v.en}</Muted>
      </Panel>
      <TextInput
        value={text}
        onChangeText={setText}
        editable={!res}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => (res ? advance() : check())}
        placeholder={`${pronoun} …`}
        placeholderTextColor={colors.mutedOnPaper}
        style={inputStyle}
      />
      {!res && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {['ä', 'ö'].map((ch) => (
            <Chip key={ch} label={ch} onPress={() => setText((t) => t + ch)} />
          ))}
        </View>
      )}
      {res ? (
        <Verdict ok={res.ok} title={`${pronoun} ${expected}`}>
          <SpeakerButton text={`${pronoun} ${expected}`} speaker={voice} size="sm" />
          {res.note ? <Text style={{ fontSize: 16, fontWeight: '700' }}>{res.note}</Text> : null}
          <Button title="Jatka · Continue" variant="secondary" onPress={advance} />
        </Verdict>
      ) : (
        <Button title="Tarkista · Check" disabled={!text.trim()} onPress={check} />
      )}
    </Screen>
  );
}

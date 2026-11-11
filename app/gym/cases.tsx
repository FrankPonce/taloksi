import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { BackButton, Button, Chip, H1, inputStyle, Muted, Panel, ProgressBar, Screen, SpeakerButton, Tag, Text, Verdict } from '../../src/components/ui';
import { CASES, NOUNS, type CaseName, type Noun } from '../../src/content';
import { pick } from '../../src/engine/random';
import { checkAnswer } from '../../src/engine/text';
import { useApp } from '../../src/state/store';
import { colors, font } from '../../src/theme';

const MEANING: Record<CaseName, string> = {
  genetiivi: "of / 's",
  partitiivi: 'some / partial',
  inessiivi: 'in',
  elatiivi: 'out of / from',
  illatiivi: 'into',
  adessiivi: 'on / at',
  ablatiivi: 'off / from',
  allatiivi: 'onto / to',
  essiivi: 'as',
  translatiivi: 'becoming',
};
const ROUND = 10;
type Q = { noun: Noun; c: CaseName };

export default function CaseGym() {
  const s = useApp();
  const [active, setActive] = useState<CaseName[]>(['inessiivi', 'elatiivi', 'illatiivi', 'adessiivi']);
  const [q, setQ] = useState<Q | null>(null);
  const [n, setN] = useState(0);
  const [right, setRight] = useState(0);
  const [text, setText] = useState('');
  const [res, setRes] = useState<{ ok: boolean; note?: string } | null>(null);

  const next = () => {
    setQ({ noun: pick(NOUNS), c: pick(active) });
    setText('');
    setRes(null);
  };
  const check = () => {
    if (!q) return;
    const r = checkAnswer(text, [q.noun.forms[q.c]], 'fi', { strictUmlauts: s.settings.strictUmlauts, allowTypos: false });
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
        <H1 accent={colors.gold}>Sijamuotosali</H1>
        <Muted>Case gym. You get a noun and a case, you type the form. Pick which cases to drill.</Muted>
        {n === 0 && right > 0 && (
          <Panel color={colors.aurora} tilt={-1}>
            <Text style={{ fontFamily: font.display, fontSize: 26 }}>
              Last round: {right}/{ROUND} · +{right} XP
            </Text>
          </Panel>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {CASES.map((c) => (
            <Chip
              key={c}
              label={`${c} (${MEANING[c]})`}
              selected={active.includes(c)}
              onPress={() => setActive(active.includes(c) ? active.filter((x) => x !== c) : [...active, c])}
            />
          ))}
        </View>
        <Button
          title="Aloita · Start"
          icon="play"
          disabled={!active.length}
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
        <ProgressBar value={n / ROUND} color={colors.gold} />
      </View>
      <Panel halftone tilt={-0.6} style={{ alignItems: 'center', gap: 10, paddingVertical: 26 }}>
        <Text style={{ fontFamily: font.display, fontSize: 46, lineHeight: 50 }}>{q.noun.fi}</Text>
        <Muted>{q.noun.en}</Muted>
        <Tag label={`→ ${q.c} · ${MEANING[q.c]}`} color={colors.blue} size={18} tilt={2} style={{ alignSelf: 'center' }} />
      </Panel>
      <TextInput
        value={text}
        onChangeText={setText}
        editable={!res}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => (res ? advance() : check())}
        placeholder="Kirjoita muoto…"
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
        <Verdict ok={res.ok} title={q.noun.forms[q.c]}>
          <SpeakerButton text={q.noun.forms[q.c]} size="sm" />
          {res.note ? <Text style={{ fontSize: 16, fontWeight: '700' }}>{res.note}</Text> : null}
          {q.noun.note ? <Text style={{ fontSize: 16, fontWeight: '700' }}>{q.noun.note}</Text> : null}
          <Button title="Jatka · Continue" variant="secondary" onPress={advance} />
        </Verdict>
      ) : (
        <Button title="Tarkista · Check" disabled={!text.trim()} onPress={check} />
      )}
    </Screen>
  );
}

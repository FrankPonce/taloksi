import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { sfx } from '../../src/audio/sfx';
import { Speech } from '../../src/components/art';
import { Pop, Rise } from '../../src/components/motion';
import { BackButton, Button, Chip, H1, inputStyle, Muted, Panel, Screen, Tag, Text } from '../../src/components/ui';
import { getWriting } from '../../src/content';
import { quickCheck, type WritingCheck } from '../../src/engine/writing';
import { useApp } from '../../src/state/store';
import { colors, font } from '../../src/theme';

const VERDICT = ['Aloita tästä', 'Hyvä alku', 'Hyvä alku', 'Hyvin menee', 'Hienoa!', 'Erinomaista!'];
const VERDICT_EN = ['Start here', 'A good start', 'A good start', 'Going well', 'Great!', 'Excellent!'];

export default function WriteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prompt = getWriting(String(id));
  const s = useApp();
  const [text, setText] = useState('');
  const [result, setResult] = useState<WritingCheck | null>(null);
  const [showModel, setShowModel] = useState(false);

  if (!prompt) {
    return (
      <Screen>
        <BackButton icon="arrow-back" />
        <H1>Not found</H1>
      </Screen>
    );
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const check = () => {
    const r = quickCheck(prompt, text);
    setResult(r);
    sfx(r.score >= 4 ? 'complete' : r.score >= 2 ? 'correct' : 'wrong');
    s.completeWriting(prompt.id, r.score);
  };

  return (
    <Screen>
      <BackButton icon="arrow-back" />
      <Tag label={`Kirjoittaminen // Writing · ${prompt.level}`} color={colors.orange} />
      <H1 accent={colors.orange}>{prompt.title}</H1>

      <Speech speaker="samir" size={68} mood={result ? (result.score >= 4 ? 'excited' : 'happy') : 'question'}>
        <Text style={{ fontFamily: font.label, fontSize: 13, letterSpacing: 1, color: colors.blue }}>{prompt.titleEn.toUpperCase()}</Text>
        <Text style={{ fontSize: 17, lineHeight: 23, fontWeight: '700' }}>{prompt.task}</Text>
      </Speech>

      <TextInput
        value={text}
        onChangeText={(t) => {
          setText(t);
          setResult(null);
        }}
        multiline
        autoCapitalize="sentences"
        autoCorrect={false}
        placeholder="Kirjoita tähän suomeksi…"
        placeholderTextColor={colors.mutedOnPaper}
        style={[inputStyle, { minHeight: 170, fontSize: 19, lineHeight: 26, textAlignVertical: 'top' }]}
      />
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        {['ä', 'ö', 'å'].map((ch) => (
          <Chip key={ch} label={ch} onPress={() => setText((t) => t + ch)} />
        ))}
        <View style={{ flex: 1 }} />
        <Text style={{ fontFamily: font.label, fontSize: 16, color: words >= prompt.minWords ? colors.aurora : colors.mutedOnNight }}>
          {words} / {prompt.minWords} sanaa
        </Text>
      </View>

      {!result && <Button title="Tarkista teksti · Check my text" icon="checkmark-done" disabled={words < 3} onPress={check} />}

      {result && (
        <Rise>
          <Panel color={result.score >= 4 ? colors.success : result.score >= 2 ? colors.gold : colors.paper} halftone>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ backgroundColor: colors.ink, paddingHorizontal: 12, paddingVertical: 4, transform: [{ rotate: '-5deg' }], borderRadius: 4 }}>
                <Text style={{ fontFamily: font.display, fontSize: 38, lineHeight: 40, color: colors.paper }}>{result.score}/5</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: font.display, fontSize: 28, lineHeight: 30, textTransform: 'uppercase' }}>{VERDICT[result.score]}</Text>
                <Text style={{ fontSize: 15, fontWeight: '700' }}>{VERDICT_EN[result.score]}</Text>
              </View>
            </View>
          </Panel>
        </Rise>
      )}

      {result && (
        <Pop delay={150}>
          <Panel>
            <Tag label="Sisältö · Did you cover everything?" color={colors.blue} />
            {result.points.map((p) => (
              <View key={p.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Ionicons name={p.ok ? 'checkmark-circle' : 'close-circle'} size={22} color={p.ok ? colors.success : colors.red} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700' }}>{p.label}</Text>
                  {!p.ok && <Text style={{ fontSize: 14, color: colors.mutedOnPaper }}>Try: {p.hint}</Text>}
                </View>
              </View>
            ))}
            {result.tips.length > 0 && <Tag label="Vinkit · Tips" color={colors.red} style={{ marginTop: 6 }} />}
            {result.tips.map((t) => (
              <Text key={t} style={{ fontSize: 15, lineHeight: 21 }}>
                ▸ {t}
              </Text>
            ))}
          </Panel>
        </Pop>
      )}

      {result && (
        <Panel color={colors.nightSoft} shadow={colors.nightDeep}>
          <Text style={{ fontFamily: font.label, fontSize: 15, letterSpacing: 1, color: colors.gold }}>WHAT THIS CHECK CAN AND CANNOT DO</Text>
          <Text style={{ fontSize: 14, lineHeight: 20 }}>
            This is a quick automatic check. It sees whether you covered each point and catches a few spelling slips. It does not understand your sentences, so it
            cannot correct grammar or word choice yet. Compare your text with the model answer below.
          </Text>
        </Panel>
      )}

      {result &&
        (showModel ? (
          <Panel>
            <Tag label="Malli · Model answer" color={colors.aurora} />
            <Text style={{ fontSize: 17, lineHeight: 25, fontWeight: '700' }}>{prompt.model}</Text>
            <Muted>{prompt.modelEn}</Muted>
          </Panel>
        ) : (
          <Button title="Näytä malli · Show a model answer" variant="secondary" onPress={() => setShowModel(true)} />
        ))}
    </Screen>
  );
}

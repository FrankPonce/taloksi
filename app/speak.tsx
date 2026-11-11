import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { sfx } from '../src/audio/sfx';
import { speak } from '../src/audio/speak';
import { Norppa, Speech } from '../src/components/art';
import { Bob, Pop } from '../src/components/motion';
import { BackButton, Button, Glossed, goBack, H1, Muted, Panel, ProgressBar, PuheLine, Screen, SpeakerButton, Tag, Text } from '../src/components/ui';
import { getItem, MAIN_LESSONS } from '../src/content';
import { sample } from '../src/engine/random';
import { useApp } from '../src/state/store';
import { colors, font } from '../src/theme';

const ROUND = 6;
const STEPS = [
  { fi: 'Kuuntele', en: 'Listen. Do not speak yet.' },
  { fi: 'Varjosta', en: 'Play it again and speak along, a split second behind.' },
  { fi: 'Yksin', en: 'Now say it on your own, out loud.' },
];

/**
 * Shadowing practice: listen, speak along, then say it alone. The app does not
 * listen or grade the learner's voice yet; they judge themselves.
 */
export default function SpeakScreen() {
  const s = useApp();
  const ids = useMemo(() => {
    const learned = Object.keys(s.srs).filter((id) => {
      const it = getItem(id);
      return it?.kind === 'sentence' && (s.settings.adult || !it.adult);
    });
    // Before any lesson is finished, practise the first lesson's sentences
    return learned.length >= 3 ? sample(learned, ROUND) : MAIN_LESSONS[0].sentences.map((x) => x.id);
  }, []);
  const [i, setI] = useState(0);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const item = getItem(ids[i]);

  useEffect(() => {
    if (item && step < 2 && !done) speak(item.fi, { id: item.id, rate: step === 0 ? s.settings.audioRate : 0.85, speaker: item.speaker });
  }, [i, step]);

  if (done || !item) {
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 18, paddingTop: 24 }}>
          <Pop from={0.4}>
            <Bob>
              <Norppa size={200} mood="excited" burst={colors.red} />
            </Bob>
          </Pop>
          <H1 accent={colors.red}>Hyvin puhuttu!</H1>
          <Muted>
            {ids.length} sentences said out loud · +{ids.length} XP
          </Muted>
          <Button title="Jatka · Continue" onPress={goBack} style={{ alignSelf: 'stretch' }} />
        </View>
      </Screen>
    );
  }

  const next = () => {
    sfx('tap');
    if (step < 2) return setStep(step + 1);
    if (i + 1 >= ids.length) {
      s.earnXp(ids.length);
      sfx('complete');
      return setDone(true);
    }
    setI(i + 1);
    setStep(0);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <BackButton />
        <ProgressBar value={(i * 3 + step) / (ids.length * 3)} color={colors.red} />
      </View>
      <Tag label="Puhuminen // Speaking · shadowing" color={colors.red} />

      <Pop key={`${i}`}>
        <Speech speaker={item.speaker} size={76} mood={step === 2 ? 'question' : 'happy'}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <SpeakerButton text={item.fi} id={item.id} speaker={item.speaker} size="md" />
          </View>
          <Glossed text={item.fi} size={22} />
          <Text style={{ fontSize: 15, color: colors.mutedOnPaper }}>{item.en}</Text>
          <PuheLine puhe={item.puhe} id={item.id} />
        </Speech>
      </Pop>

      <Panel color={colors.gold} tilt={-0.6}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {STEPS.map((st, n) => (
            <View
              key={st.fi}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 4,
                backgroundColor: n === step ? colors.ink : 'transparent',
                borderWidth: 2,
                borderColor: colors.ink,
                borderRadius: 4,
                opacity: n < step ? 0.45 : 1,
              }}
            >
              <Text style={{ fontFamily: font.label, fontSize: 15, color: n === step ? colors.gold : colors.ink, textTransform: 'uppercase' }}>
                {n + 1}. {st.fi}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 18, lineHeight: 24, fontWeight: '700' }}>{STEPS[step].en}</Text>
      </Panel>

      <Button title={step < 2 ? 'Seuraava vaihe · Next step' : 'Sanoin sen · I said it'} icon={step < 2 ? 'arrow-forward' : 'checkmark'} onPress={next} />
      <Muted>The app is not listening. Say it out loud anyway: your mouth has to learn Finnish too.</Muted>
    </Screen>
  );
}

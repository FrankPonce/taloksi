import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { speak } from '../../audio/speak';
import type { Exercise } from '../../engine/exercises';
import { shuffle } from '../../engine/random';
import { useApp } from '../../state/store';
import { Chip } from '../ui';
import { ExTitle } from './parts';
import type { ExProps } from './types';

type E = Extract<Exercise, { kind: 'match' }>;

export function Match({ ex, onSubmit }: ExProps<E>) {
  const rate = useApp((s) => s.settings.audioRate);
  const left = useMemo(() => shuffle(ex.pairs), [ex.key]);
  const right = useMemo(() => shuffle(ex.pairs), [ex.key]);
  const [fi, setFi] = useState<string | null>(null);
  const [en, setEn] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const attempt = (f: string | null, e: string | null) => {
    if (!f || !e) return;
    if (f === e) {
      const next = [...done, f];
      setDone(next);
      if (next.length === ex.pairs.length) setTimeout(() => onSubmit({ correct: true, note: mistakes ? `${mistakes} mismatch(es)` : undefined }), 350);
    } else {
      setMistakes((m) => m + 1);
      setWrong([f, e]);
      setTimeout(() => setWrong([]), 500);
    }
    setFi(null);
    setEn(null);
  };

  return (
    <View style={{ gap: 18 }}>
      <ExTitle>Yhdistä parit · Match the pairs</ExTitle>
      <View style={{ flexDirection: 'row', gap: 14 }}>
        <View style={{ flex: 1, gap: 12 }}>
          {left.map((p) => (
            <Chip
              key={p.id}
              label={p.fi}
              selected={fi === p.id}
              disabled={done.includes(p.id)}
              tone={wrong[0] === p.id ? 'danger' : done.includes(p.id) ? 'success' : undefined}
              onPress={() => {
                speak(p.fi, { id: p.id, rate });
                setFi(p.id);
                attempt(p.id, en);
              }}
            />
          ))}
        </View>
        <View style={{ flex: 1, gap: 12 }}>
          {right.map((p) => (
            <Chip
              key={p.id}
              label={p.en}
              selected={en === p.id}
              disabled={done.includes(p.id)}
              tone={wrong[1] === p.id ? 'danger' : done.includes(p.id) ? 'success' : undefined}
              onPress={() => {
                setEn(p.id);
                attempt(fi, p.id);
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

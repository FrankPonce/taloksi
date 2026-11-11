import type { Exercise } from '../../engine/exercises';
import { Build } from './Build';
import { Choice } from './Choice';
import { Fill } from './Fill';
import { Intro } from './Intro';
import { Listen } from './Listen';
import { Match } from './Match';
import { Pick } from './Pick';
import { TypeAnswer } from './TypeAnswer';
import type { ExerciseResult } from './types';

export type { ExerciseResult } from './types';

export function ExerciseView({ ex, locked, onSubmit }: { ex: Exercise; locked: boolean; onSubmit: (r: ExerciseResult) => void }) {
  const p = { locked, onSubmit };
  switch (ex.kind) {
    case 'intro':
      return <Intro key={ex.key} ex={ex} {...p} />;
    case 'pick':
      return <Pick key={ex.key} ex={ex} {...p} />;
    case 'match':
      return <Match key={ex.key} ex={ex} {...p} />;
    case 'build':
      return <Build key={ex.key} ex={ex} {...p} />;
    case 'listen':
      return <Listen key={ex.key} ex={ex} {...p} />;
    case 'type':
      return <TypeAnswer key={ex.key} ex={ex} {...p} />;
    case 'choice':
      return <Choice key={ex.key} ex={ex} {...p} />;
    case 'fill':
      return <Fill key={ex.key} ex={ex} {...p} />;
  }
}

/** Exercises that advance without the correct/incorrect feedback sheet */
export const isSilent = (ex: Exercise) => ex.kind === 'intro' || ex.kind === 'match';

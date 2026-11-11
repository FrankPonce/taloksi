export type ExerciseResult = { correct: boolean; expected?: string; note?: string };
export type ExProps<E> = { ex: E; locked: boolean; onSubmit: (r: ExerciseResult) => void };

import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useApp } from '../state/store';

/** Short interface sounds. All synthesised for this project (see scripts in HANDOFF.md). */
const SOURCES = {
  correct: require('../../assets/sfx/correct.wav'),
  wrong: require('../../assets/sfx/wrong.wav'),
  tap: require('../../assets/sfx/tap.wav'),
  flip: require('../../assets/sfx/flip.wav'),
  complete: require('../../assets/sfx/complete.wav'),
} as const;

export type Sfx = keyof typeof SOURCES;

const players: Partial<Record<Sfx, AudioPlayer>> = {};

/** Play a sound effect, unless the user turned them off. Never throws. */
export function sfx(name: Sfx) {
  if (!useApp.getState().settings.sfx) return;
  try {
    let p = players[name];
    if (!p) {
      p = createAudioPlayer(SOURCES[name]);
      p.volume = 0.5;
      players[name] = p;
    }
    p.seekTo(0);
    p.play();
  } catch {
    // Sound effects are decoration: a failed one must never break a lesson
  }
}

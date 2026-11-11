import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { getCharacter } from '../content';
import { AUDIO } from './manifest';

let player: AudioPlayer | null = null;

type FiVoice = { identifier: string; gender?: 'f' | 'm' };
let fiVoices: FiVoice[] | null = null;

const MALE = /harri|onni|mies|male/i;
const FEMALE = /noora|selma|heidi|satu|female|nainen/i;

async function loadVoices(): Promise<FiVoice[]> {
  if (fiVoices && fiVoices.length) return fiVoices;
  try {
    const all = await Speech.getAvailableVoicesAsync();
    fiVoices = all
      .filter((v) => v.language?.toLowerCase().startsWith('fi'))
      .map((v) => ({ identifier: v.identifier, gender: MALE.test(v.name) ? 'm' : FEMALE.test(v.name) ? 'f' : undefined }));
  } catch {
    fiVoices = [];
  }
  return fiVoices;
}

export type SpeakOpts = {
  /** content id: plays the pre-generated clip if one exists */
  id?: string;
  rate?: number;
  /** character id: picks that character's voice */
  speaker?: string;
};

/**
 * Plays the pre-generated neural-voice clip for `id` if it exists. Otherwise
 * falls back to the device's fi-FI text-to-speech, shaped per character
 * (voice by gender where the device has one, plus pitch and pace).
 */
export function speak(text: string, opts: SpeakOpts = {}) {
  const { id, rate = 1, speaker } = opts;
  const source = id ? AUDIO[id] : undefined;
  try {
    Speech.stop();
    if (player) {
      player.remove();
      player = null;
    }
    if (source) {
      player = createAudioPlayer(source);
      if (rate !== 1) player.setPlaybackRate(rate);
      player.play();
      return;
    }
  } catch (e) {
    console.warn('Audio clip failed, falling back to TTS', e);
  }

  const voice = getCharacter(speaker)?.voice;
  loadVoices().then((voices) => {
    const match = voice ? voices.find((v) => v.gender === voice.gender) : undefined;
    // With a matching voice only nudge the pitch; without one, lean on pitch to tell characters apart.
    const pitch = voice ? (match ? 1 + (voice.webPitch - 1) * 0.5 : voice.webPitch) : 1;
    Speech.speak(text, {
      language: 'fi-FI',
      voice: match?.identifier,
      pitch,
      rate: rate * (voice?.webRate ?? 1),
    });
  });
}

export const audioIdFor = (itemId: string, puhe = false) => (puhe ? `${itemId}__puhe` : itemId);

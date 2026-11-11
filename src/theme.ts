/**
 * "Kaamos Ink" design tokens.
 *
 * The look: comic-ink panels on a polar-night background. Paper-coloured
 * panels, thick ink outlines, hard offset shadows (never blurred), slanted
 * labels and halftone dots. Accent colours are named after Finnish things.
 */
export const colors = {
  ink: '#0B0F1A',
  night: '#1B2748', // kaamos · polar night (app background)
  nightDeep: '#141D38',
  nightSoft: '#2A3964',
  paper: '#FFF8EA',
  paperDim: '#EFE4CC',

  blue: '#2F6BFF', // järvi · lake
  aurora: '#2FE6A8', // revontuli
  red: '#FF3B5C', // puolukka · lingonberry
  gold: '#FFC629', // lakka · cloudberry
  berry: '#9B6BFF', // mustikka · bilberry
  orange: '#FF8A3D',

  mutedOnPaper: '#5A6276',
  mutedOnNight: '#A9B6D6',

  // Semantic aliases used across the app
  bg: '#1B2748',
  card: '#FFF8EA',
  text: '#0B0F1A',
  muted: '#5A6276',
  border: '#0B0F1A',
  primary: '#2F6BFF',
  primarySoft: '#DCE7FF',
  success: '#17C98B',
  successBg: '#C9F8E6',
  danger: '#FF3B5C',
  dangerBg: '#FFD9DF',
  heart: '#FF3B5C',
  locked: '#77829E',
};

/** One colour per CEFR band, used by the journey timeline and level badges */
export const levelColors: Record<string, string> = {
  A1: colors.blue,
  A2: colors.aurora,
  B1: colors.gold,
  B2: colors.orange,
  C1: colors.red,
  C2: colors.berry,
};

/** Is this background light enough to need ink-coloured text? */
export function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1, 7), 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.55;
}
export const onColor = (hex: string) => (isLight(hex) ? colors.ink : colors.paper);

export const font = {
  body: 'Barlow_500Medium',
  bold: 'Barlow_700Bold',
  label: 'BarlowCondensed_700Bold',
  display: 'BarlowCondensed_800ExtraBold_Italic',
};

export const OUTLINE = 3;
/** Hard, unblurred offset shadow: the signature of the style */
export const hardShadow = (color: string = colors.ink, d = 5) => `${d}px ${d}px 0px ${color}`;

export const radius = { sm: 4, md: 6, lg: 8 };
export const space = (n: number) => n * 4;

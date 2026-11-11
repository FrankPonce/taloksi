import { createContext, useContext } from 'react';
import { Text as RNText, StyleSheet, type TextProps } from 'react-native';
import { colors, font } from '../theme';

/** Which kind of background the text sits on; decides the default colour */
export const Surface = createContext<'night' | 'paper'>('night');
export const useSurface = () => useContext(Surface);

/**
 * App-wide text. Maps `fontWeight` onto the matching font file (custom fonts
 * on native need one family per weight) and picks ink or paper as the colour.
 * 800+ is the slanted condensed display face.
 */
export function Text({ style, ...rest }: TextProps) {
  const surface = useSurface();
  const flat = StyleSheet.flatten(style) ?? {};
  const w = flat.fontWeight === 'bold' ? 700 : Number(flat.fontWeight ?? 500);
  const family = flat.fontFamily ?? (w >= 800 ? font.display : w >= 700 ? font.bold : font.body);
  return (
    <RNText
      {...rest}
      style={[{ color: surface === 'paper' ? colors.ink : colors.paper }, style, { fontFamily: family, fontWeight: 'normal' }]}
    />
  );
}

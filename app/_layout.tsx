import { Barlow_500Medium, Barlow_700Bold } from '@expo-google-fonts/barlow';
import { BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold_Italic } from '@expo-google-fonts/barlow-condensed';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Barlow_500Medium,
    Barlow_700Bold,
    BarlowCondensed_700Bold,
    BarlowCondensed_800ExtraBold_Italic,
    ...Ionicons.font,
  });
  // Hold the first paint until the fonts are in, so text never flashes in a fallback face
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.night } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="grammar/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

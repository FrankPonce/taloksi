import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { type ComponentProps } from 'react';
import { View } from 'react-native';
import { colors, font } from '../../src/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Active tab icon sits on a tilted gold block */
const icon =
  (name: IconName) =>
  ({ focused }: { focused: boolean }) => (
    <View
      style={{
        width: 44,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? colors.gold : 'transparent',
        borderWidth: focused ? 2 : 0,
        borderColor: colors.ink,
        borderRadius: 4,
        transform: [{ rotate: focused ? '-4deg' : '0deg' }],
      }}
    >
      <Ionicons name={name} size={22} color={focused ? colors.ink : colors.mutedOnNight} />
    </View>
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.paper,
        tabBarInactiveTintColor: colors.mutedOnNight,
        tabBarLabelStyle: { fontFamily: font.label, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase' },
        tabBarStyle: { backgroundColor: colors.ink, borderTopColor: colors.ink, borderTopWidth: 3, height: 66, paddingTop: 6 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Opi', tabBarIcon: icon('map') }} />
      <Tabs.Screen name="review" options={{ title: 'Kertaa', tabBarIcon: icon('flash') }} />
      <Tabs.Screen name="practice" options={{ title: 'Treeni', tabBarIcon: icon('barbell') }} />
      <Tabs.Screen name="guide" options={{ title: 'Opas', tabBarIcon: icon('compass') }} />
      <Tabs.Screen name="profile" options={{ title: 'Minä', tabBarIcon: icon('person') }} />
    </Tabs>
  );
}

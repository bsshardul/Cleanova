import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Tabs, Stack, useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '@/firebaseConfig';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null); // ✅ Typed user state
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.replace('/'); // ✅ Home route
      } else {
        setUser(null);
        router.replace('/login'); // ✅ Lowercase login route
      }
    });
    return unsubscribe;
  }, []);

  if (user === null) return null; // 🔄 Loading state

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

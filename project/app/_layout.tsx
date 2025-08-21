import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/hooks/useTheme';
import { SessionProvider } from '@/hooks/useSessionContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SessionProvider>
    </ThemeProvider>
  );
}

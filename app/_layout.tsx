import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/hooks/useTheme';
import { SessionProvider } from '@/hooks/useSessionContext';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';
import { useSafeAssets } from '@/hooks/useSafeAssets';
import { useImmersiveMode } from '@/hooks/useImmersiveMode';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const frameworkReady = useFrameworkReady();
  const assetsReady = useSafeAssets();
  
  useImmersiveMode();

  if (!frameworkReady || !assetsReady || loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
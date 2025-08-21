@@ .. @@
 import { useEffect } from 'react';
 import { Stack } from 'expo-router';
 import { StatusBar } from 'expo-status-bar';
+import { View, Text } from 'react-native';
 import { useFrameworkReady } from '@/hooks/useFrameworkReady';
 import { ThemeProvider } from '@/hooks/useTheme';
 import { SessionProvider } from '@/hooks/useSessionContext';
+import { AuthProvider, useAuth } from '@/hooks/useAuth';
+import LoadingScreen from '@/components/LoadingScreen';
+
+function AppContent() {
+  const { isLoading, isAuthenticated } = useAuth();
+
+  if (isLoading) {
+    return <LoadingScreen />;
+  }
+
+  return (
+    <ThemeProvider>
+      <SessionProvider>
+        <Stack screenOptions={{ headerShown: false }}>
+          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
+          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
+          <Stack.Screen name="+not-found" />
+        </Stack>
+        <StatusBar style="auto" />
+      </SessionProvider>
+    </ThemeProvider>
+  );
+}
 
 export default function RootLayout() {
   useFrameworkReady();
 
   return (
-    <ThemeProvider>
-      <SessionProvider>
-        <Stack screenOptions={{ headerShown: false }}>
-          <Stack.Screen name="+not-found" />
-        </Stack>
-        <StatusBar style="auto" />
-      </SessionProvider>
-    </ThemeProvider>
+    <AuthProvider>
+      <AppContent />
+    </AuthProvider>
   );
 }
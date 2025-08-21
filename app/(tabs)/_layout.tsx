@@ .. @@
 import { Tabs } from 'expo-router';
+import { Redirect } from 'expo-router';
 import { Clock, TrendingUp, History, Settings, ChartPie as PieChart } from 'lucide-react-native';
 import { useTheme } from '@/hooks/useTheme';
+import { useAuth } from '@/hooks/useAuth';
 import themeColors from '@/hooks/themeColors';
 import { useState, useEffect } from 'react';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 
 export default function TabLayout() {
   const { theme } = useTheme();
+  const { isAuthenticated, isLoading } = useAuth();
   const colors = themeColors[theme];
   const [hideTabBar, setHideTabBar] = useState(false);
   
+  if (isLoading) {
+    return null;
+  }
+
+  if (!isAuthenticated) {
+    return <Redirect href="/(auth)/welcome" />;
+  }
+
   // Listen for immersive mode changes
   useEffect(() => {
     const checkImmersiveMode = async () => {
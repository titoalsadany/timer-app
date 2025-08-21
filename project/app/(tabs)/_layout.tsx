import { Tabs } from 'expo-router';
import { Clock, TrendingUp, History, Settings, ChartPie as PieChart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import themeColors from '@/hooks/themeColors';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [hideTabBar, setHideTabBar] = useState(false);
  
  // Listen for immersive mode changes
  useEffect(() => {
    const checkImmersiveMode = async () => {
      try {
        const immersiveMode = await AsyncStorage.getItem('immersiveMode');
        const shouldHide = immersiveMode === 'true';
        setHideTabBar(shouldHide);
        console.log('Tab layout: immersive mode =', immersiveMode, 'hideTabBar =', shouldHide);
      } catch (error) {
        console.log('Error checking immersive mode:', error);
      }
    };

    // Check initially
    checkImmersiveMode();

    // Set up interval to check for changes
    const interval = setInterval(checkImmersiveMode, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          display: hideTabBar ? 'none' : 'flex',
        },
        tabBarActiveTintColor: colors.accent as string,
        tabBarInactiveTintColor: colors.textSecondary as string,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="life-view"
        options={{
          title: 'Life View',
          tabBarIcon: ({ size, color }) => (
            <PieChart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
@@ .. @@
 import { createContext, useContext, useState, ReactNode } from 'react';
+import AsyncStorage from '@react-native-async-storage/async-storage';
+import { useEffect } from 'react';
 
 export interface TimerSession {
   id: string;
@@ .. @@
 export function SessionProvider({ children }: { children: ReactNode }) {
   const [sessions, setSessions] = useState<TimerSession[]>([]);
 
+  // Load sessions from storage on mount
+  useEffect(() => {
+    loadSessions();
+  }, []);
+
+  // Save sessions to storage whenever sessions change
+  useEffect(() => {
+    saveSessions();
+  }, [sessions]);
+
+  const loadSessions = async () => {
+    try {
+      const storedSessions = await AsyncStorage.getItem('sessions');
+      if (storedSessions) {
+        const parsedSessions = JSON.parse(storedSessions).map((session: any) => ({
+          ...session,
+          startTime: new Date(session.startTime),
+          endTime: session.endTime ? new Date(session.endTime) : undefined,
+        }));
+        setSessions(parsedSessions);
+      }
+    } catch (error) {
+      console.error('Error loading sessions:', error);
+    }
+  };
+
+  const saveSessions = async () => {
+    try {
+      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
+    } catch (error) {
+      console.error('Error saving sessions:', error);
+    }
+  };
+
   const addSession = (session: TimerSession) => {
     setSessions(prev => [...prev, session]);
   };
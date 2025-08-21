@@ .. @@
 import { useTheme } from '@/hooks/useTheme';
+import { useAuth } from '@/hooks/useAuth';
 import themeColors from '@/hooks/themeColors';
+import { router } from 'expo-router';
 
 interface TimerSettings {
@@ .. @@
 export default function SettingsScreen() {
   const { theme, toggleTheme } = useTheme();
+  const { user, logout } = useAuth();
   const colors = themeColors[theme];
   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
@@ .. @@
     );
   };
 
+  const handleLogout = () => {
+    Alert.alert(
+      'Sign Out',
+      'Are you sure you want to sign out?',
+      [
+        { text: 'Cancel', style: 'cancel' },
+        { 
+          text: 'Sign Out', 
+          style: 'destructive',
+          onPress: async () => {
+            await logout();
+            router.replace('/(auth)/welcome');
+          }
+        },
+      ]
+    );
+  };
+
   return (
     <View style={[styles.container, { backgroundColor: colors.background }]}>
       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         {/* Header */}
         <View style={styles.header}>
+          {user && (
+            <View style={styles.userInfo}>
+              <Text style={[styles.userName, { color: colors.text }]}>
+                Welcome, {user.name}
+              </Text>
+              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
+                {user.email}
+              </Text>
+            </View>
+          )}
           <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
           <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Customize your focus experience</Text>
         </View>
@@ .. @@
         {/* Reset Settings */}
         <View style={styles.settingsGroup}>
+          <TouchableOpacity
+            style={styles.logoutButton}
+            onPress={handleLogout}
+          >
+            <Text style={styles.logoutButtonText}>Sign Out</Text>
+          </TouchableOpacity>
+          
           <TouchableOpacity
             style={styles.resetButton}
             onPress={resetAllSettings}
@@ .. @@
   header: {
     alignItems: 'center',
     marginBottom: 30,
   },
+  userInfo: {
+    alignItems: 'center',
+    marginBottom: 20,
+    padding: 16,
+    backgroundColor: '#F7F3E9',
+    borderRadius: 16,
+    width: '100%',
+  },
+  userName: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    marginBottom: 4,
+  },
+  userEmail: {
+    fontSize: 14,
+  },
   title: {
     fontSize: 28,
     fontWeight: 'bold',
@@ .. @@
     fontWeight: '600',
     color: '#DC2626',
   },
+  logoutButton: {
+    backgroundColor: '#FEF3C7',
+    borderRadius: 12,
+    paddingVertical: 16,
+    alignItems: 'center',
+    marginBottom: 12,
+  },
+  logoutButtonText: {
+    fontSize: 16,
+    fontWeight: '600',
+    color: '#D97706',
+  },
   modalOverlay: {
     flex: 1,
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
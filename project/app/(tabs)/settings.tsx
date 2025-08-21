import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
  Pressable,
  ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Volume2, Moon, Sun, Shield, BookOpen, Bell, Trash2, Plus, CreditCard as Edit3, ChevronRight } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import themeColors from '@/hooks/themeColors';

interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

interface AudioPack {
  id: string;
  name: string;
  type: 'quran' | 'lofi' | 'nature';
  reciter?: string;
}

interface CustomDua {
  id: string;
  text: string;
  category: string;
}

const BACKGROUND_OPTIONS = [
  { key: 'static', label: 'Static', file: null },
  { key: 'waves', label: 'Waves', file: require('@/assets/lottie/waves.json') },
  { key: 'rain', label: 'Rain', file: require('@/assets/lottie/rain.json') },
  { key: 'rain2', label: 'Rain 2', file: require('@/assets/lottie/rain.json') },
  { key: 'clouds', label: 'Clouds', file: require('@/assets/lottie/clouds.json') },
  { key: 'clouds2', label: 'Clouds 2', file: require('@/assets/lottie/clouds.json') },
  { key: 'clouds3', label: 'Clouds 3', file: require('@/assets/lottie/clouds.json') },
  { key: 'wind', label: 'Wind', file: require('@/assets/lottie/wind.json') },
];

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appBlockingEnabled, setAppBlockingEnabled] = useState(true);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showDuaModal, setShowDuaModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [editingDua, setEditingDua] = useState<CustomDua | null>(null);
  const [selectedBackground, setSelectedBackground] = useState('static');

  // Load background from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('selectedBackground').then(bg => {
      if (bg && BACKGROUND_OPTIONS.some(opt => opt.key === bg)) setSelectedBackground(bg);
    });
  }, []);
  // Save background to AsyncStorage when changed
  useEffect(() => {
    AsyncStorage.setItem('selectedBackground', selectedBackground);
  }, [selectedBackground]);

  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  });

  const [audioPacks] = useState<AudioPack[]>([
    { id: '1', name: 'Mishary Rashid Alafasy', type: 'quran', reciter: 'Mishary Rashid Alafasy' },
    { id: '2', name: 'Abdul Rahman Al-Sudais', type: 'quran', reciter: 'Abdul Rahman Al-Sudais' },
    { id: '3', name: 'Saad Al-Ghamdi', type: 'quran', reciter: 'Saad Al-Ghamdi' },
    { id: '4', name: 'Chill Lofi Beats', type: 'lofi' },
    { id: '5', name: 'Study Lofi Mix', type: 'lofi' },
    { id: '6', name: 'Ocean Waves', type: 'nature' },
    { id: '7', name: 'Forest Sounds', type: 'nature' },
    { id: '8', name: 'Rain Ambience', type: 'nature' },
  ]);

  const [customDuas, setCustomDuas] = useState<CustomDua[]>([
    {
      id: '1',
      text: 'Allahumma barik lana fi ma razaqtana (O Allah, bless us in what You have provided)',
      category: 'Work',
    },
    {
      id: '2',
      text: 'Rabbana atina fi\'d-dunya hasanatan (Our Lord, give us good in this world)',
      category: 'Study',
    },
    {
      id: '3',
      text: 'SubhanAllahi wa bihamdihi (Glory be to Allah and praise Him)',
      category: 'Worship',
    },
  ]);

  const [newDuaText, setNewDuaText] = useState('');
  const [newDuaCategory, setNewDuaCategory] = useState('');

  const handleSaveTimerSettings = () => {
    setShowTimerModal(false);
    Alert.alert('Success', 'Timer settings saved successfully!');
  };

  const handleAddDua = () => {
    if (newDuaText.trim() && newDuaCategory.trim()) {
      const newDua: CustomDua = {
        id: Date.now().toString(),
        text: newDuaText.trim(),
        category: newDuaCategory.trim(),
      };
      setCustomDuas([...customDuas, newDua]);
      setNewDuaText('');
      setNewDuaCategory('');
      setShowDuaModal(false);
    }
  };

  const handleEditDua = (dua: CustomDua) => {
    setEditingDua(dua);
    setNewDuaText(dua.text);
    setNewDuaCategory(dua.category);
    setShowDuaModal(true);
  };

  const handleUpdateDua = () => {
    if (editingDua && newDuaText.trim() && newDuaCategory.trim()) {
      setCustomDuas(customDuas.map(dua => 
        dua.id === editingDua.id 
          ? { ...dua, text: newDuaText.trim(), category: newDuaCategory.trim() }
          : dua
      ));
      setEditingDua(null);
      setNewDuaText('');
      setNewDuaCategory('');
      setShowDuaModal(false);
    }
  };

  const handleDeleteDua = (duaId: string) => {
    Alert.alert(
      'Delete Dua',
      'Are you sure you want to delete this dua?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setCustomDuas(customDuas.filter(dua => dua.id !== duaId))
        },
      ]
    );
  };

  const resetAllSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setTimerSettings({
              workDuration: 25,
              shortBreakDuration: 5,
              longBreakDuration: 15,
              longBreakInterval: 4,
            });
            // setIsDarkMode(false); // removed, now handled by context
            setNotificationsEnabled(true);
            setAppBlockingEnabled(true);
            Alert.alert('Success', 'Settings reset to default!');
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Customize your focus experience</Text>
        </View>
        {/* Background Picker Section */}
        <View style={[styles.settingsGroup, { marginBottom: 24 }]}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>Background</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            {BACKGROUND_OPTIONS.map(opt => (
              <Pressable
                key={opt.key}
                onPress={() => setSelectedBackground(opt.key)}
                style={{ alignItems: 'center', opacity: selectedBackground === opt.key ? 1 : 0.6 }}
              >
                <View style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.backgroundAlt, borderWidth: selectedBackground === opt.key ? 2 : 0, borderColor: colors.accent, justifyContent: 'center', alignItems: 'center' }}>
                  {opt.file ? (
                    <LottieView source={opt.file} autoPlay loop style={{ width: 48, height: 48 }} />
                  ) : (
                    <View style={{ width: 48, height: 48, backgroundColor: colors.backgroundAlt }} />
                  )}
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        {/* Timer Settings */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Timer</Text>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setShowTimerModal(true)}
          >
            <View style={styles.settingsIcon}>
              <Clock size={20} color="#0D4B4A" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Timer Durations</Text>
              <Text style={styles.settingsValue}>
                {timerSettings.workDuration}m work, {timerSettings.shortBreakDuration}m break
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Audio Settings */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Audio</Text>
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setShowAudioModal(true)}
          >
            <View style={styles.settingsIcon}>
              <Volume2 size={20} color="#0D4B4A" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Audio Packs</Text>
              <Text style={styles.settingsValue}>Manage Quran, Lofi & Nature sounds</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>App Preferences</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              {theme === 'dark' ? <Moon size={20} color="#0D4B4A" /> : <Sun size={20} color="#0D4B4A" />}
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Dark Mode</Text>
              <Text style={styles.settingsValue}>
                {theme === 'dark' ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#0D4B4A' }}
              thumbColor={theme === 'dark' ? '#D4AF37' : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Bell size={20} color="#0D4B4A" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Notifications</Text>
              <Text style={styles.settingsValue}>
                Session reminders and completions
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#0D4B4A' }}
              thumbColor={notificationsEnabled ? '#D4AF37' : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Shield size={20} color="#0D4B4A" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>App Blocking</Text>
              <Text style={styles.settingsValue}>
                Block distracting apps during sessions
              </Text>
            </View>
            <Switch
              value={appBlockingEnabled}
              onValueChange={setAppBlockingEnabled}
              trackColor={{ false: '#D1D5DB', true: '#0D4B4A' }}
              thumbColor={appBlockingEnabled ? '#D4AF37' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Dua Library */}
        <View style={styles.settingsGroup}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>Dua Library</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditingDua(null);
                setNewDuaText('');
                setNewDuaCategory('');
                setShowDuaModal(true);
              }}
            >
              <Plus size={20} color="#0D4B4A" />
            </TouchableOpacity>
          </View>
          
          {customDuas.map((dua) => (
            <View key={dua.id} style={styles.duaItem}>
              <View style={styles.settingsIcon}>
                <BookOpen size={20} color="#0D4B4A" />
              </View>
              <View style={styles.duaContent}>
                <Text style={styles.duaCategory}>{dua.category}</Text>
                <Text style={styles.duaText} numberOfLines={2}>
                  {dua.text}
                </Text>
              </View>
              <View style={styles.duaActions}>
                <TouchableOpacity
                  style={styles.duaAction}
                  onPress={() => handleEditDua(dua)}
                >
                  <Edit3 size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.duaAction}
                  onPress={() => handleDeleteDua(dua.id)}
                >
                  <Trash2 size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Reset Settings */}
        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAllSettings}
          >
            <Text style={styles.resetButtonText}>Reset All Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Timer Settings Modal */}
      <Modal
        visible={showTimerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Settings</Text>
            
            <View style={styles.timerInputs}>
              <View style={styles.timerInput}>
                <Text style={styles.inputLabel}>Work Duration (minutes)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={timerSettings.workDuration.toString()}
                  onChangeText={(text) => 
                    setTimerSettings(prev => ({ ...prev, workDuration: parseInt(text) || 25 }))
                  }
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.timerInput}>
                <Text style={styles.inputLabel}>Short Break (minutes)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={timerSettings.shortBreakDuration.toString()}
                  onChangeText={(text) => 
                    setTimerSettings(prev => ({ ...prev, shortBreakDuration: parseInt(text) || 5 }))
                  }
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.timerInput}>
                <Text style={styles.inputLabel}>Long Break (minutes)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={timerSettings.longBreakDuration.toString()}
                  onChangeText={(text) => 
                    setTimerSettings(prev => ({ ...prev, longBreakDuration: parseInt(text) || 15 }))
                  }
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.timerInput}>
                <Text style={styles.inputLabel}>Long Break Interval (sessions)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={timerSettings.longBreakInterval.toString()}
                  onChangeText={(text) => 
                    setTimerSettings(prev => ({ ...prev, longBreakInterval: parseInt(text) || 4 }))
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTimerModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSaveTimerSettings}
              >
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dua Modal */}
      <Modal
        visible={showDuaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDuaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingDua ? 'Edit Dua' : 'Add New Dua'}
            </Text>
            
            <View style={styles.duaInputs}>
              <View style={styles.duaInputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.textInput}
                  value={newDuaCategory}
                  onChangeText={setNewDuaCategory}
                  placeholder="e.g., Work, Study, Worship"
                />
              </View>
              
              <View style={styles.duaInputGroup}>
                <Text style={styles.inputLabel}>Dua Text</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={newDuaText}
                  onChangeText={setNewDuaText}
                  placeholder="Enter the dua or inspirational text"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDuaModal(false);
                  setEditingDua(null);
                  setNewDuaText('');
                  setNewDuaCategory('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={editingDua ? handleUpdateDua : handleAddDua}
              >
                <Text style={styles.confirmButtonText}>
                  {editingDua ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Audio Packs Modal */}
      <Modal
        visible={showAudioModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAudioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Audio Packs</Text>
            
            <ScrollView style={styles.audioPacksList} showsVerticalScrollIndicator={false}>
              {/* Quran Reciters */}
              <Text style={styles.audioPackCategory}>Quran Reciters</Text>
              {audioPacks.filter(pack => pack.type === 'quran').map((pack) => (
                <View key={pack.id} style={styles.audioPackItem}>
                  <Text style={styles.audioPackName}>{pack.name}</Text>
                  <Text style={styles.audioPackReciter}>{pack.reciter}</Text>
                </View>
              ))}

              {/* Lofi Music */}
              <Text style={styles.audioPackCategory}>Lofi Music</Text>
              {audioPacks.filter(pack => pack.type === 'lofi').map((pack) => (
                <View key={pack.id} style={styles.audioPackItem}>
                  <Text style={styles.audioPackName}>{pack.name}</Text>
                </View>
              ))}

              {/* Nature Sounds */}
              <Text style={styles.audioPackCategory}>Nature Sounds</Text>
              {audioPacks.filter(pack => pack.type === 'nature').map((pack) => (
                <View key={pack.id} style={styles.audioPackItem}>
                  <Text style={styles.audioPackName}>{pack.name}</Text>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton, { marginTop: 20 }]}
              onPress={() => setShowAudioModal(false)}
            >
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D4B4A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D4B4A',
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7F3E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F3E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  settingsValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  duaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  duaContent: {
    flex: 1,
    marginLeft: 16,
  },
  duaCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4B4A',
    marginBottom: 4,
  },
  duaText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  duaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  duaAction: {
    padding: 8,
  },
  resetButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D4B4A',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerInputs: {
    gap: 16,
    marginBottom: 24,
  },
  timerInput: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  duaInputs: {
    gap: 16,
    marginBottom: 24,
  },
  duaInputGroup: {
    gap: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#0D4B4A',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  audioPacksList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  audioPackCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D4B4A',
    marginTop: 16,
    marginBottom: 8,
  },
  audioPackItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F7F3E9',
    borderRadius: 8,
    marginBottom: 8,
  },
  audioPackName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  audioPackReciter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
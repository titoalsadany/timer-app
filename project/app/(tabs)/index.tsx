import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Video } from 'expo-av';
import { ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Play,
  Pause,
  Plus,
  Minus,
  Settings,
  X,
  Volume2,
  VolumeX,
  Music,
  Headphones,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import themeColors from '@/hooks/themeColors';
import { useSessionContext, TimerSession } from '@/hooks/useSessionContext';

const { width, height } = Dimensions.get('window');
const TIMER_SIZE = Math.min(width, height) * 0.6;

interface AudioSettings {
  volume: number;
  isMuted: boolean;
  selectedAudio: string;
  isPlaying: boolean;
}



interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface BackgroundOption {
  key: string;
  label: string;
  icon: any;
  video?: string;
  preview: string;
}

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { key: 'none', label: 'No Background', icon: Zap, video: undefined, preview: '🚫' },
  { key: 'waves', label: 'Ocean Waves', icon: Zap, video: 'Waves.mp4', preview: '🌊' },
  { key: 'rain', label: 'Gentle Rain', icon: Zap, video: 'Rain.mp4', preview: '🌧️' },
  { key: 'rain2', label: 'Heavy Rain', icon: Zap, video: 'Rain 2.mp4', preview: '⛈️' },
  { key: 'clouds', label: 'Moving Clouds', icon: Zap, video: 'Clouds.mp4', preview: '☁️' },
  { key: 'clouds2', label: 'Clouds 2', icon: Zap, video: 'Clouds 2.mp4', preview: '🌤️' },
  { key: 'clouds3', label: 'Clouds 3', icon: Zap, video: 'Clouds 3.mp4', preview: '⛅' },
  { key: 'wind', label: 'Abstract Wind', icon: Zap, video: 'Wind.mp4', preview: '💨' },
];

const AUDIO_OPTIONS = [
  { key: 'quran', label: 'Quran Recitation', icon: Music, preview: '📖' },
  { key: 'lofi', label: 'Lo-Fi Beats', icon: Headphones, preview: '🎵' },
  { key: 'nature', label: 'Nature Sounds', icon: Zap, preview: '🌿' },
  { key: 'white-noise', label: 'White Noise', icon: Zap, preview: '🔊' },
  { key: 'silence', label: 'Silence', icon: VolumeX, preview: '🔇' },
];

const CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#FF6B6B', icon: '💼' },
  { id: 'study', name: 'Study', color: '#4ECDC4', icon: '📚' },
  { id: 'reading', name: 'Reading', color: '#45B7D1', icon: '📖' },
  { id: 'exercise', name: 'Exercise', color: '#96CEB4', icon: '🏃' },
  { id: 'meditation', name: 'Meditation', color: '#FFEAA7', icon: '🧘' },
  { id: 'coding', name: 'Coding', color: '#DDA0DD', icon: '💻' },
  { id: 'writing', name: 'Writing', color: '#98D8C8', icon: '✍️' },
  { id: 'custom', name: 'Custom', color: '#F7DC6F', icon: '⭐' },
];

export default function TimerScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  
  // UI state
  const [showFloatingSettings, setShowFloatingSettings] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showDistractionLog, setShowDistractionLog] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('waves');
  const [distractions, setDistractions] = useState<string[]>([]);
  const [newDistraction, setNewDistraction] = useState('');
  
  // Session state
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  
  // Session context
  const { addSession } = useSessionContext();
  
  // Animation values
  const [timerPulse] = useState(new Animated.Value(1));
  const [settingsButtonScale] = useState(new Animated.Value(1));
  const [immersiveAnim] = useState(new Animated.Value(0));
  const [tabBarAnim] = useState(new Animated.Value(1));
  const [distractionAnim] = useState(new Animated.Value(0));
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    volume: 0.7,
    isMuted: false,
    selectedAudio: 'quran',
    isPlaying: false,
  });
  
  // Refs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<Video>(null);
  
  // Duas for different times
  const duas = [
    "بِسْمِ اللَّهِ وَعَلَى اللَّهِ تَوَكَّلْتُ",
    "رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
  ];
  
  const [currentDua] = useState(duas[Math.floor(Math.random() * duas.length)]);
  
  // Immersive mode animations
  useEffect(() => {
    if (focusMode) {
      // Animate into immersive mode
      Animated.parallel([
        Animated.timing(immersiveAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Hide status bar in immersive mode
      if (Platform.OS !== 'web') {
        StatusBar.setHidden(true, 'slide');
      }
      
      // Store immersive mode state for tab layout
      AsyncStorage.setItem('immersiveMode', 'true');
      console.log('Entering immersive mode, hiding tab bar');
    } else {
      // Animate out of immersive mode
      Animated.parallel([
        Animated.timing(immersiveAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Show status bar when exiting immersive mode
      if (Platform.OS !== 'web') {
        StatusBar.setHidden(false, 'slide');
      }
      
      // Store immersive mode state for tab layout
      AsyncStorage.setItem('immersiveMode', 'false');
      console.log('Exiting immersive mode, showing tab bar');
    }
  }, [focusMode, immersiveAnim, tabBarAnim]);
  
  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);
  
  // Pulse animation when timer is active
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(timerPulse, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(timerPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      timerPulse.setValue(1);
    }
  }, [isActive, timerPulse]);
  
  const startTimer = () => {
    setIsActive(true);
    animateButton();
    
    // Create session record
    const newSession: TimerSession = {
      id: Date.now().toString(),
      name: sessionName || `Focus Session`,
      category: selectedCategory,
      duration: timeLeft,
      startTime: new Date(),
      isCompleted: false,
      distractions: [],
    };
    
    setCurrentSession(newSession);
    addSession(newSession);
  };
  
  const pauseTimer = () => {
    setIsActive(false);
    animateButton();
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? breakDuration * 60 : workDuration * 60);
    animateButton();
  };
  
  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Mark session as completed
    if (currentSession) {
      const updatedSession = { ...currentSession, endTime: new Date(), isCompleted: true };
      // Note: The session is already added to context, so we don't need to update it here
      setCurrentSession(null);
      
      // Show completion animation
      showCompletionAnimation();
    }
    
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(workDuration * 60);
    } else {
      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
    }
  };
  
  const adjustTimer = (minutes: number) => {
    const newTime = Math.max(1, Math.min(60, (timeLeft / 60) + minutes)) * 60;
    setTimeLeft(newTime);
    if (isBreak) {
      setBreakDuration(Math.floor(newTime / 60));
    } else {
      setWorkDuration(Math.floor(newTime / 60));
    }
    animateButton();
  };
  
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(timerPulse, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(timerPulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const animateSettingsButton = () => {
    Animated.sequence([
      Animated.timing(settingsButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(settingsButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const showCompletionAnimation = () => {
    // Create a celebration animation
    Animated.sequence([
      Animated.timing(timerPulse, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(timerPulse, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // You can add sound here later
    console.log('🎉 Session completed! Great job!');
  };
  
  const toggleDistractionLog = () => {
    setShowDistractionLog(!showDistractionLog);
    Animated.timing(distractionAnim, {
      toValue: showDistractionLog ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const addDistraction = () => {
    if (newDistraction.trim()) {
      setDistractions([...distractions, newDistraction.trim()]);
      setNewDistraction('');
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getVideoSource = () => {
    const backgroundOption = BACKGROUND_OPTIONS.find(opt => opt.key === selectedBackground);
    if (backgroundOption && backgroundOption.video) {
      // Use require for local assets
      switch (backgroundOption.video) {
        case 'Waves.mp4':
          return require('@/assets/video/Waves.mp4');
        case 'Rain.mp4':
          return require('@/assets/video/Rain.mp4');
        case 'Rain 2.mp4':
          return require('@/assets/video/Rain 2.mp4');
        case 'Clouds.mp4':
          return require('@/assets/video/Clouds.mp4');
        case 'Clouds 2.mp4':
          return require('@/assets/video/Clouds 2.mp4');
        case 'Clouds 3.mp4':
          return require('@/assets/video/Clouds 3.mp4');
        case 'Wind.mp4':
          return require('@/assets/video/Wind.mp4');
        default:
          return require('@/assets/video/Waves.mp4');
      }
    }
    return require('@/assets/video/Waves.mp4'); // default fallback
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Video */}
      {focusMode && selectedBackground !== 'none' && selectedBackground !== undefined && (
        <Video
          ref={videoRef}
          source={getVideoSource()}
          style={styles.backgroundVideo}
          shouldPlay
          isLooping
          isMuted
          resizeMode={ResizeMode.COVER}
          onError={(error: any) => console.log('Video error:', error)}
        />
      )}
      
      {/* Main Content */}
      <View style={{ flex: 1, zIndex: 1 }}>
        {/* Settings button */}
        <Animated.View style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, transform: [{ scale: settingsButtonScale }] }}>
          <TouchableOpacity
            onPress={() => { animateSettingsButton(); setShowFloatingSettings(true); }}
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 22, 
              backgroundColor: colors.card, 
              justifyContent: 'center', 
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* Audio Control Button */}
        <Animated.View style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
          <TouchableOpacity
            onPress={() => setShowAudioSettings(true)}
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 22, 
              backgroundColor: colors.card, 
              justifyContent: 'center', 
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}
          >
            {audioSettings.isMuted ? (
              <VolumeX size={20} color={colors.text} />
            ) : (
              <Volume2 size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Timer and Controls */}
        <Animated.View 
          style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingHorizontal: 20,
            transform: [
              {
                scale: immersiveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1]
                })
              }
            ]
          }}
        >
          {/* Timer Display */}
          <Animated.View style={{ transform: [{ scale: timerPulse }], marginBottom: 40 }}>
            {focusMode ? (
              <BlurView intensity={40} tint="dark" style={{ 
                borderRadius: 60, 
                padding: 50,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.4,
                shadowRadius: 25,
                elevation: 15,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
                overflow: 'hidden'
              }}>
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 60
                }} />
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 56, 
                  fontWeight: '200', 
                  textShadowColor: '#000', 
                  textShadowOffset: { width: 0, height: 2 }, 
                  textShadowRadius: 4,
                  zIndex: 1
                }}>
                  {formatTime(timeLeft)}
                </Text>
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 18, 
                  marginTop: 12, 
                  opacity: 0.9, 
                  textShadowColor: '#000', 
                  textShadowOffset: { width: 0, height: 1 }, 
                  textShadowRadius: 2,
                  zIndex: 1
                }}>
                  {isBreak ? 'Break' : 'Focus'}
                </Text>
              </BlurView>
            ) : (
              <View style={{ 
                backgroundColor: colors.card, 
                borderRadius: 60, 
                padding: 50,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 15,
                elevation: 8,
                borderWidth: 1,
                borderColor: colors.backgroundAlt
              }}>
                <Text style={{ color: colors.text, fontSize: 64, fontWeight: '200' }}>{formatTime(timeLeft)}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 8 }}>{isBreak ? 'Break' : 'Focus'}</Text>
              </View>
            )}
          </Animated.View>

          {/* Timer Controls */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
            <TouchableOpacity
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 22, 
                backgroundColor: focusMode ? 'rgba(255,255,255,0.1)' : colors.card, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginRight: 20,
                borderWidth: focusMode ? 1 : 0,
                borderColor: 'rgba(255,255,255,0.2)'
              }}
              onPress={() => adjustTimer(-1)}
            >
              <Minus size={20} color={focusMode ? '#FFFFFF' : colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: focusMode ? 'rgba(255,255,255,0.15)' : colors.accent, 
                justifyContent: 'center', 
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: focusMode ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: focusMode ? 1 : 0,
                borderColor: 'rgba(255,255,255,0.3)'
              }}
              onPress={isActive ? pauseTimer : startTimer}
            >
              {isActive ? <Pause size={32} color={focusMode ? '#FFFFFF' : colors.card} /> : <Play size={32} color={focusMode ? '#FFFFFF' : colors.card} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 22, 
                backgroundColor: focusMode ? 'rgba(255,255,255,0.1)' : colors.card, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginLeft: 20,
                borderWidth: focusMode ? 1 : 0,
                borderColor: 'rgba(255,255,255,0.2)'
              }}
              onPress={() => adjustTimer(1)}
            >
              <Plus size={20} color={focusMode ? '#FFFFFF' : colors.text} />
            </TouchableOpacity>
          </View>

          {/* Quick Timer Presets - Hidden when timer is active */}
          {!isActive && (
            <View style={{ flexDirection: 'row', marginBottom: 20, gap: 12 }}>
              {[15, 25, 45, 60].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: timeLeft === minutes * 60 ? colors.accent : colors.card,
                    borderWidth: 1,
                    borderColor: colors.backgroundAlt
                  }}
                  onPress={() => setTimeLeft(minutes * 60)}
                >
                  <Text style={{
                    color: timeLeft === minutes * 60 ? colors.card : colors.text,
                    fontSize: 14,
                    fontWeight: '600'
                  }}>
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Immersive Mode Toggle */}
          <TouchableOpacity
            style={{ 
              backgroundColor: focusMode ? colors.accent : colors.card, 
              paddingHorizontal: 24, 
              paddingVertical: 12, 
              borderRadius: 25, 
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
              borderWidth: focusMode ? 0 : 2,
              borderColor: colors.accent
            }}
            onPress={() => {
              console.log('Immersive button pressed, current focusMode:', focusMode);
              setFocusMode(!focusMode);
            }}
          >
            <Text style={{ 
              color: focusMode ? colors.card : colors.accent, 
              fontWeight: '700',
              fontSize: 16
            }}>
              {focusMode ? '🚫 Exit Immersive' : '🎬 Enter Immersive'}
            </Text>
          </TouchableOpacity>

          {/* Distraction Log Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 25,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2
            }}
            onPress={toggleDistractionLog}
          >
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginRight: 8 }}>
              Distraction Log ({distractions.length})
            </Text>
            {showDistractionLog ? <ChevronUp size={20} color={colors.text} /> : <ChevronDown size={20} color={colors.text} />}
          </TouchableOpacity>



          {/* Collapsible Distraction Log */}
          {showDistractionLog && (
            <Animated.View 
              style={[
                styles.distractionLog,
                { 
                  backgroundColor: colors.card,
                  opacity: distractionAnim,
                  transform: [{
                    translateY: distractionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })
                  }]
                }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TextInput
                  style={{ 
                    flex: 1, 
                    backgroundColor: colors.backgroundAlt, 
                    borderRadius: 12, 
                    paddingHorizontal: 16, 
                    paddingVertical: 12, 
                    marginRight: 12,
                    color: colors.text,
                    fontSize: 16
                  }}
                  placeholder="Note any distractions..."
                  placeholderTextColor={colors.textSecondary}
                  value={newDistraction}
                  onChangeText={setNewDistraction}
                  onSubmitEditing={addDistraction}
                />
                <TouchableOpacity 
                  style={{ 
                    backgroundColor: colors.accent, 
                    width: 44, 
                    height: 44, 
                    borderRadius: 22, 
                    justifyContent: 'center', 
                    alignItems: 'center'
                  }}
                  onPress={addDistraction}
                >
                  <Plus size={20} color={colors.card} />
                </TouchableOpacity>
              </View>
              
              {distractions.length > 0 && (
                <View style={{ maxHeight: 120 }}>
                  {distractions.map((distraction, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, marginRight: 12 }} />
                      <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1 }}>{distraction}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          )}
        </Animated.View>
        
        {/* Dua bar at bottom */}
        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 2 }}>
          <BlurView intensity={40} tint="dark" style={{ 
            borderRadius: 30, 
            padding: 25,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 10,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
            overflow: 'hidden'
          }}>
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 30
            }} />
            <Text style={{ 
              color: '#FFFFFF', 
              fontSize: 16, 
              textAlign: 'center', 
              lineHeight: 24, 
              fontWeight: '500', 
              zIndex: 1
            }}>
              {currentDua}
            </Text>
          </BlurView>
        </View>

        {/* Floating Settings Modal */}
        <Modal
          visible={showFloatingSettings}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFloatingSettings(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 }}>
                <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Settings</Text>
                
                {/* Background Picker */}
                <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 12 }}>Background</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                  {BACKGROUND_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setSelectedBackground(opt.key)}
                      style={{ 
                        alignItems: 'center', 
                        opacity: selectedBackground === opt.key ? 1 : 0.6,
                        width: 70
                      }}
                    >
                      <View style={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: 28, 
                        backgroundColor: colors.backgroundAlt, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        borderWidth: selectedBackground === opt.key ? 2 : 0,
                        borderColor: colors.accent,
                        marginBottom: 8
                      }}>
                        <Text style={{ fontSize: 24 }}>{opt.preview}</Text>
                      </View>
                      <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center' }}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  style={{ 
                    backgroundColor: colors.accent, 
                    paddingVertical: 12, 
                    borderRadius: 12, 
                    alignItems: 'center'
                  }}
                  onPress={() => setShowFloatingSettings(false)}
                >
                  <Text style={{ color: colors.card, fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>

        {/* Audio Settings Modal */}
        <Modal
          visible={showAudioSettings}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAudioSettings(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 }}>
                <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Audio Settings</Text>
                
                {/* Audio Type Picker */}
                <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 12 }}>Audio Type</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                  {AUDIO_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setAudioSettings(prev => ({ ...prev, selectedAudio: opt.key }))}
                      style={{ 
                        alignItems: 'center', 
                        opacity: audioSettings.selectedAudio === opt.key ? 1 : 0.6,
                        width: 70
                      }}
                    >
                      <View style={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: 28, 
                        backgroundColor: colors.backgroundAlt, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        borderWidth: audioSettings.selectedAudio === opt.key ? 2 : 0,
                        borderColor: colors.accent,
                        marginBottom: 8
                      }}>
                        <Text style={{ fontSize: 24 }}>{opt.preview}</Text>
                      </View>
                      <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center' }}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Volume Control */}
                <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 12 }}>Volume</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                  <VolumeX size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1, height: 4, backgroundColor: colors.backgroundAlt, borderRadius: 2 }}>
                    <View style={{ 
                      width: `${audioSettings.volume * 100}%`, 
                      height: '100%', 
                      backgroundColor: colors.accent, 
                      borderRadius: 2 
                    }} />
                  </View>
                  <Volume2 size={20} color={colors.textSecondary} style={{ marginLeft: 12 }} />
                </View>

                {/* Mute Toggle */}
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: audioSettings.isMuted ? colors.accent : colors.card,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                    marginBottom: 24
                  }}
                  onPress={() => setAudioSettings(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                >
                  {audioSettings.isMuted ? (
                    <VolumeX size={20} color={colors.card} style={{ marginRight: 8 }} />
                  ) : (
                    <Volume2 size={20} color={colors.text} style={{ marginRight: 8 }} />
                  )}
                  <Text style={{ 
                    color: audioSettings.isMuted ? colors.card : colors.text, 
                    fontWeight: '600' 
                  }}>
                    {audioSettings.isMuted ? 'Unmute' : 'Mute'}
                  </Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  style={{ 
                    backgroundColor: colors.accent, 
                    paddingVertical: 12, 
                    borderRadius: 12, 
                    alignItems: 'center'
                  }}
                  onPress={() => setShowAudioSettings(false)}
                >
                  <Text style={{ color: colors.card, fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>

        {/* Session Setup Modal */}
        <Modal
          visible={showSessionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSessionModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={{ borderRadius: 24, overflow: 'hidden' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 24, minWidth: 300 }}>
                <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  🎯 Start Your Focus Session
                </Text>
                
                {/* Session Name Input */}
                <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 8 }}>Session Name</Text>
                <TextInput
                  style={{
                    backgroundColor: colors.backgroundAlt,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    marginBottom: 20,
                    color: colors.text,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: colors.backgroundAlt
                  }}
                  placeholder="What are you focusing on?"
                  placeholderTextColor={colors.textSecondary}
                  value={sessionName}
                  onChangeText={setSessionName}
                />
                
                {/* Category Selection */}
                <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 12 }}>Category</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: selectedCategory === cat.id ? cat.color : colors.backgroundAlt,
                        borderWidth: 1,
                        borderColor: selectedCategory === cat.id ? cat.color : colors.backgroundAlt
                      }}
                    >
                      <Text style={{
                        color: selectedCategory === cat.id ? '#FFFFFF' : colors.text,
                        fontSize: 14,
                        fontWeight: '600'
                      }}>
                        {cat.icon} {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.backgroundAlt,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center'
                    }}
                    onPress={() => setShowSessionModal(false)}
                  >
                    <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.accent,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      setShowSessionModal(false);
                      startTimer();
                    }}
                  >
                    <Text style={{ color: colors.card, fontWeight: '600' }}>Start Session</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </Modal>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  distractionLog: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
});
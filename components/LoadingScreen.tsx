import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Clock, Heart } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#0D4B4A', '#1E6B69', '#059669']}
      style={styles.container}
    >
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}>
        {/* Logo/Icon */}
        <Animated.View style={[
          styles.logoContainer,
          {
            transform: [
              { rotate: spin },
              { scale: pulseAnim },
            ],
          }
        ]}>
          <View style={styles.logoBackground}>
            <BookOpen size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.Text style={[
          styles.appName,
          { opacity: fadeAnim }
        ]}>
          Quran Focus
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[
          styles.tagline,
          { opacity: fadeAnim }
        ]}>
          Focus with Faith
        </Animated.Text>

        {/* Feature Icons */}
        <Animated.View style={[
          styles.featuresContainer,
          { opacity: fadeAnim }
        ]}>
          <View style={styles.featureItem}>
            <Clock size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.featureText}>Pomodoro Timer</Text>
          </View>
          <View style={styles.featureItem}>
            <BookOpen size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.featureText}>Quran Recitation</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.featureText}>Spiritual Growth</Text>
          </View>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View style={[
          styles.loadingContainer,
          { opacity: fadeAnim }
        ]}>
          <View style={styles.loadingBar}>
            <Animated.View style={[
              styles.loadingFill,
              {
                transform: [{ scaleX: pulseAnim }],
              }
            ]} />
          </View>
          <Text style={styles.loadingText}>Preparing your spiritual journey...</Text>
        </Animated.View>
      </Animated.View>

      {/* Islamic Pattern Overlay */}
      <View style={styles.patternOverlay}>
        <Text style={styles.arabicText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    width: '70%',
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  patternOverlay: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
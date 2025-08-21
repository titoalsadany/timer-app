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
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
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

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Floating animation for features
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effect for text
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
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
          transform: [{ scale: scaleAnim }, { translateY: slideUpAnim }],
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
            <View style={styles.logoGlow} />
            <BookOpen size={48} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.Text style={[
          styles.appName,
          { 
            opacity: Animated.multiply(fadeAnim, shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.8, 1, 0.8],
            }))
          }
        ]}>
          Quran Focus
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[
          styles.tagline,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}>
          Focus with Faith
        </Animated.Text>

        {/* Feature Icons */}
        <Animated.View style={[
          styles.featuresContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: floatTranslate }]
          }
        ]}>
          <Animated.View style={[
            styles.featureItem,
            { transform: [{ translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -5],
            }) }] }
          ]}>
            <Clock size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.featureText}>Pomodoro Timer</Text>
          </Animated.View>
          <Animated.View style={[
            styles.featureItem,
            { transform: [{ translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -8],
            }) }] }
          ]}>
            <BookOpen size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.featureText}>Quran Recitation</Text>
          </Animated.View>
          <Animated.View style={[
            styles.featureItem,
            { transform: [{ translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -6],
            }) }] }
          ]}>
            <Heart size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.featureText}>Spiritual Growth</Text>
          </Animated.View>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View style={[
          styles.loadingContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}>
          <View style={styles.loadingBar}>
            <Animated.View style={[
              styles.loadingFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }
            ]} />
            <Animated.View style={[
              styles.loadingShimmer,
              {
                opacity: shimmerOpacity,
                transform: [{
                  translateX: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 200],
                  })
                }]
              }
            ]} />
          </View>
          <Animated.Text style={[
            styles.loadingText,
            { opacity: shimmerOpacity }
          ]}>
            Preparing your spiritual journey...
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* Islamic Pattern Overlay */}
      <Animated.View style={[
        styles.patternOverlay,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }]
        }
      ]}>
        <Text style={styles.arabicText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
      </Animated.View>

      {/* Floating Particles */}
      <Animated.View style={[
        styles.particle,
        styles.particle1,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -20],
            }) },
            { rotate: spin }
          ]
        }
      ]} />
      <Animated.View style={[
        styles.particle,
        styles.particle2,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -15],
            }) },
            { rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-360deg'],
            }) }
          ]
        }
      ]} />
      <Animated.View style={[
        styles.particle,
        styles.particle3,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -25],
            }) },
            { rotate: spin }
          ]
        }
      ]} />
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
    position: 'relative',
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
    position: 'relative',
    overflow: 'hidden',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -10,
    left: -10,
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
    position: 'relative',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  loadingShimmer: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
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
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  particle1: {
    top: '20%',
    left: '15%',
  },
  particle2: {
    top: '30%',
    right: '20%',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  particle3: {
    bottom: '25%',
    left: '25%',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
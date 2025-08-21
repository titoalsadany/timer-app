import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BookOpen, Clock, Heart, Star, Target, Users } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: Clock,
      title: 'Pomodoro Timer',
      description: 'Focus sessions with Islamic mindfulness',
    },
    {
      icon: BookOpen,
      title: 'Quran Recitation',
      description: 'Listen to beautiful recitations while you work',
    },
    {
      icon: Target,
      title: 'Task Management',
      description: 'Organize your goals with spiritual intention',
    },
    {
      icon: Heart,
      title: 'Spiritual Growth',
      description: 'Daily duas and Islamic motivation',
    },
    {
      icon: Star,
      title: 'Progress Tracking',
      description: 'Monitor your focus journey and achievements',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow Muslim achievers',
    },
  ];

  return (
    <LinearGradient
      colors={['#0D4B4A', '#1E6B69', '#059669']}
      style={styles.container}
    >
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* Header */}
        <Animated.View style={[
          styles.header,
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          }
        ]}>
          <View style={styles.logoContainer}>
            <BookOpen size={64} color="#FFFFFF" />
          </View>
          <Text style={styles.appTitle}>Quran Focus</Text>
          <Text style={styles.appSubtitle}>Focus with Faith • Achieve with Barakah</Text>
        </Animated.View>

        {/* Arabic Verse */}
        <Animated.View style={[
          styles.verseContainer,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.arabicVerse}>
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </Text>
          <Text style={styles.verseTranslation}>
            "And whoever fears Allah, He will make for him a way out"
          </Text>
          <Text style={styles.verseReference}>- Quran 65:2</Text>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View style={[
          styles.featuresContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}>
          <Text style={styles.featuresTitle}>Transform Your Productivity</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + (index * 10)],
                      })
                    }],
                  }
                ]}
              >
                <View style={styles.featureIcon}>
                  <feature.icon size={28} color="#0D4B4A" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[
          styles.actionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.primaryButtonText}>Start Your Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View style={[
          styles.footer,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.footerText}>
            Join thousands of Muslims achieving their goals with faith
          </Text>
        </Animated.View>
      </Animated.ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  verseContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  arabicVerse: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '300',
  },
  verseTranslation: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(13,75,74,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D4B4A',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D4B4A',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
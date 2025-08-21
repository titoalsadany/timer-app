import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import themeColors from '@/hooks/themeColors';
import {
  Heart,
  Brain,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Star,
  Award,
  Calendar,
  Clock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
// import Svg, { Circle, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface LifeCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  progress: number;
  goal: number;
  current: number;
  description: string;
  subcategories: string[];
}

interface LifeMetrics {
  overallScore: number;
  totalGoals: number;
  completedGoals: number;
  streakDays: number;
  focusHours: number;
  socialConnections: number;
  learningProgress: number;
  healthScore: number;
}

export default function LifeView() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Mock data for life categories
  const [lifeCategories] = useState<LifeCategory[]>([
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: Heart,
      color: '#FF6B6B',
      progress: 85,
      goal: 100,
      current: 85,
      description: 'Physical and mental well-being',
      subcategories: ['Exercise', 'Nutrition', 'Sleep', 'Mental Health']
    },
    {
      id: 'intellectual',
      name: 'Intellectual Growth',
      icon: Brain,
      color: '#4ECDC4',
      progress: 72,
      goal: 100,
      current: 72,
      description: 'Learning and knowledge acquisition',
      subcategories: ['Reading', 'Courses', 'Skills', 'Research']
    },
    {
      id: 'social',
      name: 'Social Connections',
      icon: Users,
      color: '#45B7D1',
      progress: 68,
      goal: 100,
      current: 68,
      description: 'Relationships and community',
      subcategories: ['Family', 'Friends', 'Networking', 'Community']
    },
    {
      id: 'spiritual',
      name: 'Spiritual Growth',
      icon: BookOpen,
      color: '#96CEB4',
      progress: 91,
      goal: 100,
      current: 91,
      description: 'Inner peace and purpose',
      subcategories: ['Meditation', 'Prayer', 'Reflection', 'Values']
    },
    {
      id: 'career',
      name: 'Career & Goals',
      icon: Target,
      color: '#FFEAA7',
      progress: 78,
      goal: 100,
      current: 78,
      description: 'Professional development',
      subcategories: ['Skills', 'Projects', 'Leadership', 'Innovation']
    },
    {
      id: 'personal',
      name: 'Personal Development',
      icon: TrendingUp,
      color: '#DDA0DD',
      progress: 65,
      goal: 100,
      current: 65,
      description: 'Self-improvement and growth',
      subcategories: ['Habits', 'Mindset', 'Creativity', 'Confidence']
    }
  ]);

  const [lifeMetrics] = useState<LifeMetrics>({
    overallScore: 76,
    totalGoals: 24,
    completedGoals: 18,
    streakDays: 45,
    focusHours: 156,
    socialConnections: 12,
    learningProgress: 72,
    healthScore: 85
  });

  useEffect(() => {
    // Start animations
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for the main chart
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for the overall score
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderProgressRing = (progress: number, size: number, color: string, strokeWidth: number = 8) => {
    return (
      <View style={{ width: size, height: size, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.backgroundAlt,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={{
            width: size - strokeWidth * 2,
            height: size - strokeWidth * 2,
            borderRadius: (size - strokeWidth * 2) / 2,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: '#FFFFFF',
              fontSize: size * 0.2,
              fontWeight: 'bold'
            }}>
              {progress}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    const total = lifeCategories.reduce((sum, cat) => sum + cat.current, 0);

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChartVisual}>
          {lifeCategories.map((category, index) => {
            const percentage = (category.current / total) * 100;
            return (
              <View key={category.id} style={styles.pieSlice}>
                <View style={[styles.sliceIndicator, { backgroundColor: category.color }]} />
                <Text style={[styles.sliceLabel, { color: colors.text }]}>
                  {category.name}: {percentage.toFixed(1)}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Life View</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Your holistic life dashboard
          </Text>
        </Animated.View>

        {/* Overall Score Card */}
        <Animated.View style={[
          styles.overallScoreCard,
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
          }
        ]}>
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <View style={styles.scoreContent}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.overallScoreNumber}>{lifeMetrics.overallScore}</Text>
              </Animated.View>
              <Text style={styles.overallScoreLabel}>Overall Life Score</Text>
              <View style={styles.scoreBreakdown}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreItemNumber}>{lifeMetrics.completedGoals}</Text>
                  <Text style={styles.scoreItemLabel}>Goals Completed</Text>
                </View>
                <View style={styles.scoreDivider} />
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreItemNumber}>{lifeMetrics.streakDays}</Text>
                  <Text style={styles.scoreItemLabel}>Day Streak</Text>
                </View>
                <View style={styles.scoreDivider} />
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreItemNumber}>{lifeMetrics.focusHours}</Text>
                  <Text style={styles.scoreItemLabel}>Focus Hours</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Life Categories Grid */}
        <Animated.View style={[styles.categoriesSection, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Life Categories</Text>
          <View style={styles.categoriesGrid}>
            {lifeCategories.map((category, index) => (
              <Animated.View
                key={category.id}
                style={[
                  styles.categoryCard,
                  { 
                    backgroundColor: colors.card,
                    opacity: fadeAnim,
                    transform: [{ 
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: colors.backgroundAlt }]}>
                    <category.icon size={24} color={category.color} />
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                </View>
                
                {renderProgressRing(category.progress, 80, category.color, 6)}
                
                <Text style={[styles.categoryProgress, { color: colors.textSecondary }]}>
                  {category.current} / {category.goal}
                </Text>
                
                <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
                  {category.description}
                </Text>
                
                <View style={styles.subcategoriesContainer}>
                  {category.subcategories.map((sub, subIndex) => (
                    <View key={subIndex} style={styles.subcategoryItem}>
                      <View style={[styles.subcategoryDot, { backgroundColor: category.color }]} />
                      <Text style={[styles.subcategoryText, { color: colors.textSecondary }]}>
                        {sub}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* 3D Chart Section */}
        <Animated.View style={[styles.chartSection, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Life Distribution</Text>
          <View style={styles.chartContainer}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.chartBlur}>
              {renderPieChart()}
              <View style={styles.chartLegend}>
                {lifeCategories.map((category) => (
                  <View key={category.id} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                    <Text style={[styles.legendText, { color: colors.text }]}>
                      {category.name}
                    </Text>
                  </View>
                ))}
              </View>
            </BlurView>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.actionsSection, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: Target, label: 'Set Goal', color: colors.accent },
              { icon: Calendar, label: 'Schedule', color: colors.primary },
              { icon: Activity, label: 'Track', color: '#FF6B6B' },
              { icon: Star, label: 'Achieve', color: '#FFD93D' },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: colors.card }]}
              >
                                 <View style={[styles.actionIcon, { backgroundColor: colors.backgroundAlt }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  overallScoreCard: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientCard: {
    padding: 24,
  },
  scoreContent: {
    alignItems: 'center',
  },
  overallScoreNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  overallScoreLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
  },
  scoreBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreItemNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreItemLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  scoreDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  categoryProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  subcategoriesContainer: {
    marginTop: 12,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subcategoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  subcategoryText: {
    fontSize: 10,
  },
  chartSection: {
    padding: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartBlur: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  pieChartContainer: {
    marginBottom: 20,
  },
  pieChartVisual: {
    alignItems: 'center',
    gap: 12,
  },
  pieSlice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliceIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  sliceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
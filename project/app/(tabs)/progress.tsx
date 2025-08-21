import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  BookOpen,
  Briefcase,
  Dumbbell,
  Users,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Flame,
  Star,
  Gift,
  Calendar,
  Award,
  Zap,
  Crown,
  ChevronRight,
  X,
  BarChart3,
  Activity,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import themeColors from '@/hooks/themeColors';

const { width, height } = Dimensions.get('window');

interface CategoryStats {
  id: string;
  label: string;
  icon: any;
  color: string;
  sessions: number;
  totalTime: number;
  focusScore: number;
  weeklyGoal: number;
  streak: number;
}

interface WeeklyData {
  day: string;
  sessions: number;
  focusTime: number;
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export default function ProgressScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'yearly'>('weekly');
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(2450);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [totalFocusHours, setTotalFocusHours] = useState(127.5);
  
  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const [categoryStats] = useState<CategoryStats[]>([
    {
      id: 'worship',
      label: 'Worship & Prayer',
      icon: Users,
      color: colors.accent as string,
      sessions: 8,
      totalTime: 180,
      focusScore: 95,
      weeklyGoal: 210,
      streak: 12,
    },
    {
      id: 'study',
      label: 'Learning & Study',
      icon: BookOpen,
      color: '#2563EB',
      sessions: 12,
      totalTime: 285,
      focusScore: 87,
      weeklyGoal: 300,
      streak: 8,
    },
    {
      id: 'work',
      label: 'Work & Career',
      icon: Briefcase,
      color: '#7C3AED',
      sessions: 15,
      totalTime: 420,
      focusScore: 82,
      weeklyGoal: 400,
      streak: 5,
    },
    {
      id: 'exercise',
      label: 'Exercise & Health',
      icon: Dumbbell,
      color: '#DC2626',
      sessions: 5,
      totalTime: 150,
      focusScore: 91,
      weeklyGoal: 180,
      streak: 3,
    },
  ]);

  const [weeklyData] = useState<WeeklyData[]>([
    { day: 'Mon', sessions: 6, focusTime: 165, points: 180 },
    { day: 'Tue', sessions: 4, focusTime: 120, points: 140 },
    { day: 'Wed', sessions: 8, focusTime: 210, points: 250 },
    { day: 'Thu', sessions: 5, focusTime: 135, points: 160 },
    { day: 'Fri', sessions: 7, focusTime: 185, points: 220 },
    { day: 'Sat', sessions: 3, focusTime: 90, points: 110 },
    { day: 'Sun', sessions: 7, focusTime: 130, points: 170 },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first focus session',
      icon: Star,
      color: '#059669',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      color: '#DC2626',
      unlocked: true,
      progress: 7,
      maxProgress: 7,
    },
    {
      id: '3',
      title: 'Quran Scholar',
      description: 'Listen to 50 hours of Quran',
      icon: BookOpen,
      color: '#059669',
      unlocked: false,
      progress: 32,
      maxProgress: 50,
    },
    {
      id: '4',
      title: 'Focus Master',
      description: 'Complete 100 focus sessions',
      icon: Target,
      color: '#2563EB',
      unlocked: false,
      progress: 67,
      maxProgress: 100,
    },
  ]);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  const totalSessions = categoryStats.reduce((sum, cat) => sum + cat.sessions, 0);
  const totalFocusTime = categoryStats.reduce((sum, cat) => sum + cat.totalTime, 0);
  const averageFocusScore = Math.round(
    categoryStats.reduce((sum, cat) => sum + cat.focusScore, 0) / categoryStats.length
  );

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const maxWeeklyTime = Math.max(...weeklyData.map(d => d.focusTime));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Progress</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track your focus journey</Text>
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
              <Clock size={24} color={colors.accent} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{totalFocusHours}h</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Focus</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
              <Flame size={24} color={colors.accent} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{currentStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
              <Star size={24} color={colors.accent} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{currentPoints}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
          </View>
        </Animated.View>

        {/* Time Frame Selector */}
        <Animated.View style={[styles.timeframeContainer, { opacity: fadeAnim }]}>
          {(['daily', 'weekly', 'yearly'] as const).map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                { backgroundColor: colors.card },
                selectedTimeframe === timeframe && { backgroundColor: colors.accent }
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text style={[
                styles.timeframeText,
                { color: selectedTimeframe === timeframe ? colors.card : colors.text }
              ]}>
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Weekly Chart */}
        <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
          <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Focus</Text>
            <View style={styles.chart}>
              {weeklyData.map((day, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={[styles.chartBarFill, { 
                    height: `${(day.focusTime / maxWeeklyTime) * 100}%`,
                    backgroundColor: colors.accent 
                  }]} />
                  <Text style={[styles.chartBarLabel, { color: colors.textSecondary }]}>{day.day}</Text>
                  <Text style={[styles.chartBarValue, { color: colors.textSecondary }]}>{formatTime(day.focusTime)}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Category Progress */}
        <Animated.View style={[styles.categoryContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          {categoryStats.map((category, index) => (
            <Animated.View 
              key={category.id} 
              style={[
                styles.categoryCard, 
                { backgroundColor: colors.card },
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconContainer}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <category.icon size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.label}</Text>
                    <Text style={[styles.categorySubtext, { color: colors.textSecondary }]}>
                      {category.sessions} sessions • {formatTime(category.totalTime)}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryStats}>
                  <View style={styles.streakBadge}>
                    <Flame size={12} color={colors.accent} />
                    <Text style={[styles.streakText, { color: colors.accent }]}>{category.streak}</Text>
                  </View>
                  <Text style={[styles.focusScoreNumber, { color: colors.text }]}>{category.focusScore}%</Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.backgroundAlt }]}>
                  <View style={[
                    styles.progressFill,
                    { 
                      width: `${(category.totalTime / category.weeklyGoal) * 100}%`,
                      backgroundColor: category.color
                    }
                  ]} />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {formatTime(category.totalTime)} / {formatTime(category.weeklyGoal)} weekly goal
                </Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.quickActions, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowRewardsModal(true)}
          >
            <Trophy size={20} color={colors.card} />
            <Text style={[styles.actionButtonText, { color: colors.card }]}>Achievements</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Rewards Modal */}
      <Modal
        visible={showRewardsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRewardsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} style={styles.modalBlur}>
            <View style={[styles.rewardsModal, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Achievements</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowRewardsModal(false)}
                >
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
                {achievements.map((achievement) => (
                  <View key={achievement.id} style={[styles.achievementItem, { backgroundColor: colors.backgroundAlt }]}>
                    <View style={styles.achievementIcon}>
                      <achievement.icon 
                        size={24} 
                        color={achievement.unlocked ? achievement.color : colors.textSecondary} 
                      />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={[
                        styles.achievementTitle,
                        { color: colors.text }
                      ]}>
                        {achievement.title}
                      </Text>
                      <Text style={[
                        styles.achievementDescription,
                        { color: colors.textSecondary }
                      ]}>
                        {achievement.description}
                      </Text>
                      <View style={styles.achievementProgress}>
                        <View style={[styles.progressBarSmall, { backgroundColor: colors.backgroundAlt }]}>
                          <View
                            style={[
                              styles.progressFillSmall,
                              {
                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                backgroundColor: achievement.unlocked ? achievement.color : colors.textSecondary,
                              }
                            ]}
                          />
                        </View>
                        <Text style={[
                          styles.progressTextSmall,
                          { color: colors.textSecondary }
                        ]}>
                          {achievement.progress}/{achievement.maxProgress}
                        </Text>
                      </View>
                    </View>
                    {achievement.unlocked && (
                      <View style={styles.unlockedBadge}>
                        <Award size={16} color={achievement.color} />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </BlurView>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  timeframeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    marginBottom: 30,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '60%',
    borderRadius: 4,
    minHeight: 8,
  },
  chartBarLabel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  chartBarValue: {
    fontSize: 10,
    marginTop: 2,
  },
  categoryContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categorySubtext: {
    fontSize: 14,
  },
  categoryStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  focusScoreNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
  },
  quickActions: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBlur: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  rewardsModal: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  achievementsList: {
    flex: 1,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarSmall: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  progressTextSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  unlockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
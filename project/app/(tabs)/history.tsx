import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  ChevronRight,
  X,
  CheckCircle,
  Circle,
  AlertCircle,
  CalendarDays,
  Timer,
  Award,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import themeColors from '@/hooks/themeColors';
import { useSessionContext, TimerSession } from '@/hooks/useSessionContext';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

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

export default function HistoryScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const { sessions, getSessionsByDate, getDailyStats } = useSessionContext();
  const [selectedSession, setSelectedSession] = useState<TimerSession | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get sessions grouped by date
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: TimerSession[] } = {};
    
    sessions.forEach(session => {
      const dateKey = session.startTime.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(dateKey => ({
        date: new Date(dateKey),
        sessions: groups[dateKey].sort((a, b) => b.startTime.getTime() - a.startTime.getTime()),
      }));
  }, [sessions]);

  // Get overall stats
  const overallStats = useMemo(() => {
    const completedSessions = sessions.filter(s => s.isCompleted);
    const totalTime = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalDays = groupedSessions.length;
    const averageSessionsPerDay = totalDays > 0 ? (completedSessions.length / totalDays).toFixed(1) : '0';

    return {
      totalSessions: completedSessions.length,
      totalTime,
      totalDays,
      averageSessionsPerDay,
      averageTimePerDay: totalDays > 0 ? Math.round(totalTime / totalDays) : 0,
    };
  }, [sessions, groupedSessions]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[7]; // Default to custom
  };

  const calculateFocusScore = (session: TimerSession) => {
    // Simple focus score calculation based on distractions
    const baseScore = 100;
    const distractionPenalty = session.distractions.length * 5;
    return Math.max(0, baseScore - distractionPenalty);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>📊 Session History</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your focus journey
          </Text>
        </View>

        {/* Overall Stats Cards */}
        <View style={styles.statsContainer}>
                     <View style={[styles.statCard, { backgroundColor: colors.card }]}>
             <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
               <Target size={24} color={colors.accent} />
             </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {overallStats.totalSessions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Sessions
            </Text>
          </View>

                     <View style={[styles.statCard, { backgroundColor: colors.card }]}>
             <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
               <Timer size={24} color={colors.accent} />
             </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {formatDuration(overallStats.totalTime)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Time
            </Text>
          </View>

                     <View style={[styles.statCard, { backgroundColor: colors.card }]}>
             <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
               <CalendarDays size={24} color={colors.accent} />
             </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {overallStats.totalDays}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Active Days
            </Text>
          </View>

                     <View style={[styles.statCard, { backgroundColor: colors.card }]}>
             <View style={[styles.statIcon, { backgroundColor: colors.backgroundAlt }]}>
               <TrendingUp size={24} color={colors.accent} />
             </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {overallStats.averageSessionsPerDay}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Avg/Day
            </Text>
          </View>
        </View>

        {/* Daily Sessions */}
        <View style={styles.sessionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📅 Daily Sessions
          </Text>

          {groupedSessions.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Calendar size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No sessions yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Start your first focus session to see your history here
              </Text>
            </View>
          ) : (
            groupedSessions.map((group, groupIndex) => {
              const dayStats = getDailyStats(group.date);
              
              return (
                <View key={groupIndex} style={styles.dateGroup}>
                  {/* Date Header */}
                  <View style={styles.dateHeader}>
                    <View style={styles.dateInfo}>
                      <Calendar size={20} color={colors.accent} />
                      <Text style={[styles.dateTitle, { color: colors.text }]}>
                        {formatDate(group.date)}
                      </Text>
                    </View>
                    <View style={styles.dateStats}>
                      <Text style={[styles.sessionCount, { color: colors.textSecondary }]}>
                        {dayStats.completedSessions}/{dayStats.totalSessions} completed
                      </Text>
                      <Text style={[styles.totalTime, { color: colors.accent }]}>
                        {formatDuration(dayStats.totalTime)}
                      </Text>
                    </View>
                  </View>

                  {/* Sessions for this day */}
                  {group.sessions.map((session) => {
                    const categoryInfo = getCategoryInfo(session.category);
                    const focusScore = calculateFocusScore(session);
                    const startTime = formatTime(session.startTime);
                    const endTime = session.endTime ? formatTime(session.endTime) : null;

                    return (
                      <TouchableOpacity
                        key={session.id}
                        style={[styles.sessionCard, { backgroundColor: colors.card }]}
                        onPress={() => setSelectedSession(session)}
                      >
                        <View style={styles.sessionHeader}>
                          <View style={styles.sessionInfo}>
                            <View style={[styles.categoryIcon, { backgroundColor: categoryInfo.color + '20' }]}>
                              <Text style={{ fontSize: 16 }}>{categoryInfo.icon}</Text>
                            </View>
                            <View style={styles.sessionDetails}>
                              <Text style={[styles.sessionName, { color: colors.text }]} numberOfLines={1}>
                                {session.name}
                              </Text>
                              <View style={styles.sessionMeta}>
                                <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                                  {startTime}
                                </Text>
                                {endTime && (
                                  <>
                                    <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                                      {' → '}
                                    </Text>
                                    <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                                      {endTime}
                                    </Text>
                                  </>
                                )}
                                <Text style={[styles.sessionDuration, { color: colors.textSecondary }]}>
                                  {' • '}{formatDuration(session.duration)}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.sessionStatus}>
                            {session.isCompleted ? (
                              <CheckCircle size={20} color={colors.accent} />
                            ) : (
                              <Circle size={20} color={colors.textSecondary} />
                            )}
                            <ChevronRight size={16} color={colors.textSecondary} />
                          </View>
                        </View>
                        
                        {/* Focus Score */}
                        <View style={styles.focusScoreContainer}>
                          <Text style={[styles.focusScoreLabel, { color: colors.textSecondary }]}>
                            Focus Score:
                          </Text>
                          <Text style={[
                            styles.focusScore,
                            { 
                              color: focusScore >= 85 ? colors.accent : 
                                    focusScore >= 70 ? colors.textSecondary : colors.textSecondary
                            }
                          ]}>
                            {focusScore}%
                          </Text>
                        </View>

                        {/* Distractions */}
                        {session.distractions.length > 0 && (
                          <View style={styles.distractionsPreview}>
                            <AlertCircle size={14} color={colors.textSecondary} />
                            <Text style={[styles.distractionsText, { color: colors.textSecondary }]}>
                              {session.distractions.length} distraction{session.distractions.length !== 1 ? 's' : ''}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Session Detail Modal */}
      <Modal
        visible={selectedSession !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSession(null)}
      >
        {selectedSession && (
          <View style={styles.modalOverlay}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Session Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedSession(null)}
                >
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Session Overview */}
                <View style={styles.sessionOverview}>
                  <View style={styles.overviewRow}>
                    <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Task:</Text>
                    <Text style={[styles.overviewValue, { color: colors.text }]}>{selectedSession.name}</Text>
                  </View>
                  
                  <View style={styles.overviewRow}>
                    <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Category:</Text>
                    <View style={styles.categoryDisplay}>
                      <Text style={{ fontSize: 16, marginRight: 8 }}>
                        {getCategoryInfo(selectedSession.category).icon}
                      </Text>
                      <Text style={[styles.overviewValue, { color: colors.text }]}>
                        {getCategoryInfo(selectedSession.category).name}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.overviewRow}>
                    <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Duration:</Text>
                    <Text style={[styles.overviewValue, { color: colors.text }]}>
                      {formatDuration(selectedSession.duration)}
                    </Text>
                  </View>
                  
                  <View style={styles.overviewRow}>
                    <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Start Time:</Text>
                    <Text style={[styles.overviewValue, { color: colors.text }]}>
                      {formatTime(selectedSession.startTime)}
                    </Text>
                  </View>
                  
                  {selectedSession.endTime && (
                    <View style={styles.overviewRow}>
                      <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>End Time:</Text>
                      <Text style={[styles.overviewValue, { color: colors.text }]}>
                        {formatTime(selectedSession.endTime)}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.overviewRow}>
                    <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Status:</Text>
                    <View style={styles.statusDisplay}>
                      {selectedSession.isCompleted ? (
                        <CheckCircle size={16} color={colors.accent} />
                      ) : (
                        <Circle size={16} color={colors.textSecondary} />
                      )}
                      <Text style={[
                        styles.overviewValue,
                        { color: selectedSession.isCompleted ? colors.accent : colors.textSecondary }
                      ]}>
                        {selectedSession.isCompleted ? 'Completed' : 'In Progress'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.overviewRow}>
                    <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Focus Score:</Text>
                    <Text style={[
                      styles.overviewValue,
                      styles.focusScoreDetail,
                      { color: colors.accent }
                    ]}>
                      {calculateFocusScore(selectedSession)}%
                    </Text>
                  </View>
                </View>

                {/* Distractions */}
                {selectedSession.distractions.length > 0 && (
                  <View style={styles.distractionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Distractions Noted</Text>
                    {selectedSession.distractions.map((distraction, index) => (
                      <View key={index} style={[styles.distractionItem, { backgroundColor: colors.backgroundAlt }]}>
                        <AlertCircle size={16} color={colors.textSecondary} />
                        <Text style={[styles.distractionText, { color: colors.text }]}>{distraction}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Date & Time */}
                <View style={styles.timestampSection}>
                  <Text style={[styles.timestampText, { color: colors.textSecondary }]}>
                    {selectedSession.startTime.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </ScrollView>
            </BlurView>
          </View>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sessionsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  dateStats: {
    alignItems: 'flex-end',
  },
  sessionCount: {
    fontSize: 12,
    marginBottom: 2,
  },
  totalTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sessionTime: {
    fontSize: 14,
  },
  sessionDuration: {
    fontSize: 14,
  },
  sessionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  focusScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  focusScoreLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  focusScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  distractionsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  distractionsText: {
    fontSize: 12,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
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
  },
  closeButton: {
    padding: 4,
  },
  sessionOverview: {
    marginBottom: 24,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  overviewLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  focusScoreDetail: {
    fontSize: 18,
  },
  distractionsSection: {
    marginBottom: 24,
  },
  distractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  distractionText: {
    fontSize: 14,
    marginLeft: 8,
  },
  timestampSection: {
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
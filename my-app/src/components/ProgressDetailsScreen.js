import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchProgressSummary } from '../services/progressService';

export default function ProgressDetailsScreen({ navigation }) {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const data = await fetchProgressSummary();
      setProgressData(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Progress Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1D7CF2" />
        </View>
      </View>
    );
  }

  const data = progressData || {
    totalQuizzes: 0,
    averageScore: 0,
    streakDays: 0,
    todaysMinutes: 0,
    topTopics: [],
    weeklyChart: [],
  };

  const todayMinutes = data.todaysMinutes || 0;
  const progressPercentage = Math.min(100, Math.round((todayMinutes / (8 * 60)) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Progress Details</Text>
        <TouchableOpacity onPress={loadProgressData}>
          <Ionicons name="refresh" size={24} color="#1D7CF2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Today's Progress Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Study Time</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{formatTime(todayMinutes)} / 8h</Text>
          </View>
          <Text style={styles.percentageText}>{progressPercentage}% Complete</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="school-outline" size={32} color="#DB2777" />
            <Text style={styles.statValue}>{data.totalQuizzes || 0}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={32} color="#F59E0B" />
            <Text style={styles.statValue}>{data.averageScore?.toFixed(0) || 0}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={32} color="#E11D48" />
            <Text style={styles.statValue}>{data.streakDays || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        {data.weeklyChart && data.weeklyChart.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Study Time</Text>
            <View style={styles.chartContainer}>
              {data.weeklyChart.map((day, index) => {
                const maxMinutes = Math.max(...data.weeklyChart.map(d => d.minutes || 0), 1);
                const height = ((day.minutes || 0) / maxMinutes) * 100;
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={[styles.bar, { height: `${height}%` }]} />
                    <Text style={styles.chartLabel}>{day.label}</Text>
                    <Text style={styles.chartValue}>{day.minutes || 0}m</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Top Topics */}
        {data.topTopics && data.topTopics.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top Topics</Text>
            {data.topTopics.map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <View style={styles.topicIcon}>
                  <Text style={styles.topicNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.topicName}>{topic.name || topic}</Text>
                {topic.score && (
                  <Text style={styles.topicScore}>{topic.score}%</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1D7CF2',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  percentageText: {
    fontSize: 14,
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    backgroundColor: '#1D7CF2',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  chartValue: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0EAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D7CF2',
  },
  topicName: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  topicScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
});


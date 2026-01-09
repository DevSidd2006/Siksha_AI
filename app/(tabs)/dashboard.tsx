import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardService, DashboardStats } from '@/services/dashboardService';
import { AchievementService } from '@/services/achievementService';
import { getProfile } from '@/storage/profileStore';

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      const userId = 'student_default';

      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (e) {
        console.log('Profile load optional');
      }

      const newAchievements = await AchievementService.checkAndUnlockAchievements(userId);
      if (newAchievements.length > 0) {
        console.log('🏆 New achievements unlocked:', newAchievements);
      }

      const dashboardStats = await DashboardService.getDashboardStats(userId);
      setStats(dashboardStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </SafeAreaView>
    );
  }

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Unable to load dashboard</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        removeClippedSubviews={true}
      >
        {/* Header with Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.studentName}>{profile?.name || 'Student'}!</Text>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Search chapters, books, or questions...</Text>
        </View>

        {/* Quick Access Buttons */}
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity style={styles.quickAccessBtn}>
            <Text style={styles.quickAccessIcon}>📖</Text>
            <Text style={styles.quickAccessLabel}>NCERT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessBtn}>
            <Text style={styles.quickAccessIcon}>📋</Text>
            <Text style={styles.quickAccessLabel}>Syllabus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessBtn}>
            <Text style={styles.quickAccessIcon}>⬇️</Text>
            <Text style={styles.quickAccessLabel}>Downloads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessBtn}>
            <Text style={styles.quickAccessIcon}>📝</Text>
            <Text style={styles.quickAccessLabel}>Tests</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Reading */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Reading</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.continueCard}>
            <View style={styles.continueImagePlaceholder}>
              <Text style={styles.continueEmoji}>📚</Text>
            </View>
            <View style={styles.continueContent}>
              <Text style={styles.continueLabel}>SCIENCE • CHAPTER 4</Text>
              <Text style={styles.continueTitle}>Carbon and its Compounds</Text>
              <Text style={styles.continueProgress}>Last read: 2 hours ago</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '45%' }]} />
              </View>
              <Text style={styles.progressText}>45% Completed</Text>
            </View>
          </View>
        </View>

        {/* Subjects Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.subjectsGrid}>
            {[
              { emoji: '🔬', name: 'Science', color: '#00BCD4' },
              { emoji: '📐', name: 'Mathematics', color: '#FF9800' },
              { emoji: '🌍', name: 'History', color: '#4CAF50' },
              { emoji: '🌐', name: 'English', color: '#9C27B0' },
              { emoji: '🗺️', name: 'Geography', color: '#F44336' },
              { emoji: '💻', name: 'Computer', color: '#2196F3' },
            ].map((subject, idx) => (
              <TouchableOpacity key={idx} style={[styles.subjectCard, { borderTopColor: subject.color }]}>
                <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
                <Text style={styles.subjectName}>{subject.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2196F3',
  },
  greeting: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  notificationBell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: '#999',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  quickAccessBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickAccessIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickAccessLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewAll: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  continueCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  continueImagePlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  continueEmoji: {
    fontSize: 36,
  },
  continueContent: {
    flex: 1,
  },
  continueLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  continueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  continueProgress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressText: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '600',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '30%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderTopWidth: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  subjectEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});

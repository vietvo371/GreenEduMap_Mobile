/**
 * LearnScreen - Educational Content Hub
 * 
 * Educational platform for learning about:
 * - Environmental science
 * - Climate change
 * - Renewable energy
 * - Sustainability practices
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme, SPACING, FONT_SIZE, BORDER_RADIUS, ICON_SIZE } from '../theme';
import { useGreenCourses } from '../hooks/useSchools';
import type { GreenCourse } from '../types/api';

const LearnScreen: StackScreen<'Learn'> = ({ navigation }) => {
  const { educationalProgress } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<GreenCourse['category'] | 'all'>('all');
  
  // Fetch courses from API
  const { 
    data: courses, 
    total,
    loading, 
    error, 
    refetch 
  } = useGreenCourses({
    skip: 0,
    limit: 20,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });
  
  const [refreshing, setRefreshing] = useState(false);

  // Log courses data changes
  useEffect(() => {
    console.log('📚 [LearnScreen] Courses updated:', {
      count: courses.length,
      total: total,
      category: selectedCategory,
      courses: courses.map(c => ({ id: c.id, title: c.title }))
    });
  }, [courses, total, selectedCategory]);

  const onRefresh = async () => {
    console.log('🔄 [LearnScreen] Manual refresh triggered');
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    console.log('✅ [LearnScreen] Refresh completed');
  };

  const categories: Array<{ id: GreenCourse['category'] | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'Tất cả', icon: 'view-grid' },
    { id: 'climate_change', label: 'Khí hậu', icon: 'weather-cloudy' },
    { id: 'renewable_energy', label: 'Năng lượng', icon: 'solar-power' },
    { id: 'sustainability', label: 'Bền vững', icon: 'leaf' },
    { id: 'environmental_science', label: 'Khoa học', icon: 'flask' },
    { id: 'other', label: 'Khác', icon: 'dots-horizontal' },
  ];

  const handleCoursePress = (courseId: number) => {
    // TODO: Navigate to course detail screen
    console.log('Course pressed:', courseId);
  };

  const handleAchievementsPress = () => {
    navigation.navigate('Achievements');
  };

  const handleLeaderboardPress = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Learn</Text>
          <Text style={styles.headerSubtitle}>Environmental Education</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressSubtitle}>
                Level {educationalProgress?.currentLevel || 1}
              </Text>
            </View>
            <View style={styles.xpBadge}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.xpText}>
                {educationalProgress?.experiencePoints || 0} XP
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="book-open-variant" size={24} color={theme.colors.primary} />
              <Text style={styles.statValue}>
                {educationalProgress?.completedCourses.length || 0}
              </Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="clock-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statValue}>
                {educationalProgress?.totalLearningHours || 0}h
              </Text>
              <Text style={styles.statLabel}>Learning Time</Text>
            </View>

            <TouchableOpacity
              style={styles.statItem}
              onPress={handleAchievementsPress}
            >
              <Icon name="trophy" size={24} color="#FFD700" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAchievementsPress}
          >
            <Icon name="trophy" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Achievements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLeaderboardPress}
          >
            <Icon name="podium" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon
                  name={category.icon}
                  size={20}
                  color={
                    selectedCategory === category.id ? '#FFF' : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Courses List */}
        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Tất cả khóa học' : 'Khóa học đã lọc'}
          </Text>

          {loading && courses.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Đang tải khóa học...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={48} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : courses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="book-off" size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>Chưa có khóa học nào</Text>
            </View>
          ) : (
            courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => handleCoursePress(course.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.courseIcon, { backgroundColor: course.color + '20' }]}
                >
                  <Icon name={course.icon} size={32} color={course.color} />
                </View>

                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDescription}>
                    {course.description}
                  </Text>

                  <View style={styles.courseMetadata}>
                    <View style={styles.metadataItem}>
                      <Icon
                        name="clock-outline"
                        size={14}
                        color={theme.colors.textLight}
                      />
                      <Text style={styles.metadataText}>{course.duration_hours}h</Text>
                    </View>

                    <View style={styles.metadataItem}>
                      <Icon
                        name="book-open-variant"
                        size={14}
                        color={theme.colors.textLight}
                      />
                      <Text style={styles.metadataText}>
                        {course.lessons_count} bài
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor:
                            course.difficulty === 'beginner'
                              ? '#4CAF50'
                              : course.difficulty === 'intermediate'
                              ? '#FF9800'
                              : '#F44336',
                        },
                      ]}
                    >
                      <Text style={styles.difficultyText}>
                        {course.difficulty === 'beginner' ? 'Cơ bản' : 
                         course.difficulty === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                      </Text>
                    </View>
                  </View>

                  {course.progress && course.progress > 0 && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${course.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{course.progress}%</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  content: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: theme.colors.white,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...theme.shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  progressSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    marginTop: 2,
    fontFamily: theme.typography.fontFamily,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  },
  xpText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: '#F57C00',
    fontFamily: theme.typography.fontFamily,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: SPACING.xs,
    fontFamily: theme.typography.fontFamily,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
    marginTop: 4,
    fontFamily: theme.typography.fontFamily,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  categoryFilter: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    marginRight: SPACING.xs,
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.full,
    gap: 6,
    ...theme.shadows.sm,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  categoryButtonTextActive: {
    color: theme.colors.white,
  },
  coursesSection: {
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: SPACING.sm,
    fontFamily: theme.typography.fontFamily,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    ...theme.shadows.sm,
  },
  courseIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily,
  },
  courseDescription: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    marginBottom: SPACING.xs,
    fontFamily: theme.typography.fontFamily,
  },
  courseMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  difficultyText: {
    fontSize: FONT_SIZE['2xs'],
    fontWeight: '600',
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: BORDER_RADIUS.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: BORDER_RADIUS.xs,
  },
  progressText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily,
  },
  bottomPadding: {
    height: SPACING.xl,
  },
  // Loading, Error, Empty States
  loadingContainer: {
    paddingVertical: SPACING['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  errorContainer: {
    paddingVertical: SPACING['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    fontSize: FONT_SIZE.md,
    color: theme.colors.error,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  retryButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  retryButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily,
  },
  emptyContainer: {
    paddingVertical: SPACING['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
});

export default LearnScreen;


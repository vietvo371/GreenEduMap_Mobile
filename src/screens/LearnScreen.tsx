/**
 * LearnScreen - Educational Content Hub
 * 
 * Educational platform for learning about:
 * - Environmental science
 * - Climate change
 * - Renewable energy
 * - Sustainability practices
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme, SPACING, FONT_SIZE, BORDER_RADIUS } from '../theme';
import { useGreenCourses } from '../hooks/useSchools';
import type { GreenCourse } from '../types/api';

const { width } = Dimensions.get('window');

// Static categories for filters
const CATEGORIES: Array<{ id: string; label: string; icon: string }> = [
  { id: 'climate_change', label: 'Khí hậu', icon: 'weather-cloudy' },
  { id: 'renewable_energy', label: 'Năng lượng', icon: 'solar-power' },
  { id: 'sustainability', label: 'Bền vững', icon: 'leaf' },
  { id: 'environmental_science', label: 'Khoa học', icon: 'flask' },
];

const LearnScreen: StackScreen<'Learn'> = ({ navigation }) => {
  const { educationalProgress } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Create params based on filters
  const courseParams = useMemo(() => ({
    limit: 10,
    category: activeCategory !== 'all' ? activeCategory : undefined,
    difficulty: activeDifficulty !== 'all' ? activeDifficulty : undefined,
  }), [activeCategory, activeDifficulty]);

  const { data: courses, loading, refetch } = useGreenCourses(courseParams);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleAchievementsPress = () => {
    navigation.navigate('Achievements');
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.textLight;
    }
  };

  const calculateProgress = () => {
    // This would normally calculate based on completed lessons vs total
    return educationalProgress?.totalPoints ? Math.min(educationalProgress.totalPoints / 1000 * 100, 100) : 0;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Học tập</Text>
            <Text style={styles.headerSubtitle}>Kiến thức xanh cho tương lai xanh</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleAchievementsPress}>
            <ImageBackground
              source={{ uri: 'https://ui-avatars.com/api/?name=User&background=ffffff&color=4CAF50' }}
              style={styles.avatar}
              imageStyle={{ borderRadius: 20 }}
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{educationalProgress?.currentLevel || 1}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* User Progress Hero Card */}
        <View style={styles.heroCardContainer}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroTitle}>Tiến độ học tập</Text>
              <Text style={styles.heroPoints}>{educationalProgress?.totalPoints || 0} điểm</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${calculateProgress()}%` }]} />
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{educationalProgress?.coursesCompleted || 0}</Text>
                <Text style={styles.heroStatLabel}>Hoàn thành</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{courses.length}</Text>
                <Text style={styles.heroStatLabel}>Khóa học</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{educationalProgress?.currentLevel || 1}</Text>
                <Text style={styles.heroStatLabel}>Cấp độ</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filters Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Khám phá</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeCategory === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setActiveCategory('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeCategory === 'all' && styles.filterChipTextActive,
                ]}
              >
                Tất cả
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  activeCategory === cat.id && styles.filterChipActive,
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeCategory === cat.id && styles.filterChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.difficultyContainer}>
            {['beginner', 'intermediate', 'advanced'].map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyChip,
                  activeDifficulty === diff && styles.difficultyChipActive,
                  activeDifficulty === diff && { borderColor: getDifficultyColor(diff) }
                ]}
                onPress={() => setActiveDifficulty(activeDifficulty === diff ? 'all' : diff)}
              >
                <View style={[
                  styles.difficultyDot,
                  { backgroundColor: getDifficultyColor(diff) }
                ]} />
                <Text style={[
                  styles.difficultyText,
                  activeDifficulty === diff && { color: getDifficultyColor(diff), fontWeight: 'bold' }
                ]}>
                  {diff === 'beginner' ? 'Cơ bản' : diff === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Course List */}
        <View style={[styles.sectionContainer, { paddingBottom: 100 }]}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => handleCoursePress(course.id)}
                activeOpacity={0.9}
              >
                <View style={styles.courseImageContainer}>
                  <ImageBackground
                    source={{ uri: course.icon || 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                    style={styles.courseImage}
                  >
                    <View style={[styles.courseDifficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                      <Text style={styles.courseDifficultyText}>
                        {course.difficulty === 'beginner' ? 'Cơ bản' : course.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>

                <View style={styles.courseContent}>
                  <View style={styles.courseHeaderRow}>
                    <Text style={styles.courseCategory}>
                      {CATEGORIES.find(c => c.id === course.category)?.label || 'Chung'}
                    </Text>
                    <View style={styles.courseRating}>
                      <Icon name="star" size={12} color="#FFC107" />
                      <Text style={styles.courseRatingText}>4.8</Text>
                    </View>
                  </View>

                  <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>

                  <View style={styles.courseMetaRow}>
                    <View style={styles.courseMetaItem}>
                      <Icon name="clock-outline" size={14} color={theme.colors.textLight} />
                      <Text style={styles.courseMetaText}>{course.duration_hours || 2}h</Text>
                    </View>
                    <View style={styles.courseMetaItem}>
                      <Icon name="book-open-page-variant" size={14} color={theme.colors.textLight} />
                      <Text style={styles.courseMetaText}>{course.lessons_count || 5} bài</Text>
                    </View>
                  </View>

                  <View style={styles.courseFooter}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '0%' }]} />
                    </View>
                    <Text style={styles.progressText}>0%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="book-open-variant" size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyStateText}>Không tìm thấy khóa học nào</Text>
              <Text style={styles.emptyStateSubtext}>Thử thay đổi bộ lọc tìm kiếm</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Light gray 
  },
  headerBackground: {
    backgroundColor: theme.colors.primary,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl * 3, // Room for overlap
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: theme.typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontFamily: theme.typography.fontFamily,
  },
  profileButton: {
    padding: 4,
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: theme.colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  levelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: -SPACING.xl * 2, // Pull up
  },
  // Hero Card
  heroCardContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    zIndex: 1,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...theme.shadows.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  heroPoints: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  heroStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
  },
  heroDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  // Sections
  sectionContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: SPACING.md,
  },
  // Filters
  filterScroll: {
    flexGrow: 0,
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  difficultyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'transparent', // Default no border
  },
  difficultyChipActive: {
    backgroundColor: '#FFF',
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
  },
  // Course Card
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...theme.shadows.sm,
    overflow: 'hidden',
    height: 120,
  },
  courseImageContainer: {
    width: 120,
    height: '100%',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseDifficultyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseDifficultyText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  courseContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  courseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  courseRatingText: {
    fontSize: 10,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  courseTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  courseMetaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: 8,
  },
  courseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseMetaText: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
  progressText: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    marginTop: 4,
  },
});

export default LearnScreen;

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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

// Mock courses data
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Climate Change Basics',
    description: 'Understanding the science behind climate change',
    category: 'climate_change',
    duration: '2 hours',
    lessons: 8,
    difficulty: 'Beginner',
    icon: 'weather-cloudy',
    color: '#2196F3',
    progress: 0,
  },
  {
    id: '2',
    title: 'Renewable Energy 101',
    description: 'Introduction to solar, wind, and clean energy',
    category: 'renewable_energy',
    duration: '3 hours',
    lessons: 12,
    difficulty: 'Beginner',
    icon: 'solar-power',
    color: '#FF9800',
    progress: 25,
  },
  {
    id: '3',
    title: 'Sustainable Living',
    description: 'Practical tips for eco-friendly lifestyle',
    category: 'sustainability',
    duration: '1.5 hours',
    lessons: 6,
    difficulty: 'Beginner',
    icon: 'leaf',
    color: '#4CAF50',
    progress: 0,
  },
  {
    id: '4',
    title: 'Air Quality & Health',
    description: 'How air pollution affects our health',
    category: 'environmental_science',
    duration: '2.5 hours',
    lessons: 10,
    difficulty: 'Intermediate',
    icon: 'air-filter',
    color: '#9C27B0',
    progress: 0,
  },
];

const LearnScreen: StackScreen<'Learn'> = ({ navigation }) => {
  const { educationalProgress } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'view-grid' },
    { id: 'climate_change', label: 'Climate', icon: 'weather-cloudy' },
    { id: 'renewable_energy', label: 'Energy', icon: 'solar-power' },
    { id: 'sustainability', label: 'Sustainability', icon: 'leaf' },
    { id: 'environmental_science', label: 'Science', icon: 'flask' },
  ];

  const filteredCourses = selectedCategory === 'all'
    ? MOCK_COURSES
    : MOCK_COURSES.filter(c => c.category === selectedCategory);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  const handleAchievementsPress = () => {
    navigation.navigate('Achievements');
  };

  const handleLeaderboardPress = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Learn</Text>
          <Text style={styles.headerSubtitle}>Environmental Education</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            {selectedCategory === 'all' ? 'All Courses' : 'Filtered Courses'}
          </Text>

          {filteredCourses.map((course) => (
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
                    <Text style={styles.metadataText}>{course.duration}</Text>
                  </View>

                  <View style={styles.metadataItem}>
                    <Icon
                      name="book-open-variant"
                      size={14}
                      color={theme.colors.textLight}
                    />
                    <Text style={styles.metadataText}>
                      {course.lessons} lessons
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor:
                          course.difficulty === 'Beginner'
                            ? '#4CAF50'
                            : '#FF9800',
                      },
                    ]}
                  >
                    <Text style={styles.difficultyText}>{course.difficulty}</Text>
                  </View>
                </View>

                {course.progress > 0 && (
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
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  content: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressSubtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  categoryButtonTextActive: {
    color: '#FFF',
  },
  coursesSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  courseMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  bottomPadding: {
    height: 20,
  },
});

export default LearnScreen;


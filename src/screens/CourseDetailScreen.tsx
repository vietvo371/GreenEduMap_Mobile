/**
 * CourseDetailScreen - Course Details and Enrollment
 * 
 * Displays detailed information about a green course including:
 * - Course overview and description
 * - Lessons and syllabus
 * - Duration and difficulty
 * - Enrollment/progress tracking
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { theme, SPACING, FONT_SIZE, BORDER_RADIUS } from '../theme';
import { schoolService } from '../services';
import { userDataService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import type { GreenCourse } from '../types/api';

const CourseDetailScreen: StackScreen<'CourseDetail'> = ({ navigation, route }) => {
    const { courseId } = route.params;
    const { user } = useAuth();
    const [course, setCourse] = useState<GreenCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        loadCourseDetail();
    }, [courseId]);

    const loadCourseDetail = async () => {
        try {
            setLoading(true);
            // Fetch course details from API
            const courses = await schoolService.getGreenCourses({ limit: 100 });
            const foundCourse = courses.find(c => c.id === courseId);

            if (foundCourse) {
                setCourse(foundCourse);
            }
        } catch (error) {
            console.error('Failed to load course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user || !course) return;

        try {
            setEnrolling(true);

            // Log enrollment activity
            await userDataService.logActivity({
                activity_type: 'enroll_course',
                description: `Enrolled in course: ${course.title}`,
                resource_type: 'green_course',
                resource_id: course.id,
            });

            // TODO: Call enrollment API when available
            console.log('Enrolled in course:', course.id);

            // Navigate back or to course content
            navigation.goBack();
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
            setEnrolling(false);
        }
    };

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner': return theme.colors.success;
            case 'intermediate': return theme.colors.warning;
            case 'advanced': return theme.colors.error;
            default: return theme.colors.textLight;
        }
    };

    const getDifficultyLabel = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner': return 'Cơ bản';
            case 'intermediate': return 'Trung bình';
            case 'advanced': return 'Nâng cao';
            default: return 'Chưa xác định';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Đang tải khóa học...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!course) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle" size={64} color={theme.colors.error} />
                    <Text style={styles.errorText}>Không tìm thấy khóa học</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết khóa học</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Icon name="share-variant" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Course Hero */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                            <Text style={styles.difficultyText}>{getDifficultyLabel(course.difficulty)}</Text>
                        </View>

                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <Text style={styles.courseDescription}>{course.description}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Icon name="clock-outline" size={20} color={theme.colors.primary} />
                                <Text style={styles.metaText}>{course.duration_hours || 2} giờ</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Icon name="book-open-page-variant" size={20} color={theme.colors.primary} />
                                <Text style={styles.metaText}>{course.lessons_count || 5} bài học</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Icon name="account-group" size={20} color={theme.colors.primary} />
                                <Text style={styles.metaText}>{course.max_students || 100} học viên</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Course Stats */}
                <View style={styles.statsSection}>
                    <View style={styles.statCard}>
                        <Icon name="star" size={24} color="#FFC107" />
                        <Text style={styles.statValue}>4.8</Text>
                        <Text style={styles.statLabel}>Đánh giá</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="account-multiple" size={24} color={theme.colors.info} />
                        <Text style={styles.statValue}>{course.max_students || 100}</Text>
                        <Text style={styles.statLabel}>Học viên</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="certificate" size={24} color={theme.colors.success} />
                        <Text style={styles.statValue}>Có</Text>
                        <Text style={styles.statLabel}>Chứng chỉ</Text>
                    </View>
                </View>

                {/* What You'll Learn */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bạn sẽ học được gì</Text>
                    <View style={styles.learningPoints}>
                        <View style={styles.learningPoint}>
                            <Icon name="check-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.learningPointText}>Hiểu rõ về biến đổi khí hậu và tác động</Text>
                        </View>
                        <View style={styles.learningPoint}>
                            <Icon name="check-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.learningPointText}>Các giải pháp bảo vệ môi trường</Text>
                        </View>
                        <View style={styles.learningPoint}>
                            <Icon name="check-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.learningPointText}>Thực hành hành động xanh hàng ngày</Text>
                        </View>
                        <View style={styles.learningPoint}>
                            <Icon name="check-circle" size={20} color={theme.colors.success} />
                            <Text style={styles.learningPointText}>Kỹ năng truyền thông môi trường</Text>
                        </View>
                    </View>
                </View>

                {/* Course Content */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nội dung khóa học</Text>
                    <Text style={styles.sectionSubtitle}>{course.lessons_count || 5} bài học • {course.duration_weeks || 4} tuần</Text>

                    {[1, 2, 3, 4, 5].map((lesson) => (
                        <View key={lesson} style={styles.lessonCard}>
                            <View style={styles.lessonNumber}>
                                <Text style={styles.lessonNumberText}>{lesson}</Text>
                            </View>
                            <View style={styles.lessonContent}>
                                <Text style={styles.lessonTitle}>Bài {lesson}: Giới thiệu về môi trường</Text>
                                <View style={styles.lessonMeta}>
                                    <Icon name="play-circle-outline" size={14} color={theme.colors.textLight} />
                                    <Text style={styles.lessonMetaText}>15 phút</Text>
                                </View>
                            </View>
                            <Icon name="lock-outline" size={20} color={theme.colors.textLight} />
                        </View>
                    ))}
                </View>

                {/* Instructor (Optional) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Giảng viên</Text>
                    <View style={styles.instructorCard}>
                        <View style={styles.instructorAvatar}>
                            <Icon name="account" size={32} color={theme.colors.primary} />
                        </View>
                        <View style={styles.instructorInfo}>
                            <Text style={styles.instructorName}>GreenEduMap Team</Text>
                            <Text style={styles.instructorBio}>Chuyên gia về giáo dục môi trường</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Enroll Button */}
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Miễn phí</Text>
                    <Text style={styles.price}>0đ</Text>
                </View>
                <TouchableOpacity
                    style={[styles.enrollButton, enrolling && styles.enrollButtonDisabled]}
                    onPress={handleEnroll}
                    disabled={enrolling}
                >
                    {enrolling ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Icon name="school" size={20} color="#FFF" />
                            <Text style={styles.enrollButtonText}>Đăng ký học</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZE.md,
        color: theme.colors.textLight,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: theme.colors.text,
    },
    backButton: {
        marginTop: SPACING.xl,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: theme.colors.primary,
        borderRadius: BORDER_RADIUS.md,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: theme.colors.primary,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        flex: 1,
    },
    heroSection: {
        backgroundColor: '#FFF',
        padding: SPACING.xl,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    heroContent: {
        gap: SPACING.md,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    difficultyText: {
        color: '#FFF',
        fontSize: FONT_SIZE.xs,
        fontWeight: 'bold',
    },
    courseTitle: {
        fontSize: FONT_SIZE['2xl'],
        fontWeight: 'bold',
        color: theme.colors.text,
        lineHeight: 32,
    },
    courseDescription: {
        fontSize: FONT_SIZE.md,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: 'row',
        gap: SPACING.lg,
        marginTop: SPACING.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: FONT_SIZE.sm,
        color: theme.colors.text,
        fontWeight: '500',
    },
    statsSection: {
        flexDirection: 'row',
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    statValue: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: SPACING.xs,
    },
    statLabel: {
        fontSize: FONT_SIZE.xs,
        color: theme.colors.textLight,
        marginTop: 2,
    },
    section: {
        backgroundColor: '#FFF',
        padding: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: SPACING.xs,
    },
    sectionSubtitle: {
        fontSize: FONT_SIZE.sm,
        color: theme.colors.textLight,
        marginBottom: SPACING.md,
    },
    learningPoints: {
        gap: SPACING.md,
    },
    learningPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm,
    },
    learningPointText: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: theme.colors.text,
        lineHeight: 22,
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#F7F9FC',
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    lessonNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lessonNumberText: {
        color: '#FFF',
        fontSize: FONT_SIZE.sm,
        fontWeight: 'bold',
    },
    lessonContent: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    lessonMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lessonMetaText: {
        fontSize: FONT_SIZE.xs,
        color: theme.colors.textLight,
    },
    instructorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    instructorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructorInfo: {
        flex: 1,
    },
    instructorName: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 2,
    },
    instructorBio: {
        fontSize: FONT_SIZE.sm,
        color: theme.colors.textLight,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: SPACING.md,
        ...theme.shadows.lg,
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: FONT_SIZE.xs,
        color: theme.colors.textLight,
    },
    price: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: theme.colors.success,
    },
    enrollButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
        minWidth: 150,
    },
    enrollButtonDisabled: {
        opacity: 0.6,
    },
    enrollButtonText: {
        color: '#FFF',
        fontSize: FONT_SIZE.md,
        fontWeight: 'bold',
    },
});

export default CourseDetailScreen;

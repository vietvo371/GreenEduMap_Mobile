import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import {
  theme,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  ICON_SIZE,
  SCREEN_PADDING,
  wp,
  hp,
} from '../theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AlertService } from '../services/AlertService';
import { userDataService } from '../services';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, signOut, getCurrentUser, environmentalImpact, educationalProgress } = useAuth();
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // User data from services
  const [userStats, setUserStats] = useState({
    favorites: 0,
    contributions: 0,
    activities: 0,
  });

  // Animation refs for menu modal
  const slideAnim = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
    fetchUserData();
  }, []);

  const fetchProfile = async () => {
    try {
      await getCurrentUser();
    } catch (error) {
      console.error('Error fetching profile:', error);
      AlertService.error('Lỗi', 'Không thể tải thông tin tài khoản');
    }
  };

  const fetchUserData = async () => {
    try {
      const [favs, contribs, acts] = await Promise.all([
        userDataService.getFavorites(),
        userDataService.getContributions(),
        userDataService.getActivities(),
      ]);

      setUserStats({
        favorites: favs.items?.length || 0,
        contributions: contribs.items?.length || 0,
        activities: acts.items?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Silent fail - keep showing 0s
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCurrentUser();
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const menuItems = [
    {
      title: 'Tài khoản',
      items: [
        { id: 'profile', icon: 'account-outline', label: 'Thông tin cá nhân', route: 'EditProfile' },
        { id: 'security', icon: 'shield-check-outline', label: 'Bảo mật', route: 'Security' },
      ]
    },
    {
      title: 'Cài đặt & Hỗ trợ',
      items: [
        { id: 'notifications', icon: 'bell-outline', label: 'Thông báo', route: 'Notifications' },
        { id: 'help', icon: 'help-circle-outline', label: 'Trung tâm trợ giúp', route: 'Help' },
      ]
    },
    {
      title: '',
      items: [
        { id: 'logout', icon: 'logout', label: 'Đăng xuất', route: null },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      AlertService.error('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  const handleMenuPress = (itemId: string, route: string | null) => {
    handleCloseMenuModal();

    setTimeout(() => {
      if (itemId === 'logout') {
        AlertService.confirm(
          'Đăng xuất',
          'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
          handleLogout
        );
      } else if (route) {
        (navigation as any).navigate(route);
      }
    }, 300);
  };

  const handleCloseMenuModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMenuModal(false);
    });
  };

  useEffect(() => {
    if (showMenuModal) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenuModal]);

  const formatPoints = (points: number) => {
    return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.success} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.success} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Profile */}
          <View style={styles.headerContainer}>
            {/* Colored Background */}
            <View style={styles.headerBackground}>
              {/* Settings Button */}
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowMenuModal(true)}
              >
                <Icon name="cog-outline" size={ICON_SIZE.md} color={theme.colors.white} />
              </TouchableOpacity>

              <View style={styles.profileContent}>
                <View style={styles.avatarWrapper}>
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.verifiedBadge}>
                    <Icon name="check-decagram" size={16} color={theme.colors.success} />
                  </View>
                </View>

                <Text style={styles.userName}>{user?.full_name || 'Người dùng'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
              </View>
            </View>

            {/* Floating Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.carbon_saved || 0}</Text>
                <Text style={styles.statLabel}>CO₂ tiết kiệm</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {user?.points ? formatPoints(user.points) : '0'}
                </Text>
                <Text style={styles.statLabel}>Điểm xanh</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {user?.badge_level || 0}
                </Text>
                <Text style={styles.statLabel}>Cấp độ</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Cards */}
          <View style={styles.quickStatsSection}>
            <TouchableOpacity style={styles.quickStatCard} activeOpacity={0.7}>
              <View style={[styles.quickStatIcon, { backgroundColor: theme.colors.successLight }]}>
                <Icon name="tree" size={ICON_SIZE.lg} color={theme.colors.success} />
              </View>
              <Text style={styles.quickStatValue}>
                {environmentalImpact?.totalActionsCount || userStats.contributions || 0}
              </Text>
              <Text style={styles.quickStatLabel}>Hành động xanh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickStatCard} activeOpacity={0.7}>
              <View style={[styles.quickStatIcon, { backgroundColor: theme.colors.infoLight }]}>
                <Icon name="book-open-variant" size={ICON_SIZE.lg} color={theme.colors.info} />
              </View>
              <Text style={styles.quickStatValue}>
                {educationalProgress?.coursesCompleted || 0}
              </Text>
              <Text style={styles.quickStatLabel}>Khóa học</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickStatCard} activeOpacity={0.7}>
              <View style={[styles.quickStatIcon, { backgroundColor: theme.colors.warningLight }]}>
                <Icon name="trophy" size={ICON_SIZE.lg} color={theme.colors.warning} />
              </View>
              <Text style={styles.quickStatValue}>
                {userStats.favorites || userStats.activities || 0}
              </Text>
              <Text style={styles.quickStatLabel}>Thành tích</Text>
            </TouchableOpacity>
          </View>

          {/* Environmental Impact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tác động môi trường</Text>
            <View style={styles.impactCard}>
              <View style={styles.impactRow}>
                <View style={styles.impactItem}>
                  <Icon name="water" size={ICON_SIZE.md} color={theme.colors.info} />
                  <Text style={styles.impactLabel}>Nước tiết kiệm</Text>
                  <Text style={styles.impactValue}>0 lít</Text>
                </View>
                <View style={styles.impactItem}>
                  <Icon name="flash" size={ICON_SIZE.md} color={theme.colors.warning} />
                  <Text style={styles.impactLabel}>Điện tiết kiệm</Text>
                  <Text style={styles.impactValue}>0 kWh</Text>
                </View>
              </View>
            </View>
          </View>

          {/* System Info */}
          <View style={styles.systemInfo}>
            <Icon name="leaf" size={ICON_SIZE.xs} color={theme.colors.success} />
            <Text style={styles.systemInfoText}>GreenEduMap v1.0.0</Text>
          </View>
        </ScrollView>
      )}

      {/* Menu Modal - Animated Bottom Sheet */}
      {showMenuModal && (
        <>
          {/* Backdrop */}
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleCloseMenuModal}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.menuModalContent,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.sheetHandle} />

            {/* Modal Header */}
            <View style={styles.menuModalHeader}>
              <Text style={styles.menuModalTitle}>Cài đặt</Text>
              <TouchableOpacity onPress={handleCloseMenuModal}>
                <Icon name="close" size={ICON_SIZE.md} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {menuItems.map((section, index) => (
                <View key={index} style={styles.menuSection}>
                  {section.title ? <Text style={styles.menuSectionTitle}>{section.title}</Text> : null}
                  <View style={styles.menuSectionContent}>
                    {section.items.map((item, idx) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.menuModalItem,
                          idx === section.items.length - 1 && styles.lastMenuItem
                        ]}
                        onPress={() => handleMenuPress(item.id, item.route)}
                      >
                        <View style={styles.menuIconBox}>
                          <Icon
                            name={item.icon}
                            size={ICON_SIZE.md}
                            color={item.id === 'logout' ? theme.colors.error : theme.colors.text}
                          />
                        </View>
                        <Text style={[
                          styles.menuLabel,
                          item.id === 'logout' && { color: theme.colors.error }
                        ]}>
                          {item.label}
                        </Text>
                        <Icon name="chevron-right" size={ICON_SIZE.md} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING['4xl'],
  },
  headerContainer: {
    marginBottom: SPACING.lg,
  },
  headerBackground: {
    backgroundColor: theme.colors.success,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: SPACING['3xl'] + SPACING.lg,
    paddingHorizontal: SCREEN_PADDING.horizontal,
    alignItems: 'center',
    borderBottomLeftRadius: BORDER_RADIUS['2xl'],
    borderBottomRightRadius: BORDER_RADIUS['2xl'],
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + SPACING.md : SPACING.xl,
    right: SCREEN_PADDING.horizontal,
    padding: SPACING.xs,
    zIndex: 10,
  },
  profileContent: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.sm,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: wp('12%'),
  },
  avatar: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  avatarPlaceholder: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  avatarText: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: '700',
    color: theme.colors.success,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userName: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SCREEN_PADDING.horizontal,
    marginTop: -SPACING['3xl'],
    ...theme.shadows.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: theme.colors.success,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.borderLight,
    alignSelf: 'center',
  },
  quickStatsSection: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SCREEN_PADDING.horizontal,
    marginTop: SPACING.xl,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  quickStatIcon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickStatValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: FONT_SIZE['2xs'],
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SCREEN_PADDING.horizontal,
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: SPACING.md,
  },
  impactCard: {
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...theme.shadows.sm,
  },
  impactRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: 4,
  },
  impactValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  systemInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.xl,
    opacity: 0.7,
  },
  systemInfoText: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['3xl'],
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: theme.colors.textSecondary,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  menuModalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    maxHeight: '80%',
    paddingBottom: SPACING.xl,
    zIndex: 1000,
    ...theme.shadows.xl,
  },
  menuModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SCREEN_PADDING.horizontal,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuModalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  menuSection: {
    paddingHorizontal: SCREEN_PADDING.horizontal,
    marginTop: SPACING.lg,
  },
  menuSectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  menuSectionContent: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  menuModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
});

export default ProfileScreen;

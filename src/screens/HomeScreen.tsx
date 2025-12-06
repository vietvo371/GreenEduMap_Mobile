import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
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
import { useAuth } from '../contexts/AuthContext';
import { useLatestAirQuality, usePublicCurrentWeather } from '../hooks/useEnvironment';
import Geolocation from 'react-native-geolocation-service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch real AQI data
  const { data: aqiData, loading: aqiLoading, refetch: refetchAQI } = useLatestAirQuality(1);
  
  // Fetch real weather data
  const { data: weatherData, loading: weatherLoading, refetch: refetchWeather } = usePublicCurrentWeather(
    currentLocation?.lat || null,
    currentLocation?.lon || null
  );

  // Get current location on mount
  useEffect(() => {
    console.log('📍 [HomeScreen] Getting current location...');
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        console.log('✅ [HomeScreen] Location obtained:', location);
        setCurrentLocation(location);
      },
      (error) => {
        console.log('⚠️ [HomeScreen] Location error:', error);
        // Fallback to Da Nang location
        const fallbackLocation = {
          lat: 16.068882,
          lon: 108.245350,
        };
        console.log('📍 [HomeScreen] Using fallback location (Da Nang):', fallbackLocation);
        setCurrentLocation(fallbackLocation);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  // Log data changes
  useEffect(() => {
    if (aqiData && aqiData.length > 0) {
      console.log('📊 [HomeScreen] AQI Data updated:', {
        count: aqiData.length,
        first: aqiData[0]
      });
    }
  }, [aqiData]);

  useEffect(() => {
    if (weatherData) {
      console.log('🌤️ [HomeScreen] Weather Data updated:', {
        location: weatherData.location,
        temp: weatherData.temperature,
        humidity: weatherData.humidity
      });
    }
  }, [weatherData]);

  const quickActions = [
    {
      id: 'map',
      title: 'Bản đồ',
      subtitle: 'Xem dữ liệu môi trường',
      icon: 'map-marker-radius',
      color: theme.colors.success,
      onPress: () => navigation.navigate('MainTabs', { screen: 'Map' } as any),
    },
    {
      id: 'learn',
      title: 'Học tập',
      subtitle: 'Khóa học môi trường',
      icon: 'book-open-variant',
      color: theme.colors.info,
      onPress: () => navigation.navigate('MainTabs', { screen: 'Learn' } as any),
    },
    {
      id: 'actions',
      title: 'Hành động xanh',
      subtitle: 'Theo dõi hoạt động',
      icon: 'leaf',
      color: theme.colors.warning,
      onPress: () => navigation.navigate('MainTabs', { screen: 'Actions' } as any),
    },
  ];

  const statsCards = [
    {
      id: 'carbon',
      title: 'CO₂ tiết kiệm',
      value: user?.carbon_saved ? `${user.carbon_saved}kg` : '0kg',
      change: '+12%',
      trend: 'up' as const,
      icon: 'molecule-co2',
      color: theme.colors.success,
    },
    {
      id: 'points',
      title: 'Điểm xanh',
      value: user?.points?.toString() || '0',
      change: '+8%',
      trend: 'up' as const,
      icon: 'star-circle',
      color: theme.colors.environmental,
    },
    {
      id: 'actions',
      title: 'Hành động',
      value: '0',
      change: '+5',
      trend: 'up' as const,
      icon: 'run',
      color: theme.colors.warning,
    },
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchAQI(), refetchWeather()]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchAQI, refetchWeather]);

  // Get AQI color based on value
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return theme.colors.success; // Good
    if (aqi <= 100) return theme.colors.warning; // Moderate
    if (aqi <= 150) return theme.colors.error; // Unhealthy for sensitive
    if (aqi <= 200) return '#E53935'; // Unhealthy
    return '#9C27B0'; // Very unhealthy
  };

  // Get AQI status text
  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Tốt';
    if (aqi <= 100) return 'Trung bình';
    if (aqi <= 150) return 'Kém';
    if (aqi <= 200) return 'Xấu';
    return 'Rất xấu';
  };

  // Get current AQI
  const currentAQI = aqiData && aqiData.length > 0 ? aqiData[0] : null;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.headerDate}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <Text style={styles.headerGreeting}>
              Xin chào, {user?.full_name?.split(' ').pop() || 'Bạn'}! 👋
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell-outline" size={ICON_SIZE.md} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.locationBar}>
        <View style={styles.locationBadge}>
          <Icon name="map-marker" size={ICON_SIZE.xs} color={theme.colors.white} />
          <Text style={styles.locationText}>Việt Nam</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.success} />

      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            {statsCards.map((stat, index) => (
              <TouchableOpacity
                key={stat.id}
                style={[styles.statCard, {
                  backgroundColor:
                    index === 0 ? theme.colors.success
                      : index === 1 ? theme.colors.environmental
                        : theme.colors.warning
                }]}
                activeOpacity={0.8}
              >
                <View style={styles.statIconContainer}>
                  <Icon name={stat.icon} size={ICON_SIZE.xl} color="rgba(255, 255, 255, 0.9)" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <View style={styles.statTrend}>
                    <Icon
                      name={stat.trend === 'up' ? 'trending-up' : 'trending-down'}
                      size={ICON_SIZE.xs}
                      color="rgba(255, 255, 255, 0.9)"
                    />
                    <Text style={styles.statChange}>{stat.change}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Chức năng chính</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.actionCard}>
                  <View style={[styles.actionIconBox, { backgroundColor: action.color }]}>
                    <Icon name={action.icon} size={ICON_SIZE.xl} color={theme.colors.white} />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                  <View style={styles.actionArrow}>
                    <Icon name="chevron-right" size={ICON_SIZE.sm} color={theme.colors.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Air Quality Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Chất lượng không khí</Text>
            <View style={styles.sectionDivider} />
          </View>
          {aqiLoading ? (
            <View style={[styles.dataCard, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : currentAQI ? (
            <TouchableOpacity 
              style={styles.dataCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Map' } as any)}
              activeOpacity={0.7}
            >
              <View style={styles.dataCardHeader}>
                <Icon name="air-filter" size={ICON_SIZE.lg} color={getAQIColor(currentAQI.aqi)} />
                <View style={styles.dataCardInfo}>
                  <Text style={styles.dataCardLocation}>{currentAQI.location}</Text>
                  <Text style={styles.dataCardCity}>{currentAQI.city}</Text>
                </View>
              </View>
              <View style={styles.aqiValueContainer}>
                <View style={[styles.aqiBadge, { backgroundColor: getAQIColor(currentAQI.aqi) }]}>
                  <Text style={styles.aqiValue}>{currentAQI.aqi}</Text>
                </View>
                <View style={styles.aqiInfo}>
                  <Text style={styles.aqiStatus}>{getAQIStatus(currentAQI.aqi)}</Text>
                  <Text style={styles.aqiDetail}>PM2.5: {currentAQI.pm25.toFixed(1)} µg/m³</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.dataCard, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={styles.noDataText}>Không có dữ liệu AQI</Text>
            </View>
          )}
        </View>

        {/* Weather Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Thời tiết hiện tại</Text>
            <View style={styles.sectionDivider} />
          </View>
          {weatherLoading ? (
            <View style={[styles.dataCard, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : weatherData ? (
            <TouchableOpacity 
              style={styles.dataCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Map' } as any)}
              activeOpacity={0.7}
            >
              <View style={styles.dataCardHeader}>
                <Icon name="weather-cloudy" size={ICON_SIZE.lg} color={theme.colors.info} />
                <View style={styles.dataCardInfo}>
                  <Text style={styles.dataCardLocation}>{weatherData.location}</Text>
                  <Text style={styles.dataCardCity}>{weatherData.city}</Text>
                </View>
              </View>
              <View style={styles.weatherContainer}>
                <View style={styles.weatherMain}>
                  <Text style={styles.weatherTemp}>{Math.round(weatherData.temperature)}°C</Text>
                  <Text style={styles.weatherDescription}>{weatherData.weather_description}</Text>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetailItem}>
                    <Icon name="water-percent" size={ICON_SIZE.sm} color={theme.colors.textLight} />
                    <Text style={styles.weatherDetailText}>{weatherData.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <Icon name="weather-windy" size={ICON_SIZE.sm} color={theme.colors.textLight} />
                    <Text style={styles.weatherDetailText}>{weatherData.wind_speed} m/s</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.dataCard, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={styles.noDataText}>Không có dữ liệu thời tiết</Text>
            </View>
          )}
        </View>

        {/* Environmental Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Mẹo môi trường hôm nay</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Icon name="lightbulb-on" size={ICON_SIZE['2xl']} color={theme.colors.warning} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Tiết kiệm nước</Text>
              <Text style={styles.tipText}>
                Tắt vòi nước khi đánh răng có thể tiết kiệm đến 6 lít nước mỗi phút!
              </Text>
            </View>
          </View>
        </View>

        {/* System Status Footer */}
        <View style={styles.systemStatus}>
          <Icon name="leaf" size={ICON_SIZE.xs} color={theme.colors.success} />
          <Text style={styles.systemStatusText}>GreenEduMap - Vì một Việt Nam xanh</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  // Header Styles
  headerContainer: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: SCREEN_PADDING.horizontal,
    paddingTop: SPACING.md,
    paddingBottom: SPACING['2xl'],
    borderBottomLeftRadius: BORDER_RADIUS['2xl'],
    borderBottomRightRadius: BORDER_RADIUS['2xl'],
    ...theme.shadows.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarCircle: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: theme.colors.success,
  },
  greetingContainer: {
    flex: 1,
  },
  headerDate: {
    fontSize: FONT_SIZE['2xs'],
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerGreeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: theme.colors.white,
  },
  notificationBtn: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...theme.shadows.sm,
  },
  locationBar: {
    marginTop: SPACING.md,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  locationText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SCREEN_PADDING.horizontal,
    paddingBottom: SPACING['4xl'],
    marginTop: SPACING['2xl'],
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  // Stats Card Styles
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: -SPACING['3xl'],
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    minHeight: hp('16%'),
    justifyContent: 'space-between',
    ...theme.shadows.lg,
  },
  statIconContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  statContent: {
    marginTop: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: '800',
    color: theme.colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statTitle: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChange: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
  },
  // Section Header Styles
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  sectionDivider: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.success + '30',
    borderRadius: 1,
  },
  // Action Grid Styles
  actionGrid: {
    gap: SPACING.md,
  },
  actionItem: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    ...theme.shadows.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  actionIconBox: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  actionArrow: {
    opacity: 0.5,
  },
  // Tip Card Styles
  tipCard: {
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.md,
    ...theme.shadows.md,
  },
  tipIconContainer: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: theme.colors.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.5,
  },
  systemStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.md,
    opacity: 0.7,
  },
  systemStatusText: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
  },
  // Data Card Styles (AQI, Weather)
  dataCard: {
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...theme.shadows.md,
    minHeight: 120,
  },
  dataCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  dataCardInfo: {
    flex: 1,
  },
  dataCardLocation: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  dataCardCity: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  noDataText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
  // AQI Specific
  aqiValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  aqiBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  aqiValue: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: '800',
    color: theme.colors.white,
  },
  aqiInfo: {
    flex: 1,
  },
  aqiStatus: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  aqiDetail: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  // Weather Specific
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: FONT_SIZE.md,
    color: theme.colors.textLight,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    gap: SPACING.sm,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherDetailText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
});

export default HomeScreen;

import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator, FlatList } from 'react-native';
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
import { usePublicGreenZones } from '../hooks/useGreenResources';
import { useGreenCourses } from '../hooks/useSchools';
import Geolocation from 'react-native-geolocation-service';
import type { GreenZone, GreenCourse } from '../types/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch real data from APIs
  const { data: aqiData, loading: aqiLoading, refetch: refetchAQI } = useLatestAirQuality(1);
  const { data: weatherData, loading: weatherLoading, refetch: refetchWeather } = usePublicCurrentWeather(
    currentLocation?.lat || null,
    currentLocation?.lon || null
  );
  const { data: greenZones, loading: zonesLoading, refetch: refetchZones } = usePublicGreenZones({ limit: 3 });
  const { data: courses, loading: coursesLoading, refetch: refetchCourses } = useGreenCourses({ limit: 3 });

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
        // Fallback to HCM location
        const fallbackLocation = {
          lat: 10.7769,
          lon: 106.7009,
        };
        console.log('📍 [HomeScreen] Using fallback location (HCM):', fallbackLocation);
        setCurrentLocation(fallbackLocation);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchAQI(),
        refetchWeather(),
        refetchZones(),
        refetchCourses(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchAQI, refetchWeather, refetchZones, refetchCourses]);

  // Get AQI color based on value
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return theme.colors.success;
    if (aqi <= 100) return theme.colors.warning;
    if (aqi <= 150) return theme.colors.error;
    if (aqi <= 200) return '#E53935';
    return '#9C27B0';
  };

  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Tốt';
    if (aqi <= 100) return 'Trung bình';
    if (aqi <= 150) return 'Kém';
    if (aqi <= 200) return 'Xấu';
    return 'Rất xấu';
  };

  const getZoneTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      park: 'tree',
      forest: 'pine-tree',
      garden: 'flower',
      street: 'road-variant',
      botanical: 'spa',
      wetland: 'water',
      reserve: 'nature',
      other: 'leaf',
    };
    return icons[type] || 'leaf';
  };

  const getCourseIcon = (category: string) => {
    const icons: Record<string, string> = {
      environment: 'earth',
      energy: 'lightning-bolt',
      climate: 'weather-partly-cloudy',
      sustainability: 'recycle',
      other: 'book-open-variant',
    };
    return icons[category] || 'book-open-variant';
  };

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

  const renderGreenZoneItem = ({ item }: { item: GreenZone }) => (
    <TouchableOpacity
      style={styles.zoneCard}
      onPress={() => navigation.navigate('MainTabs', { screen: 'Map' } as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.zoneIcon, { backgroundColor: theme.colors.successLight }]}>
        <Icon name={getZoneTypeIcon(item.zone_type)} size={ICON_SIZE.lg} color={theme.colors.success} />
      </View>
      <View style={styles.zoneContent}>
        <Text style={styles.zoneName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.zoneDetail} numberOfLines={1}>
          {item.area_sqm ? `${(item.area_sqm / 1000).toFixed(1)}k m²` : 'N/A'} • {item.tree_count || 0} cây
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item }: { item: GreenCourse }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('MainTabs', { screen: 'Learn' } as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.courseIcon, { backgroundColor: theme.colors.infoLight }]}>
        <Icon name={getCourseIcon(item.category)} size={ICON_SIZE.lg} color={theme.colors.info} />
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.courseDetail} numberOfLines={1}>
          {item.duration_weeks ? `${item.duration_weeks} tuần` : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
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
        {/* Air Quality Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Chất lượng không khí</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Map' } as any)}>
              <Text style={styles.seeAllText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {aqiLoading ? (
            <View style={[styles.dataCard, styles.centerContent]}>
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
                  <Text style={styles.dataCardLocation}>{currentAQI.station_name}</Text>
                  <Text style={styles.dataCardCity}>
                    {currentAQI.latitude.toFixed(4)}, {currentAQI.longitude.toFixed(4)}
                  </Text>
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
            <View style={[styles.dataCard, styles.centerContent]}>
              <Text style={styles.noDataText}>Không có dữ liệu AQI</Text>
            </View>
          )}
        </View>

        {/* Weather Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Thời tiết hiện tại</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Map' } as any)}>
              <Text style={styles.seeAllText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {weatherLoading ? (
            <View style={[styles.dataCard, styles.centerContent]}>
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
                  <Text style={styles.dataCardLocation}>{weatherData.city_name}</Text>
                  <Text style={styles.dataCardCity}>
                    {weatherData.location 
                      ? `${weatherData.location.coordinates[1].toFixed(2)}, ${weatherData.location.coordinates[0].toFixed(2)}`
                      : `${weatherData.latitude?.toFixed(2)}, ${weatherData.longitude?.toFixed(2)}`
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.weatherContainer}>
                <View style={styles.weatherMain}>
                  <Text style={styles.weatherTemp}>{Math.round(weatherData.temperature)}°C</Text>
                  <Text style={styles.weatherDescription}>
                    {weatherData.weather?.description || weatherData.weather_description || 'N/A'}
                  </Text>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetailItem}>
                    <Icon name="water-percent" size={ICON_SIZE.sm} color={theme.colors.textLight} />
                    <Text style={styles.weatherDetailText}>{weatherData.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <Icon name="weather-windy" size={ICON_SIZE.sm} color={theme.colors.textLight} />
                    <Text style={styles.weatherDetailText}>
                      {weatherData.wind?.speed || weatherData.wind_speed || 0} m/s
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.dataCard, styles.centerContent]}>
              <Text style={styles.noDataText}>Không có dữ liệu thời tiết</Text>
            </View>
          )}
        </View>

        {/* Green Zones */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Khu vực xanh</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Map' } as any)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {zonesLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : greenZones && greenZones.length > 0 ? (
            <FlatList
              data={greenZones}
              renderItem={renderGreenZoneItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.noDataText}>Chưa có dữ liệu khu vực xanh</Text>
            </View>
          )}
        </View>

        {/* Green Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Khóa học môi trường</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Learn' } as any)}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {coursesLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : courses && courses.length > 0 ? (
            <View style={styles.coursesGrid}>
              {courses.map((course) => (
                <View key={course.id} style={styles.courseCardWrapper}>
                  {renderCourseItem({ item: course })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.noDataText}>Chưa có khóa học</Text>
            </View>
          )}
        </View>

        {/* Environmental Tip */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Icon name="lightbulb-on" size={ICON_SIZE['2xl']} color={theme.colors.warning} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>💡 Mẹo môi trường hôm nay</Text>
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
    paddingHorizontal: SCREEN_PADDING.horizontal,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING['4xl'],
  },
  section: {
    marginBottom: SPACING['2xl'],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.success,
    fontWeight: '600',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  // Data Card Styles (AQI, Weather)
  dataCard: {
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...theme.shadows.md,
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
  // Green Zones Horizontal List
  horizontalList: {
    paddingRight: SPACING.md,
  },
  zoneCard: {
    width: wp('65%'),
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  zoneIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  zoneContent: {
    flex: 1,
  },
  zoneName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  zoneDetail: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  // Green Courses Grid
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  courseCardWrapper: {
    width: '100%',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  courseCard: {
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  courseDetail: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  // Tip Card
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
});

export default HomeScreen;

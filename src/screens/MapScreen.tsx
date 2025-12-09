/**
 * MapScreen - Environmental Monitoring Map
 * 
 * Main dashboard screen showing interactive map with:
 * - Air quality data (Real API)
 * - Weather conditions (Real API)
 * - Green zones & parks (Real API)
 * - Schools (Real API)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  ActivityIndicator,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme, SPACING, FONT_SIZE, BORDER_RADIUS, ICON_SIZE, SCREEN_PADDING, wp, hp } from '../theme';
import LoadingOverlay from '../component/LoadingOverlay';
import env from '../config/env';

// Initialize MapTiler (Open Source Map Provider)
// MapTiler is API-compatible with Mapbox but supports open source projects
MapboxGL.setWellKnownTileServer('mapbox');
MapboxGL.setAccessToken(env.MAPTILER_API_KEY);

// Import hooks for real data
import { useLatestAirQuality, usePublicCurrentWeather } from '../hooks/useEnvironment';
import { usePublicGreenZones, useNearbyGreenZones } from '../hooks/useGreenResources';
import { useNearbySchools } from '../hooks/useSchools';
import type { AirQualityData, WeatherData, GreenZone, School } from '../types/api';

interface Location {
  latitude: number;
  longitude: number;
}

type DetailType = 'aqi' | 'school' | 'greenZone' | 'weather';

interface DetailState {
  type: DetailType;
  data: AirQualityData | School | GreenZone | WeatherData;
}

const MapScreen: StackScreen<'Map'> = ({ navigation }) => {
  const { environmentalPreferences, aiInsights } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedDataLayer, setSelectedDataLayer] = useState<'airQuality' | 'weather' | 'greenZones'>('airQuality');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<DetailState | null>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Animation values
  const slideAnim = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Icon layers visibility
  const [showIconLayers, setShowIconLayers] = useState({
    schools: true,
    greenZones: true,
  });

  // Fetch real data from APIs
  const { data: aqiData, loading: aqiLoading, refetch: refetchAQI } = useLatestAirQuality(10);
  const { data: weatherData, loading: weatherLoading, refetch: refetchWeather } = usePublicCurrentWeather(
    currentLocation?.latitude || null,
    currentLocation?.longitude || null
  );

  // Nearby params for location-based queries
  const nearbyParams = currentLocation
    ? {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius: 5,
      limit: 20,
    }
    : null;

  const { data: nearbySchools, refetch: refetchSchools } = useNearbySchools(nearbyParams);
  const { data: nearbyGreenZones, refetch: refetchZones } = useNearbyGreenZones(nearbyParams);
  const { data: publicGreenZones } = usePublicGreenZones({ limit: 20 });

  const greenZones = (nearbyGreenZones && nearbyGreenZones.length > 0) ? nearbyGreenZones : publicGreenZones;

  const onUserLocationUpdate = (location: MapboxGL.Location) => {
    if (location?.coords) {
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  const centerUserLocation = () => {
    if (currentLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#4CAF50';
    if (aqi <= 100) return '#FFEB3B';
    if (aqi <= 150) return '#FF9800';
    if (aqi <= 200) return '#F44336';
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

  const getZoneTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      park: '#16a34a',
      forest: '#065f46',
      garden: '#84cc16',
      street: '#10b981',
      botanical: '#059669',
      wetland: '#0891b2',
      reserve: '#047857',
      other: '#22c55e',
    };
    return colors[type] || '#16a34a';
  };

  const getSchoolTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      elementary: '#3b82f6',
      middle: '#6366f1',
      high: '#8b5cf6',
      university: '#a855f7',
      international: '#d946ef',
      other: '#7c3aed',
    };
    return colors[type] || '#7c3aed';
  };

  // Handle marker presses
  const handleAQIMarkerPress = (aqi: AirQualityData) => {
    setSelectedDetail({ type: 'aqi', data: aqi });
  };

  const handleSchoolPress = (school: School) => {
    setSelectedDetail({ type: 'school', data: school });
  };

  const handleGreenZonePress = (zone: GreenZone) => {
    setSelectedDetail({ type: 'greenZone', data: zone });
  };

  const handleWeatherPress = () => {
    if (weatherData) {
      setSelectedDetail({ type: 'weather', data: weatherData });
    }
  };

  const handleCloseSheet = () => {
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
      setSelectedDetail(null);
    });
  };

  useEffect(() => {
    if (selectedDetail) {
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
  }, [selectedDetail]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        refetchAQI(),
        refetchWeather(),
        refetchSchools(),
        refetchZones(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIconLayer = (layer: 'schools' | 'greenZones') => {
    setShowIconLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const currentAQI = aqiData && aqiData.length > 0 ? aqiData[0] : null;

  // Render detail content
  const renderDetailContent = () => {
    if (!selectedDetail) return null;

    const { type, data } = selectedDetail;

    switch (type) {
      case 'aqi':
        const aqiData = data as AirQualityData;
        return (
          <>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{aqiData.station_name}</Text>
                <Text style={styles.sheetSubtitle}>Trạm đo không khí</Text>
              </View>
              <TouchableOpacity onPress={handleCloseSheet}>
                <Icon name="close" size={ICON_SIZE.md} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.aqiLargeContainer}>
                <View style={[styles.aqiLargeBadge, { backgroundColor: getAQIColor(aqiData.aqi) }]}>
                  <Text style={styles.aqiLargeValue}>{aqiData.aqi}</Text>
                  <Text style={styles.aqiLargeLabel}>AQI</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aqiLargeStatus}>{getAQIStatus(aqiData.aqi)}</Text>
                  <Text style={styles.aqiLargeDesc}>
                    {aqiData.aqi <= 50 ? 'Không khí rất tốt cho sức khỏe' : aqiData.aqi <= 100 ? 'Chất lượng không khí chấp nhận được' : 'Có thể ảnh hưởng đến sức khỏe'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Chỉ số ô nhiễm</Text>
                <View style={styles.pollutantsGrid}>
                  <View style={styles.pollutantItem}>
                    <Text style={styles.pollutantValue}>{aqiData.pm25.toFixed(1)}</Text>
                    <Text style={styles.pollutantLabel}>PM2.5</Text>
                    <Text style={styles.pollutantUnit}>µg/m³</Text>
                  </View>
                  <View style={styles.pollutantItem}>
                    <Text style={styles.pollutantValue}>{aqiData.pm10.toFixed(1)}</Text>
                    <Text style={styles.pollutantLabel}>PM10</Text>
                    <Text style={styles.pollutantUnit}>µg/m³</Text>
                  </View>
                  {aqiData.co !== undefined && (
                    <View style={styles.pollutantItem}>
                      <Text style={styles.pollutantValue}>{aqiData.co.toFixed(1)}</Text>
                      <Text style={styles.pollutantLabel}>CO</Text>
                      <Text style={styles.pollutantUnit}>mg/m³</Text>
                    </View>
                  )}
                  {aqiData.no2 !== undefined && (
                    <View style={styles.pollutantItem}>
                      <Text style={styles.pollutantValue}>{aqiData.no2.toFixed(1)}</Text>
                      <Text style={styles.pollutantLabel}>NO₂</Text>
                      <Text style={styles.pollutantUnit}>µg/m³</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Thông tin vị trí</Text>
                <View style={styles.detailRow}>
                  <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detailTextSmall}>{aqiData.latitude.toFixed(6)}, {aqiData.longitude.toFixed(6)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="clock-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detailTextSmall}>Cập nhật: {new Date(aqiData.measurement_date).toLocaleString('vi-VN')}</Text>
                </View>
              </View>

              <View style={styles.sheetActions}>
                <TouchableOpacity style={styles.sheetButton} onPress={() => {
                  handleCloseSheet();
                  navigation.navigate('AirQualityDetail', {
                    location: { latitude: aqiData.latitude, longitude: aqiData.longitude, name: aqiData.station_name },
                  });
                }}>
                  <Icon name="chart-line" size={ICON_SIZE.md} color={theme.colors.primary} />
                  <Text style={styles.sheetButtonText}>Xem lịch sử</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetButton}>
                  <Icon name="share-variant-outline" size={ICON_SIZE.md} color={theme.colors.primary} />
                  <Text style={styles.sheetButtonText}>Chia sẻ</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        );

      case 'school':
        const school = data as School;
        return (
          <>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle} numberOfLines={2}>{school.name}</Text>
                <Text style={styles.sheetSubtitle}>Trường học</Text>
              </View>
              <TouchableOpacity onPress={handleCloseSheet}>
                <Icon name="close" size={ICON_SIZE.md} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: getSchoolTypeColor(school.type) + '20' }]}>
                  <Icon name="school" size={16} color={getSchoolTypeColor(school.type)} />
                  <Text style={[styles.badgeText, { color: getSchoolTypeColor(school.type) }]}>{school.type}</Text>
                </View>
                {school.green_score && (
                  <View style={[styles.badge, { backgroundColor: theme.colors.successLight }]}>
                    <Icon name="leaf" size={16} color={theme.colors.success} />
                    <Text style={[styles.badgeText, { color: theme.colors.success }]}>{school.green_score}/100</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailSection}>
                <View style={styles.detailRow}>
                  <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detailTextSmall} numberOfLines={2}>{school.address || `${school.district || 'N/A'}, ${school.city || 'Vietnam'}`}</Text>
                </View>
              </View>

              {(school.total_students || school.total_teachers || school.total_trees) && (
                <View style={styles.statsGrid}>
                  {school.total_students && (
                    <View style={styles.statItem}>
                      <Icon name="account-group" size={20} color={theme.colors.primary} />
                      <Text style={styles.statValue}>{school.total_students}</Text>
                      <Text style={styles.statLabel}>Học sinh</Text>
                    </View>
                  )}
                  {school.total_teachers && (
                    <View style={styles.statItem}>
                      <Icon name="account-tie" size={20} color={theme.colors.info} />
                      <Text style={styles.statValue}>{school.total_teachers}</Text>
                      <Text style={styles.statLabel}>Giáo viên</Text>
                    </View>
                  )}
                  {school.total_trees && (
                    <View style={styles.statItem}>
                      <Icon name="tree" size={20} color={theme.colors.success} />
                      <Text style={styles.statValue}>{school.total_trees}</Text>
                      <Text style={styles.statLabel}>Cây xanh</Text>
                    </View>
                  )}
                </View>
              )}

              {school.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Mô tả</Text>
                  <Text style={styles.detailText}>{school.description}</Text>
                </View>
              )}

              <View style={styles.sheetActions}>
                <TouchableOpacity style={styles.sheetButton}>
                  <Icon name="directions" size={ICON_SIZE.md} color={theme.colors.primary} />
                  <Text style={styles.sheetButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetButton}>
                  <Icon name="share-variant-outline" size={ICON_SIZE.md} color={theme.colors.primary} />
                  <Text style={styles.sheetButtonText}>Chia sẻ</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        );

      case 'greenZone':
        const zone = data as GreenZone;
        return (
          <>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle} numberOfLines={2}>{zone.name}</Text>
                <Text style={styles.sheetSubtitle}>Khu vực xanh</Text>
              </View>
              <TouchableOpacity onPress={handleCloseSheet}>
                <Icon name="close" size={ICON_SIZE.md} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: getZoneTypeColor(zone.zone_type) + '20' }]}>
                  <Icon name={getZoneTypeIcon(zone.zone_type)} size={16} color={getZoneTypeColor(zone.zone_type)} />
                  <Text style={[styles.badgeText, { color: getZoneTypeColor(zone.zone_type) }]}>{zone.zone_type}</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                {zone.area_sqm && (
                  <View style={styles.statItem}>
                    <Icon name="ruler-square" size={20} color={theme.colors.primary} />
                    <Text style={styles.statValue}>{(zone.area_sqm / 1000).toFixed(1)}k</Text>
                    <Text style={styles.statLabel}>m²</Text>
                  </View>
                )}
                {zone.tree_count && (
                  <View style={styles.statItem}>
                    <Icon name="tree" size={20} color={theme.colors.success} />
                    <Text style={styles.statValue}>{zone.tree_count}</Text>
                    <Text style={styles.statLabel}>Cây xanh</Text>
                  </View>
                )}
                {zone.vegetation_coverage && (
                  <View style={styles.statItem}>
                    <Icon name="sprout" size={20} color={theme.colors.environmental} />
                    <Text style={styles.statValue}>{zone.vegetation_coverage}%</Text>
                    <Text style={styles.statLabel}>Độ phủ</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailSection}>
                <View style={styles.detailRow}>
                  <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detailTextSmall}>{zone.district || 'N/A'}, {zone.city || 'Vietnam'}</Text>
                </View>
                {zone.maintained_by && (
                  <View style={styles.detailRow}>
                    <Icon name="account-wrench" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.detailTextSmall}>Quản lý: {zone.maintained_by}</Text>
                  </View>
                )}
              </View>

              {zone.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Mô tả</Text>
                  <Text style={styles.detailText}>{zone.description}</Text>
                </View>
              )}

              <View style={styles.sheetActions}>
                <TouchableOpacity style={styles.sheetButton}>
                  <Icon name="directions" size={ICON_SIZE.md} color={theme.colors.primary} />
                  <Text style={styles.sheetButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sheetButton}>
                  <Icon name="share-variant-outline" size={ICON_SIZE.md} color={theme.colors.primary} />
                  <Text style={styles.sheetButtonText}>Chia sẻ</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        );

      case 'weather':
        const weather = data as WeatherData;
        return (
          <>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{weather.city_name}</Text>
                <Text style={styles.sheetSubtitle}>Thời tiết hiện tại</Text>
              </View>
              <TouchableOpacity onPress={handleCloseSheet}>
                <Icon name="close" size={ICON_SIZE.md} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.weatherLargeContainer}>
                <Text style={styles.weatherLargeTemp}>{Math.round(weather.temperature)}°C</Text>
                <Text style={styles.weatherLargeDesc}>{weather.weather?.description || weather.weather_description || 'N/A'}</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Icon name="water-percent" size={20} color={theme.colors.info} />
                  <Text style={styles.statValue}>{weather.humidity}%</Text>
                  <Text style={styles.statLabel}>Độ ẩm</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="weather-windy" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.statValue}>{weather.wind?.speed || weather.wind_speed || 0}</Text>
                  <Text style={styles.statLabel}>m/s</Text>
                </View>
                {weather.pressure && (
                  <View style={styles.statItem}>
                    <Icon name="gauge" size={20} color={theme.colors.warning} />
                    <Text style={styles.statValue}>{weather.pressure}</Text>
                    <Text style={styles.statLabel}>hPa</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LoadingOverlay visible={loading} message="Đang tải dữ liệu môi trường..." />

      <MapboxGL.MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${env.MAPTILER_API_KEY}`}
        logoEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={() => {
          console.log('Map finished loading');
          setMapLoaded(true);
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={13}
          centerCoordinate={[106.7009, 10.7769]} // HCM
          animationMode="flyTo"
          animationDuration={1000}
        />

        <MapboxGL.UserLocation
          visible={true}
          onUpdate={onUserLocationUpdate}
          showsUserHeadingIndicator
          minDisplacement={10}
        />

        {/* AQI Markers */}
        {selectedDataLayer === 'airQuality' && aqiData && (
          <MapboxGL.ShapeSource
            id="aqiSource"
            cluster={true}
            clusterRadius={50}
            clusterMaxZoomLevel={14}
            shape={{
              type: 'FeatureCollection',
              features: aqiData.map(aqi => ({
                type: 'Feature',
                id: aqi.id || aqi.station_id,
                geometry: {
                  type: 'Point',
                  coordinates: [aqi.longitude, aqi.latitude],
                },
                properties: {
                  ...aqi,
                  color: getAQIColor(aqi.aqi),
                },
              })),
            }}
            onPress={(event) => {
              const feature = event.features[0];
              if (feature && feature.properties && !feature.properties.cluster) {
                handleAQIMarkerPress(feature.properties as unknown as AirQualityData);
              }
            }}
          >
            {/* Clusters */}
            <MapboxGL.SymbolLayer
              id="aqiClusterCount"
              style={{
                textField: ['get', 'point_count'],
                textSize: 12,
                textColor: '#ffffff',
              }}
            />
            <MapboxGL.CircleLayer
              id="aqiClusters"
              belowLayerID="aqiClusterCount"
              filter={['has', 'point_count']}
              style={{
                circleColor: theme.colors.primary,
                circleRadius: 20,
                circleOpacity: 0.7,
                circleStrokeWidth: 2,
                circleStrokeColor: 'white',
              }}
            />

            {/* Individual Points */}
            <MapboxGL.CircleLayer
              id="aqiPoints"
              filter={['!', ['has', 'point_count']]}
              style={{
                circleColor: ['get', 'color'],
                circleRadius: 16,
                circleStrokeWidth: 3,
                circleStrokeColor: 'white',
              }}
            />
            <MapboxGL.SymbolLayer
              id="aqiLabels"
              filter={['!', ['has', 'point_count']]}
              style={{
                textField: ['get', 'aqi'],
                textSize: 12,
                textColor: '#ffffff',
                textFont: ['Open Sans Bold'],
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {/* Green Zones Markers */}
        {selectedDataLayer === 'greenZones' && showIconLayers.greenZones && greenZones && (
          <MapboxGL.ShapeSource
            id="greenZonesSource"
            shape={{
              type: 'FeatureCollection',
              features: greenZones.map(zone => ({
                type: 'Feature',
                id: zone.id,
                geometry: {
                  type: 'Point',
                  coordinates: [zone.longitude, zone.latitude],
                },
                properties: zone,
              })),
            }}
            onPress={(event) => {
              const feature = event.features[0];
              if (feature && feature.properties) {
                handleGreenZonePress(feature.properties as unknown as GreenZone);
              }
            }}
          >
            <MapboxGL.CircleLayer
              id="greenZonesLayer"
              style={{
                circleColor: theme.colors.success,
                circleRadius: 12,
                circleStrokeWidth: 2,
                circleStrokeColor: 'white',
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {/* Schools Markers */}
        {showIconLayers.schools && nearbySchools && (
          <MapboxGL.ShapeSource
            id="schoolsSource"
            shape={{
              type: 'FeatureCollection',
              features: nearbySchools.map(school => ({
                type: 'Feature',
                id: school.id,
                geometry: {
                  type: 'Point',
                  coordinates: [school.longitude, school.latitude],
                },
                properties: school,
              })),
            }}
            onPress={(event) => {
              const feature = event.features[0];
              if (feature && feature.properties) {
                handleSchoolPress(feature.properties as unknown as School);
              }
            }}
          >
            <MapboxGL.CircleLayer
              id="schoolsLayer"
              style={{
                circleColor: '#7c3aed',
                circleRadius: 12,
                circleStrokeWidth: 2,
                circleStrokeColor: 'white',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {/* Header Overlay */}
      <SafeAreaView style={styles.headerOverlay} edges={['top']}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={ICON_SIZE.md} color={theme.colors.textSecondary} />
            <TextInput style={styles.searchInput} placeholder="Tìm kiếm địa điểm..." placeholderTextColor={theme.colors.textSecondary} />
            <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
              <Icon name="refresh" size={ICON_SIZE.md} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.layerSelector}>
          <TouchableOpacity style={[styles.layerButton, selectedDataLayer === 'airQuality' && styles.layerButtonActive]} onPress={() => setSelectedDataLayer('airQuality')}>
            <Icon name="air-filter" size={20} color={selectedDataLayer === 'airQuality' ? '#FFF' : theme.colors.text} />
            <Text style={[styles.layerButtonText, selectedDataLayer === 'airQuality' && styles.layerButtonTextActive]}>AQI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layerButton, selectedDataLayer === 'weather' && styles.layerButtonActive]} onPress={() => setSelectedDataLayer('weather')}>
            <Icon name="weather-cloudy" size={20} color={selectedDataLayer === 'weather' ? '#FFF' : theme.colors.text} />
            <Text style={[styles.layerButtonText, selectedDataLayer === 'weather' && styles.layerButtonTextActive]}>Thời tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.layerButton, selectedDataLayer === 'greenZones' && styles.layerButtonActive]} onPress={() => setSelectedDataLayer('greenZones')}>
            <Icon name="tree" size={20} color={selectedDataLayer === 'greenZones' ? '#FFF' : theme.colors.text} />
            <Text style={[styles.layerButtonText, selectedDataLayer === 'greenZones' && styles.layerButtonTextActive]}>Khu xanh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* FAB Container */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.iconLayerToggle} onPress={() => toggleIconLayer('schools')}>
          <Icon name="school" size={20} color={showIconLayers.schools ? '#7c3aed' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconLayerToggle} onPress={() => toggleIconLayer('greenZones')}>
          <Icon name="tree" size={20} color={showIconLayers.greenZones ? '#16a34a' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabButton} onPress={centerUserLocation}>
          <Icon name="crosshairs-gps" size={ICON_SIZE.lg} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Weather Quick Info */}
      {selectedDataLayer === 'weather' && weatherData && (
        <TouchableOpacity style={styles.weatherQuickInfo} onPress={handleWeatherPress} activeOpacity={0.9}>
          <Icon name="weather-cloudy" size={ICON_SIZE.lg} color={theme.colors.info} />
          <View style={{ flex: 1 }}>
            <Text style={styles.weatherQuickTemp}>{Math.round(weatherData.temperature)}°C</Text>
            <Text style={styles.weatherQuickDesc} numberOfLines={1}>{weatherData.weather?.description || weatherData.weather_description}</Text>
          </View>
          <Icon name="chevron-up" size={ICON_SIZE.md} color={theme.colors.textLight} />
        </TouchableOpacity>
      )}

      {/* Bottom Sheet */}
      {selectedDetail && (
        <>
          <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleCloseSheet} />
          </Animated.View>

          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.sheetHandle} />
            {renderDetailContent()}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SCREEN_PADDING.horizontal,
  },
  searchContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: hp('6%'),
    ...theme.shadows.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: theme.colors.text,
    height: '100%',
  },
  iconButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  layerSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    ...theme.shadows.sm,
  },
  layerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  layerButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  layerButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: theme.colors.text,
  },
  layerButtonTextActive: {
    color: theme.colors.white,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.select({ ios: hp('12%'), android: hp('10%') }),
    right: SCREEN_PADDING.horizontal,
    gap: SPACING.sm,
    alignItems: 'flex-end',
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  iconLayerToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  weatherQuickInfo: {
    position: 'absolute',
    bottom: Platform.select({ ios: hp('12%'), android: hp('10%') }),
    left: SCREEN_PADDING.horizontal,
    right: wp('20%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    ...theme.shadows.lg,
  },
  weatherQuickTemp: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  weatherQuickDesc: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    textTransform: 'capitalize',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.sm,
    paddingHorizontal: SCREEN_PADDING.horizontal,
    paddingBottom: Platform.select({ ios: SPACING['2xl'], android: SPACING.xl }),
    maxHeight: hp('70%'),
    ...theme.shadows.xl,
    zIndex: 101,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  sheetScroll: {
    maxHeight: hp('55%'),
  },
  sheetScrollContent: {
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  badgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailSection: {
    gap: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  detailText: {
    fontSize: FONT_SIZE.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailTextSmall: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  aqiLargeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  aqiLargeBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  aqiLargeValue: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  aqiLargeLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.white,
    fontWeight: '600',
  },
  aqiLargeStatus: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  aqiLargeDesc: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  pollutantItem: {
    flex: 1,
    minWidth: wp('20%'),
    backgroundColor: theme.colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  pollutantValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  pollutantLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  pollutantUnit: {
    fontSize: FONT_SIZE['2xs'],
    color: theme.colors.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
  },
  weatherLargeContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
  },
  weatherLargeTemp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  weatherLargeDesc: {
    fontSize: FONT_SIZE.lg,
    color: theme.colors.textLight,
    textTransform: 'capitalize',
    marginTop: SPACING.xs,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  sheetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  sheetButtonText: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default MapScreen;

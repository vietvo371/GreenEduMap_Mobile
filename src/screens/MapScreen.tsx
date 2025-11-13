/**
 * MapScreen - Environmental Monitoring Map
 * 
 * Main dashboard screen showing interactive map with:
 * - Air quality data (OpenAQ)
 * - Weather conditions (OpenWeather)
 * - Solar/energy data (NASA POWER)
 * - User's monitoring locations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';
import LoadingOverlay from '../component/LoadingOverlay';

interface Location {
  latitude: number;
  longitude: number;
}

interface AirQualityMarker {
  location: Location;
  aqi: number;
  pm25: number;
  status: string;
}

interface SchoolMarker {
  id: string;
  name: string;
  location: Location;
  district: string;
  students: number;
  type: 'primary' | 'secondary' | 'high';
}

interface TreeMarker {
  id: string;
  name: string;
  location: Location;
  district: string;
  treeCount: number;
  area: number; // m²
}

interface SolarMarker {
  id: string;
  name: string;
  location: Location;
  district: string;
  power: string; // e.g., "150kW"
  efficiency: number; // %
}

const DEFAULT_REGION: Region = {
  latitude: 16.068882, // Da Nang, Vietnam (default)
  longitude: 108.245350,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen: StackScreen<'Map'> = ({ navigation }) => {
  const { environmentalPreferences, aiInsights } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDataLayer, setSelectedDataLayer] = useState<'airQuality' | 'weather' | 'solar'>('airQuality');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  const [airQualityMarkers, setAirQualityMarkers] = useState<AirQualityMarker[]>([]);
  
  // Icon layers visibility
  const [showIconLayers, setShowIconLayers] = useState({
    schools: true,
    trees: true,
    solar: true,
  });

  // Mock data - Will be replaced with real API calls
  const currentAirQuality = {
    aqi: 85,
    status: 'Moderate',
    pm25: 35.2,
    location: 'Current Location',
  };

  const currentWeather = {
    temp: 28,
    humidity: 65,
    condition: 'Partly Cloudy',
    icon: 'weather-partly-cloudy',
  };

  // Mock Schools Data (Da Nang area)
  const mockSchools: SchoolMarker[] = [
    { id: '1', name: 'THPT Nguyễn Thị Minh Khai', location: { latitude: 16.0544, longitude: 108.2022 }, district: 'Hải Châu', students: 1200, type: 'high' },
    { id: '2', name: 'THCS Lê Quý Đôn', location: { latitude: 16.0678, longitude: 108.2183 }, district: 'Thanh Khê', students: 850, type: 'secondary' },
    { id: '3', name: 'TH Nguyễn Bỉnh Khiêm', location: { latitude: 16.0811, longitude: 108.2345 }, district: 'Sơn Trà', students: 650, type: 'primary' },
    { id: '4', name: 'THPT Trần Hưng Đạo', location: { latitude: 16.0456, longitude: 108.2567 }, district: 'Ngũ Hành Sơn', students: 1100, type: 'high' },
  ];

  // Mock Trees Data (Parks and green areas)
  const mockTrees: TreeMarker[] = [
    { id: '1', name: 'Công viên Biển Đông', location: { latitude: 16.0611, longitude: 108.2278 }, district: 'Sơn Trà', treeCount: 320, area: 15000 },
    { id: '2', name: 'Công viên Asia Park', location: { latitude: 16.0397, longitude: 108.2258 }, district: 'Hải Châu', treeCount: 250, area: 12000 },
    { id: '3', name: 'Vườn hoa Tây Bắc', location: { latitude: 16.0722, longitude: 108.2111 }, district: 'Thanh Khê', treeCount: 180, area: 8000 },
    { id: '4', name: 'Công viên 29/3', location: { latitude: 16.0544, longitude: 108.2389 }, district: 'Hải Châu', treeCount: 200, area: 10000 },
  ];

  // Mock Solar Data (Solar installations)
  const mockSolar: SolarMarker[] = [
    { id: '1', name: 'Trạm NLMT Hải Châu', location: { latitude: 16.0733, longitude: 108.2222 }, district: 'Hải Châu', power: '150kW', efficiency: 85 },
    { id: '2', name: 'Trạm NLMT Sơn Trà', location: { latitude: 16.0889, longitude: 108.2556 }, district: 'Sơn Trà', power: '200kW', efficiency: 88 },
    { id: '3', name: 'Trạm NLMT Thanh Khê', location: { latitude: 16.0622, longitude: 108.2044 }, district: 'Thanh Khê', power: '180kW', efficiency: 86 },
  ];

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#4CAF50'; // Good
    if (aqi <= 100) return '#FFEB3B'; // Moderate
    if (aqi <= 150) return '#FF9800'; // Unhealthy for sensitive
    if (aqi <= 200) return '#F44336'; // Unhealthy
    return '#9C27B0'; // Very unhealthy
  };

  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  // Convert hex color to rgba with alpha
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        return auth === 'granted';
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'GreenEduMap needs access to your location to show environmental data.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location on the map.',
          [{ text: 'OK' }]
        );
        return;
      }

      setLoading(true);
      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
          
          // Update map region
          const newRegion: Region = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setMapRegion(newRegion);
          
          // Animate map to location
          mapRef.current?.animateToRegion(newRegion, 1000);
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          Alert.alert(
            'Error',
            'Could not get your location. Please try again.',
            [{ text: 'OK' }]
          );
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Get location error:', error);
      setLoading(false);
    }
  };

  // Load air quality markers (mock data - replace with real API)
  useEffect(() => {
    // Mock air quality data for monitoring locations
    const mockMarkers: AirQualityMarker[] = environmentalPreferences.monitoringLocations.map((loc) => ({
      location: {
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
      aqi: Math.floor(Math.random() * 200) + 1,
      pm25: Math.random() * 100,
      status: 'Moderate',
    }));

    // Add current location marker if available
    if (currentLocation) {
      mockMarkers.push({
        location: currentLocation,
        aqi: currentAirQuality.aqi,
        pm25: currentAirQuality.pm25,
        status: currentAirQuality.status,
      });
    }

    setAirQualityMarkers(mockMarkers);
  }, [environmentalPreferences.monitoringLocations, currentLocation]);

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleLocationSearch = () => {
    navigation.navigate('LocationSearch');
  };

  const handleAddLocation = () => {
    navigation.navigate('AddMonitoringLocation');
  };

  const handleAirQualityDetail = (marker?: AirQualityMarker) => {
    const location = marker?.location || currentLocation || {
      latitude: 16.068882,
      longitude: 108.245350,
    };
    
    navigation.navigate('AirQualityDetail', {
      location: {
        ...location,
        name: 'Current Location',
      },
    });
  };

  const handleMarkerPress = (marker: AirQualityMarker) => {
    handleAirQualityDetail(marker);
  };

  const handleSchoolPress = (school: SchoolMarker) => {
    Alert.alert(
      school.name,
      `Quận: ${school.district}\nSố học sinh: ${school.students}\nLoại: ${school.type === 'high' ? 'THPT' : school.type === 'secondary' ? 'THCS' : 'Tiểu học'}`,
      [{ text: 'OK' }]
    );
  };

  const handleTreePress = (tree: TreeMarker) => {
    Alert.alert(
      tree.name,
      `Quận: ${tree.district}\nSố cây: ${tree.treeCount}\nDiện tích: ${tree.area}m²`,
      [{ text: 'OK' }]
    );
  };

  const handleSolarPress = (solar: SolarMarker) => {
    Alert.alert(
      solar.name,
      `Quận: ${solar.district}\nCông suất: ${solar.power}\nHiệu suất: ${solar.efficiency}%`,
      [{ text: 'OK' }]
    );
  };

  const handleMapLongPress = (e: any) => {
    // Long press to add new monitoring location
    const coordinate = e.nativeEvent.coordinate;
    Alert.alert(
      'Add Location',
      `Add monitoring location at ${coordinate.latitude.toFixed(4)}, ${coordinate.longitude.toFixed(4)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            // Navigate to add location screen with coordinates
            navigation.navigate('AddMonitoringLocation', {
              initialLocation: coordinate,
            });
          },
        },
      ]
    );
  };

  const toggleIconLayer = (layer: 'schools' | 'trees' | 'solar') => {
    setShowIconLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LoadingOverlay visible={loading} message="Loading environmental data..." />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>GreenEduMap</Text>
          <Text style={styles.headerSubtitle}>Environmental Monitoring</Text>
        </View>
        <TouchableOpacity onPress={handleLocationSearch} style={styles.searchButton}>
          <Icon name="magnify" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Interactive Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
            onLongPress={handleMapLongPress}
            mapType="standard"
          >
            {/* Air Quality Markers */}
            {selectedDataLayer === 'airQuality' && airQualityMarkers.map((marker, index) => (
              <React.Fragment key={index}>
                <Marker
                  coordinate={marker.location}
                  onPress={() => handleMarkerPress(marker)}
                  pinColor={getAQIColor(marker.aqi)}
                >
                  <View style={styles.customMarker}>
                    <View style={[styles.markerCircle, { backgroundColor: getAQIColor(marker.aqi) }]}>
                      <Text style={styles.markerText}>{marker.aqi}</Text>
                    </View>
                  </View>
                </Marker>
                {/* Air Quality Circle Overlay */}
                <Circle
                  center={marker.location}
                  radius={2000} // 2km radius
                  fillColor={hexToRgba(getAQIColor(marker.aqi), 0.25)}
                  strokeColor={getAQIColor(marker.aqi)}
                  strokeWidth={2}
                />
              </React.Fragment>
            ))}

            {/* Monitoring Locations Markers */}
            {environmentalPreferences.monitoringLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
                description={location.isPrimary ? 'Primary Location' : 'Monitoring Location'}
              >
                <View style={styles.locationMarker}>
                  <Icon
                    name={location.isPrimary ? 'map-marker-star' : 'map-marker'}
                    size={32}
                    color={location.isPrimary ? theme.colors.primary : theme.colors.secondary}
                  />
                </View>
              </Marker>
            ))}

            {/* Schools Markers */}
            {showIconLayers.schools && mockSchools.map((school) => (
              <Marker
                key={school.id}
                coordinate={school.location}
                onPress={() => handleSchoolPress(school)}
              >
                <View style={styles.iconMarker}>
                  <Icon name="school" size={28} color="#7c3aed" />
                </View>
              </Marker>
            ))}

            {/* Trees Markers */}
            {showIconLayers.trees && mockTrees.map((tree) => (
              <Marker
                key={tree.id}
                coordinate={tree.location}
                onPress={() => handleTreePress(tree)}
              >
                <View style={styles.iconMarker}>
                  <Icon name="tree" size={28} color="#16a34a" />
                </View>
              </Marker>
            ))}

            {/* Solar Markers */}
            {showIconLayers.solar && mockSolar.map((solar) => (
              <Marker
                key={solar.id}
                coordinate={solar.location}
                onPress={() => handleSolarPress(solar)}
              >
                <View style={styles.iconMarker}>
                  <Icon name="white-balance-sunny" size={28} color="#d97706" />
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Heatmap Layer Selector */}
          <View style={styles.layerSelector}>
            <TouchableOpacity
              style={[
                styles.layerButton,
                selectedDataLayer === 'airQuality' && styles.layerButtonActive,
              ]}
              onPress={() => setSelectedDataLayer('airQuality')}
            >
              <Icon
                name="air-filter"
                size={20}
                color={selectedDataLayer === 'airQuality' ? '#FFF' : theme.colors.text}
              />
              <Text
                style={[
                  styles.layerButtonText,
                  selectedDataLayer === 'airQuality' && styles.layerButtonTextActive,
                ]}
              >
                Air
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.layerButton,
                selectedDataLayer === 'weather' && styles.layerButtonActive,
              ]}
              onPress={() => setSelectedDataLayer('weather')}
            >
              <Icon
                name="weather-cloudy"
                size={20}
                color={selectedDataLayer === 'weather' ? '#FFF' : theme.colors.text}
              />
              <Text
                style={[
                  styles.layerButtonText,
                  selectedDataLayer === 'weather' && styles.layerButtonTextActive,
                ]}
              >
                Weather
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.layerButton,
                selectedDataLayer === 'solar' && styles.layerButtonActive,
              ]}
              onPress={() => setSelectedDataLayer('solar')}
            >
              <Icon
                name="weather-sunny"
                size={20}
                color={selectedDataLayer === 'solar' ? '#FFF' : theme.colors.text}
              />
              <Text
                style={[
                  styles.layerButtonText,
                  selectedDataLayer === 'solar' && styles.layerButtonTextActive,
                ]}
              >
                Solar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Icon Layers Toggle */}
          <View style={styles.iconLayerToggle}>
            <TouchableOpacity
              style={[styles.iconToggleButton, showIconLayers.schools && styles.iconToggleButtonActive]}
              onPress={() => toggleIconLayer('schools')}
            >
              <Icon name="school" size={20} color={showIconLayers.schools ? '#7c3aed' : '#999'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconToggleButton, showIconLayers.trees && styles.iconToggleButtonActive]}
              onPress={() => toggleIconLayer('trees')}
            >
              <Icon name="tree" size={20} color={showIconLayers.trees ? '#16a34a' : '#999'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconToggleButton, showIconLayers.solar && styles.iconToggleButtonActive]}
              onPress={() => toggleIconLayer('solar')}
            >
              <Icon name="white-balance-sunny" size={20} color={showIconLayers.solar ? '#d97706' : '#999'} />
            </TouchableOpacity>
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
          >
            <Icon name="crosshairs-gps" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Cards Section */}
        <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
          {/* Current Air Quality Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={handleAirQualityDetail}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Icon name="air-filter" size={24} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Air Quality</Text>
            <Icon name="chevron-right" size={24} color={theme.colors.textLight} />
          </View>

          <View style={styles.aqiContainer}>
            <View style={styles.aqiCircle}>
              <Text style={[styles.aqiNumber, { color: getAQIColor(currentAirQuality.aqi) }]}>
                {currentAirQuality.aqi}
              </Text>
              <Text style={styles.aqiLabel}>AQI</Text>
            </View>
            <View style={styles.aqiDetails}>
              <Text style={styles.aqiStatus}>{currentAirQuality.status}</Text>
              <Text style={styles.aqiLocation}>{currentAirQuality.location}</Text>
              <Text style={styles.aqiPM25}>PM2.5: {currentAirQuality.pm25} µg/m³</Text>
            </View>
          </View>

          <Text style={styles.dataSource}>Data: OpenAQ</Text>
        </TouchableOpacity>

        {/* Current Weather Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name={currentWeather.icon} size={24} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Weather</Text>
          </View>

          <View style={styles.weatherContainer}>
            <View style={styles.weatherMain}>
              <Text style={styles.weatherTemp}>{currentWeather.temp}°C</Text>
              <Text style={styles.weatherCondition}>{currentWeather.condition}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Icon name="water-percent" size={20} color={theme.colors.textLight} />
              <Text style={styles.weatherDetailText}>{currentWeather.humidity}%</Text>
            </View>
          </View>

          <Text style={styles.dataSource}>Data: OpenWeather</Text>
        </View>

        {/* AI Recommendations Preview */}
        {aiInsights && aiInsights.recommendedActions.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="lightbulb" size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>AI Recommendation</Text>
            </View>

            <Text style={styles.recommendationTitle}>
              {aiInsights.recommendedActions[0].title}
            </Text>
            <Text style={styles.recommendationDescription}>
              {aiInsights.recommendedActions[0].description}
            </Text>
            <Text style={styles.recommendationSavings}>
              Save {aiInsights.recommendedActions[0].potentialCarbonSavings} kg CO2
            </Text>
          </View>
        )}

        {/* Monitoring Locations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="map-marker-multiple" size={24} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>My Locations</Text>
            <TouchableOpacity onPress={handleAddLocation}>
              <Icon name="plus-circle" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {environmentalPreferences.monitoringLocations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No monitoring locations yet</Text>
              <TouchableOpacity
                style={styles.addLocationButton}
                onPress={handleAddLocation}
              >
                <Text style={styles.addLocationButtonText}>Add Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            environmentalPreferences.monitoringLocations.map((location) => (
              <View key={location.id} style={styles.locationItem}>
                <Icon
                  name={location.isPrimary ? 'map-marker-star' : 'map-marker'}
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.locationName}>{location.name}</Text>
              </View>
            ))
          )}
        </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
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
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 400,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardsContainer: {
    flex: 1,
  },
  iconLayerToggle: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 4,
  },
  iconToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconToggleButtonActive: {
    backgroundColor: '#F5F5F5',
  },
  layerSelector: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  layerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  layerButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  layerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  layerButtonTextActive: {
    color: '#FFF',
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  aqiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aqiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aqiNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  aqiLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  aqiDetails: {
    flex: 1,
  },
  aqiStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  aqiLocation: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  aqiPM25: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  dataSource: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherMain: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  weatherCondition: {
    fontSize: 16,
    color: theme.colors.textLight,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherDetailText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  recommendationSavings: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  locationName: {
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 12,
  },
  addLocationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  addLocationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  bottomPadding: {
    height: 20,
  },
});

export default MapScreen;


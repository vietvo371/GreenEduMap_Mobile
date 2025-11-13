/**
 * MapScreen - Environmental Monitoring Map
 * 
 * Main dashboard screen showing interactive map with:
 * - Air quality data (OpenAQ)
 * - Weather conditions (OpenWeather)
 * - Solar/energy data (NASA POWER)
 * - User's monitoring locations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';
import LoadingOverlay from '../component/LoadingOverlay';

const MapScreen: StackScreen<'Map'> = ({ navigation }) => {
  const { environmentalPreferences, aiInsights } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDataLayer, setSelectedDataLayer] = useState<'airQuality' | 'weather' | 'solar'>('airQuality');

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

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#4CAF50'; // Good
    if (aqi <= 100) return '#FFEB3B'; // Moderate
    if (aqi <= 150) return '#FF9800'; // Unhealthy for sensitive
    if (aqi <= 200) return '#F44336'; // Unhealthy
    return '#9C27B0'; // Very unhealthy
  };

  const handleLocationSearch = () => {
    navigation.navigate('LocationSearch');
  };

  const handleAddLocation = () => {
    navigation.navigate('AddMonitoringLocation');
  };

  const handleAirQualityDetail = () => {
    // TODO: Get current location
    navigation.navigate('AirQualityDetail', {
      location: {
        latitude: 16.068882,
        longitude: 108.245350,
        name: 'Current Location',
      },
    });
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Icon name="map-marker-radius" size={64} color={theme.colors.primary} />
            <Text style={styles.mapPlaceholderText}>
              Interactive Map
            </Text>
            <Text style={styles.mapPlaceholderSubtext}>
              OpenStreetMap + Environmental Overlays
            </Text>
            <Text style={styles.todoNote}>
              TODO: Integrate react-native-maps
            </Text>
          </View>

          {/* Layer Selector */}
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
        </View>

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
    height: 300,
    marginBottom: 16,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  todoNote: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 12,
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


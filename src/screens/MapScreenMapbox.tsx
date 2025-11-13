/**
 * MapScreen with Mapbox GL
 * Environmental Monitoring Map with Heatmap, Markers, and GeoJSON support
 * Based on @rnmapbox/maps examples
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mapbox, { 
  MapView, 
  Camera, 
  UserLocation, 
  ShapeSource, 
  HeatmapLayer,
  CircleLayer,
  SymbolLayer,
  MarkerView,
} from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';
import LoadingOverlay from '../component/LoadingOverlay';
import { DA_NANG_CENTER } from '../config/mapbox';
import type { Position } from 'geojson';

// Data layer types
type DataLayer = 'airQuality' | 'temperature' | 'solar';

interface IconLayers {
  schools: boolean;
  trees: boolean;
  solar: boolean;
}

// AQI Data
interface AQIData {
  id: string;
  coordinates: Position;
  aqi: number;
  pm25: number;
  status: string;
  name: string;
}

// School, Tree, Solar marker types
interface SchoolMarker {
  id: string;
  coordinates: Position;
  name: string;
  district: string;
  students: number;
  type: 'primary' | 'secondary' | 'high';
}

interface TreeMarker {
  id: string;
  coordinates: Position;
  name: string;
  district: string;
  treeCount: number;
  area: number;
}

interface SolarMarker {
  id: string;
  coordinates: Position;
  name: string;
  district: string;
  power: string;
  efficiency: number;
}

const MapScreenMapbox: React.FC<NativeStackScreenProps<any>> = ({ navigation }) => {
  const { environmentalPreferences } = useAuth();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [selectedDataLayer, setSelectedDataLayer] = useState<DataLayer>('airQuality');
  const [showIconLayers, setShowIconLayers] = useState<IconLayers>({
    schools: true,
    trees: true,
    solar: true,
  });
  const [cameraConfig, setCameraConfig] = useState({
    centerCoordinate: [DA_NANG_CENTER.longitude, DA_NANG_CENTER.latitude] as Position,
    zoomLevel: 12,
  });

  // Mock AQI Data (GeoJSON format)
  const mockAQIData: AQIData[] = [
    { id: '1', coordinates: [108.2022, 16.0544], aqi: 55, pm25: 18.5, status: 'Moderate', name: 'Hải Châu' },
    { id: '2', coordinates: [108.2194, 16.0675], aqi: 42, pm25: 12.3, status: 'Good', name: 'Thanh Khê' },
    { id: '3', coordinates: [108.2472, 16.0842], aqi: 78, pm25: 28.7, status: 'Moderate', name: 'Sơn Trà' },
    { id: '4', coordinates: [108.1558, 16.0244], aqi: 95, pm25: 35.2, status: 'Unhealthy', name: 'Liên Chiểu' },
    { id: '5', coordinates: [108.2294, 16.0397], aqi: 38, pm25: 10.8, status: 'Good', name: 'Cẩm Lệ' },
  ];

  // Convert to GeoJSON FeatureCollection
  const aqiGeoJSON = {
    type: 'FeatureCollection' as const,
    features: mockAQIData.map(data => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: data.coordinates,
      },
      properties: {
        id: data.id,
        aqi: data.aqi,
        pm25: data.pm25,
        status: data.status,
        name: data.name,
      },
    })),
  };

  // Mock Schools Data
  const mockSchools: SchoolMarker[] = [
    { id: 's1', coordinates: [108.2101, 16.0578], name: 'THPT Phan Châu Trinh', district: 'Hải Châu', students: 1200, type: 'high' },
    { id: 's2', coordinates: [108.2234, 16.0732], name: 'THPT Hoàng Hoa Thám', district: 'Thanh Khê', students: 980, type: 'high' },
    { id: 's3', coordinates: [108.2389, 16.0812], name: 'THCS Hoàng Hoa Thám', district: 'Sơn Trà', students: 650, type: 'secondary' },
  ];

  // Mock Trees Data
  const mockTrees: TreeMarker[] = [
    { id: 't1', coordinates: [108.2187, 16.0689], name: 'Công viên 29/3', district: 'Thanh Khê', treeCount: 450, area: 15000 },
    { id: 't2', coordinates: [108.2521, 16.0923], name: 'Công viên Biển Đông', district: 'Sơn Trà', treeCount: 780, area: 32000 },
  ];

  // Mock Solar Data
  const mockSolar: SolarMarker[] = [
    { id: 'sol1', coordinates: [108.2045, 16.0423], name: 'Trường THPT Phan Châu Trinh', district: 'Hải Châu', power: '150kW', efficiency: 87 },
    { id: 'sol2', coordinates: [108.2312, 16.0789], name: 'Bệnh viện Đà Nẵng', district: 'Thanh Khê', power: '280kW', efficiency: 91 },
  ];

  // Load Mapbox
  useEffect(() => {
    // Location manager will be started by UserLocation component
  }, []);

  // AQI Color helper
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#22c55e'; // Good - Green
    if (aqi <= 100) return '#eab308'; // Moderate - Yellow
    if (aqi <= 150) return '#f97316'; // Unhealthy for Sensitive - Orange
    if (aqi <= 200) return '#ef4444'; // Unhealthy - Red
    if (aqi <= 300) return '#a855f7'; // Very Unhealthy - Purple
    return '#881337'; // Hazardous - Maroon
  };

  // Recenter camera to user location
  const handleRecenterCamera = () => {
    setCameraConfig({
      centerCoordinate: [DA_NANG_CENTER.longitude, DA_NANG_CENTER.latitude],
      zoomLevel: 12,
    });
  };

  // Toggle icon layer
  const toggleIconLayer = (layer: keyof IconLayers) => {
    setShowIconLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  // Handle marker press
  const handleMarkerPress = (data: AQIData) => {
    Alert.alert(
      data.name,
      `AQI: ${data.aqi}\nPM2.5: ${data.pm25} μg/m³\nStatus: ${data.status}`,
      [{ text: 'OK' }]
    );
  };

  const handleSchoolPress = (school: SchoolMarker) => {
    const typeLabel = school.type === 'high' ? 'THPT' : school.type === 'secondary' ? 'THCS' : 'Tiểu học';
    Alert.alert(
      school.name,
      `Quận: ${school.district}\nSố học sinh: ${school.students.toLocaleString('vi-VN')}\nLoại: ${typeLabel}`,
      [{ text: 'Đóng' }]
    );
  };

  const handleTreePress = (tree: TreeMarker) => {
    Alert.alert(
      tree.name,
      `Quận: ${tree.district}\nSố cây: ${tree.treeCount.toLocaleString('vi-VN')}\nDiện tích: ${tree.area.toLocaleString('vi-VN')}m²`,
      [{ text: 'Đóng' }]
    );
  };

  const handleSolarPress = (solar: SolarMarker) => {
    Alert.alert(
      solar.name,
      `Quận: ${solar.district}\nCông suất: ${solar.power}\nHiệu suất: ${solar.efficiency}%`,
      [{ text: 'Đóng' }]
    );
  };

  // Get average AQI for header display
  const getAverageAQI = () => {
    const total = mockAQIData.reduce((sum, item) => sum + item.aqi, 0);
    return Math.round(total / mockAQIData.length);
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { text: 'Tốt', color: '#22c55e', icon: 'emoticon-happy' };
    if (aqi <= 100) return { text: 'Trung bình', color: '#eab308', icon: 'emoticon-neutral' };
    if (aqi <= 150) return { text: 'Kém', color: '#f97316', icon: 'emoticon-sad' };
    if (aqi <= 200) return { text: 'Xấu', color: '#ef4444', icon: 'emoticon-frown' };
    return { text: 'Nguy hiểm', color: '#a855f7', icon: 'emoticon-dead' };
  };

  const averageAQI = getAverageAQI();
  const aqiStatus = getAQIStatus(averageAQI);

  return (
    <View style={styles.container}>
      {/* Map View - Full Screen */}
      <MapView
        ref={mapRef}
        style={styles.map}
        styleURL={Mapbox.StyleURL.Light}
      >
        {/* Camera */}
        <Camera
          centerCoordinate={cameraConfig.centerCoordinate}
          zoomLevel={cameraConfig.zoomLevel}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* User Location */}
        <UserLocation 
          visible={true}
          showsUserHeadingIndicator={true}
        />

        {/* Air Quality Heatmap Layer */}
        {selectedDataLayer === 'airQuality' && (
          <ShapeSource 
            key="aqiSource"
            id="aqiSource" 
            shape={aqiGeoJSON}
          >
            <HeatmapLayer
              id="aqiHeatmap"
              sourceID="aqiSource"
              maxZoomLevel={15}
              style={{
                heatmapWeight: [
                  'interpolate',
                  ['linear'],
                  ['get', 'aqi'],
                  0, 0,
                  50, 0.3,
                  100, 0.6,
                  150, 0.9,
                  200, 1,
                ],
                heatmapColor: [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(34, 197, 94, 0)', // Good - Green
                  0.2, 'rgba(34, 197, 94, 0.5)',
                  0.4, 'rgba(234, 179, 8, 0.7)', // Moderate - Yellow
                  0.6, 'rgba(249, 115, 22, 0.8)', // Orange
                  0.8, 'rgba(239, 68, 68, 0.9)', // Red
                  1, 'rgba(168, 85, 247, 1)', // Purple
                ],
                heatmapRadius: 50,
                heatmapOpacity: 0.8,
              }}
            />
            
            {/* Circles for tap interaction */}
            <CircleLayer
              id="aqiCircles"
              sourceID="aqiSource"
              style={{
                circleRadius: [
                  'interpolate',
                  ['linear'],
                  ['get', 'aqi'],
                  0, 5,
                  200, 30,
                ],
                circleColor: [
                  'interpolate',
                  ['linear'],
                  ['get', 'aqi'],
                  0, '#22c55e',
                  50, '#22c55e',
                  100, '#eab308',
                  150, '#f97316',
                  200, '#ef4444',
                  300, '#a855f7',
                ],
                circleOpacity: 0.3,
                circleStrokeWidth: 2,
                circleStrokeColor: '#fff',
              }}
            />
          </ShapeSource>
        )}

        {/* Schools Markers */}
        {showIconLayers.schools && mockSchools.map((school) => (
          <MarkerView
            key={school.id}
            id={school.id}
            coordinate={school.coordinates}
          >
            <Pressable
              style={styles.iconMarker}
              onPress={() => handleSchoolPress(school)}
            >
              <Icon name="school" size={28} color="#7c3aed" />
            </Pressable>
          </MarkerView>
        ))}

        {/* Trees Markers */}
        {showIconLayers.trees && mockTrees.map((tree) => (
          <MarkerView
            key={tree.id}
            id={tree.id}
            coordinate={tree.coordinates}
          >
            <Pressable
              style={styles.iconMarker}
              onPress={() => handleTreePress(tree)}
            >
              <Icon name="tree" size={28} color="#22c55e" />
            </Pressable>
          </MarkerView>
        ))}

        {/* Solar Markers */}
        {showIconLayers.solar && mockSolar.map((solar) => (
          <MarkerView
            key={solar.id}
            id={solar.id}
            coordinate={solar.coordinates}
          >
            <Pressable
              style={styles.iconMarker}
              onPress={() => handleSolarPress(solar)}
            >
              <Icon name="solar-panel" size={28} color="#f59e0b" />
            </Pressable>
          </MarkerView>
        ))}

        {/* Monitoring Locations from User Preferences */}
        {environmentalPreferences?.monitoringLocations?.map((location) => (
          <MarkerView
            key={location.id}
            id={location.id}
            coordinate={[location.longitude, location.latitude]}
          >
            <View style={styles.locationMarker}>
              <Icon
                name={location.isPrimary ? 'map-marker-star' : 'map-marker'}
                size={40}
                color={location.isPrimary ? theme.colors.primary : theme.colors.secondary}
              />
            </View>
          </MarkerView>
        ))}
      </MapView>

      {/* AQI Status Header */}
      {selectedDataLayer === 'airQuality' && (
        <View style={[styles.aqiHeader, { top: insets.top + 16 }]}>
          <View style={[styles.aqiIndicator, { backgroundColor: aqiStatus.color }]}>
            <Icon name={aqiStatus.icon} size={20} color="#fff" />
            <Text style={styles.aqiValue}>{averageAQI}</Text>
          </View>
          <View style={styles.aqiInfo}>
            <Text style={styles.aqiStatusText}>{aqiStatus.text}</Text>
            <Text style={styles.aqiLabel}>Chất lượng không khí</Text>
          </View>
        </View>
      )}

      {/* Data Layer Selector */}
      <View style={[styles.dataLayerSelector, { top: insets.top + 80 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {([
            { key: 'airQuality', icon: 'air-filter', label: 'Không khí' },
            { key: 'temperature', icon: 'thermometer', label: 'Nhiệt độ' },
            { key: 'solar', icon: 'solar-power', label: 'Năng lượng' },
          ] as Array<{ key: DataLayer; icon: string; label: string }>).map((layer) => (
            <TouchableOpacity
              key={layer.key}
              style={[
                styles.dataLayerButton,
                selectedDataLayer === layer.key && styles.dataLayerButtonActive,
              ]}
              onPress={() => setSelectedDataLayer(layer.key)}
            >
              <Icon
                name={layer.icon}
                size={20}
                color={selectedDataLayer === layer.key ? '#fff' : theme.colors.textDark}
              />
              <Text
                style={[
                  styles.dataLayerText,
                  selectedDataLayer === layer.key && styles.dataLayerTextActive,
                ]}
              >
                {layer.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Icon Layer Toggles */}
      <View style={[styles.iconLayerToggle, { top: insets.top + 144 }]}>
        {(Object.keys(showIconLayers) as Array<keyof IconLayers>).map((layer) => (
          <TouchableOpacity
            key={layer}
            style={[
              styles.iconToggleButton,
              showIconLayers[layer] && styles.iconToggleButtonActive,
            ]}
            onPress={() => toggleIconLayer(layer)}
          >
            <Icon
              name={
                layer === 'schools' ? 'school' :
                layer === 'trees' ? 'tree' : 'solar-panel'
              }
              size={20}
              color={showIconLayers[layer] ? '#fff' : theme.colors.textDark}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recenter Button */}
      <TouchableOpacity
        style={[styles.currentLocationButton, { bottom: insets.bottom + 100 }]}
        onPress={handleRecenterCamera}
      >
        <Icon name="crosshairs-gps" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* AQI Legend (show only when air quality layer is selected) */}
      {selectedDataLayer === 'airQuality' && (
        <View style={[styles.legend, { bottom: insets.bottom + 120 }]}>
          <Text style={styles.legendTitle}>Chỉ số AQI</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.legendText}>Tốt (0-50)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#eab308' }]} />
              <Text style={styles.legendText}>Trung bình (51-100)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f97316' }]} />
              <Text style={styles.legendText}>Kém (101-150)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Xấu (151-200)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#a855f7' }]} />
              <Text style={styles.legendText}>Nguy hiểm (200+)</Text>
            </View>
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay visible={loading} />}
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
  aqiHeader: {
    position: 'absolute',
    // top will be set dynamically with insets
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    ...theme.shadows.md,
    gap: 10,
  },
  aqiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  aqiValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  aqiInfo: {
    gap: 2,
  },
  aqiStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  aqiLabel: {
    fontSize: 11,
    color: theme.colors.textDarkLight,
  },
  dataLayerSelector: {
    position: 'absolute',
    // top will be set dynamically with insets
    left: 16,
    right: 16,
  },
  dataLayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    ...theme.shadows.sm,
  },
  dataLayerButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  dataLayerText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  dataLayerTextActive: {
    color: '#fff',
  },
  iconLayerToggle: {
    position: 'absolute',
    // top will be set dynamically with insets
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    ...theme.shadows.md,
  },
  iconToggleButton: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  iconToggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  currentLocationButton: {
    position: 'absolute',
    // bottom will be set dynamically with insets
    right: 16,
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  iconMarker: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
    ...theme.shadows.md,
  },
  locationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  legend: {
    position: 'absolute',
    // bottom will be set dynamically with insets
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    ...theme.shadows.md,
    maxWidth: 220,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 8,
  },
  legendItems: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textDarkLight,
  },
});

export default MapScreenMapbox;

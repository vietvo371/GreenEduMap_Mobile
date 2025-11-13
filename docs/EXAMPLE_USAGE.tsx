/**
 * GreenEduMap - Example Usage of AuthContext
 * 
 * File này chứa các ví dụ về cách sử dụng AuthContext
 * trong các screen khác nhau của ứng dụng GreenEduMap.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ============================================================================
// EXAMPLE 1: Environmental Dashboard Screen
// ============================================================================

export const EnvironmentalDashboardScreen = () => {
  const { environmentalImpact, loadEnvironmentalImpact } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await loadEnvironmentalImpact();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌍 Your Environmental Impact</Text>

      {/* Carbon Footprint Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carbon Saved</Text>
        <Text style={styles.bigNumber}>
          {environmentalImpact?.totalCarbonSaved.toFixed(1)} kg
        </Text>
        <Text style={styles.subtitle}>Total CO2 prevented</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {environmentalImpact?.monthlyCarbon.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {environmentalImpact?.dailyCarbon.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>
      </View>

      {/* Actions & Achievements Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Your Achievements</Text>
        
        <View style={styles.achievementRow}>
          <View style={styles.achievementItem}>
            <Icon name="leaf" size={32} color="#4CAF50" />
            <Text style={styles.achievementValue}>
              {environmentalImpact?.totalActionsCount}
            </Text>
            <Text style={styles.achievementLabel}>Green Actions</Text>
          </View>

          <View style={styles.achievementItem}>
            <Icon name="fire" size={32} color="#FF9800" />
            <Text style={styles.achievementValue}>
              {environmentalImpact?.currentStreak}
            </Text>
            <Text style={styles.achievementLabel}>Day Streak</Text>
          </View>

          <View style={styles.achievementItem}>
            <Icon name="trophy" size={32} color="#FFD700" />
            <Text style={styles.achievementValue}>
              #{environmentalImpact?.communityRank}
            </Text>
            <Text style={styles.achievementLabel}>Community Rank</Text>
          </View>
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏆 Badges</Text>
        <View style={styles.badgesContainer}>
          {environmentalImpact?.badges.length === 0 ? (
            <Text style={styles.emptyText}>
              Complete green actions to earn badges!
            </Text>
          ) : (
            environmentalImpact?.badges.map((badge) => (
              <View key={badge.id} style={styles.badge}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Recent Actions Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📜 Recent Green Actions</Text>
        {environmentalImpact?.completedActions.slice(0, 5).map((action) => (
          <View key={action.id} style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Icon name={getActionIcon(action.type)} size={24} color="#4CAF50" />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
              <Text style={styles.actionCarbon}>
                💚 {action.carbonSaved} kg CO2 saved
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// ============================================================================
// EXAMPLE 2: Add Green Action Screen
// ============================================================================

export const AddGreenActionScreen = () => {
  const { addGreenAction, environmentalImpact } = useAuth();
  const [loading, setLoading] = useState(false);

  const greenActionTemplates = [
    {
      type: 'transport' as const,
      title: 'Used Public Transport',
      description: 'Took bus/metro instead of driving',
      carbonSaved: 2.3,
      icon: 'bus',
    },
    {
      type: 'transport' as const,
      title: 'Biked to Work',
      description: 'Cycled instead of driving',
      carbonSaved: 3.5,
      icon: 'bike',
    },
    {
      type: 'energy' as const,
      title: 'Turned Off Lights',
      description: 'Remembered to turn off unused lights',
      carbonSaved: 0.5,
      icon: 'lightbulb-off',
    },
    {
      type: 'waste' as const,
      title: 'Recycled Waste',
      description: 'Sorted and recycled household waste',
      carbonSaved: 1.2,
      icon: 'recycle',
    },
    {
      type: 'water' as const,
      title: 'Saved Water',
      description: 'Took shorter shower, fixed leaks',
      carbonSaved: 0.8,
      icon: 'water',
    },
    {
      type: 'food' as const,
      title: 'Vegetarian Meal',
      description: 'Ate plant-based meal instead of meat',
      carbonSaved: 2.0,
      icon: 'food-apple',
    },
  ];

  const handleAddAction = async (template: typeof greenActionTemplates[0]) => {
    setLoading(true);
    try {
      await addGreenAction({
        type: template.type,
        title: template.title,
        description: template.description,
        carbonSaved: template.carbonSaved,
        verificationMethod: 'self',
      });

      Alert.alert(
        '🎉 Great Job!',
        `You saved ${template.carbonSaved} kg CO2!\n\nTotal saved: ${(
          environmentalImpact?.totalCarbonSaved || 0
        ).toFixed(1)} kg`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save green action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌱 Log Your Green Action</Text>
      <Text style={styles.subtitle}>
        Track your eco-friendly activities and see your impact!
      </Text>

      <View style={styles.actionsGrid}>
        {greenActionTemplates.map((template, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionTemplate}
            onPress={() => handleAddAction(template)}
            disabled={loading}
          >
            <Icon name={template.icon} size={40} color="#4CAF50" />
            <Text style={styles.templateTitle}>{template.title}</Text>
            <Text style={styles.templateDescription}>{template.description}</Text>
            <Text style={styles.templateCarbon}>
              💚 {template.carbonSaved} kg CO2
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={styles.loader}
        />
      )}
    </ScrollView>
  );
};

// ============================================================================
// EXAMPLE 3: Environmental Settings Screen
// ============================================================================

export const EnvironmentalSettingsScreen = () => {
  const { environmentalPreferences, updateEnvironmentalPreferences } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleToggleAirQualityAlerts = async () => {
    setSaving(true);
    try {
      await updateEnvironmentalPreferences({
        airQualityAlerts: !environmentalPreferences.airQualityAlerts,
      });
      Alert.alert('Success', 'Settings updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleWeatherAlerts = async () => {
    setSaving(true);
    try {
      await updateEnvironmentalPreferences({
        weatherAlerts: !environmentalPreferences.weatherAlerts,
      });
      Alert.alert('Success', 'Settings updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeTemperatureUnit = async (unit: 'celsius' | 'fahrenheit') => {
    setSaving(true);
    try {
      await updateEnvironmentalPreferences({
        temperatureUnit: unit,
      });
      Alert.alert('Success', 'Temperature unit changed!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Environmental Settings</Text>

      {/* Alerts Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔔 Alerts & Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Air Quality Alerts</Text>
            <Text style={styles.settingDescription}>
              Get notified when air quality is poor
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleToggleAirQualityAlerts}
            disabled={saving}
          >
            <Icon
              name={
                environmentalPreferences.airQualityAlerts
                  ? 'toggle-switch'
                  : 'toggle-switch-off'
              }
              size={48}
              color={
                environmentalPreferences.airQualityAlerts ? '#4CAF50' : '#CCC'
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Weather Alerts</Text>
            <Text style={styles.settingDescription}>
              Get weather warnings and forecasts
            </Text>
          </View>
          <TouchableOpacity onPress={handleToggleWeatherAlerts} disabled={saving}>
            <Icon
              name={
                environmentalPreferences.weatherAlerts
                  ? 'toggle-switch'
                  : 'toggle-switch-off'
              }
              size={48}
              color={
                environmentalPreferences.weatherAlerts ? '#4CAF50' : '#CCC'
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Temperature Unit Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌡️ Temperature Unit</Text>

        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              environmentalPreferences.temperatureUnit === 'celsius' &&
                styles.optionButtonActive,
            ]}
            onPress={() => handleChangeTemperatureUnit('celsius')}
            disabled={saving}
          >
            <Text
              style={[
                styles.optionText,
                environmentalPreferences.temperatureUnit === 'celsius' &&
                  styles.optionTextActive,
              ]}
            >
              Celsius (°C)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              environmentalPreferences.temperatureUnit === 'fahrenheit' &&
                styles.optionButtonActive,
            ]}
            onPress={() => handleChangeTemperatureUnit('fahrenheit')}
            disabled={saving}
          >
            <Text
              style={[
                styles.optionText,
                environmentalPreferences.temperatureUnit === 'fahrenheit' &&
                  styles.optionTextActive,
              ]}
            >
              Fahrenheit (°F)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Sources Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Data Sources</Text>

        <View style={styles.dataSourceItem}>
          <Icon name="weather-cloudy" size={24} color="#4CAF50" />
          <Text style={styles.dataSourceLabel}>OpenWeather</Text>
          <Icon
            name={
              environmentalPreferences.enabledDataSources.openWeather
                ? 'check-circle'
                : 'close-circle'
            }
            size={24}
            color={
              environmentalPreferences.enabledDataSources.openWeather
                ? '#4CAF50'
                : '#CCC'
            }
          />
        </View>

        <View style={styles.dataSourceItem}>
          <Icon name="air-filter" size={24} color="#4CAF50" />
          <Text style={styles.dataSourceLabel}>OpenAQ</Text>
          <Icon
            name={
              environmentalPreferences.enabledDataSources.openAQ
                ? 'check-circle'
                : 'close-circle'
            }
            size={24}
            color={
              environmentalPreferences.enabledDataSources.openAQ
                ? '#4CAF50'
                : '#CCC'
            }
          />
        </View>

        <View style={styles.dataSourceItem}>
          <Icon name="solar-power" size={24} color="#4CAF50" />
          <Text style={styles.dataSourceLabel}>NASA POWER</Text>
          <Icon
            name={
              environmentalPreferences.enabledDataSources.nasaPower
                ? 'check-circle'
                : 'close-circle'
            }
            size={24}
            color={
              environmentalPreferences.enabledDataSources.nasaPower
                ? '#4CAF50'
                : '#CCC'
            }
          />
        </View>

        <View style={styles.dataSourceItem}>
          <Icon name="map" size={24} color="#4CAF50" />
          <Text style={styles.dataSourceLabel}>OpenStreetMap</Text>
          <Icon
            name={
              environmentalPreferences.enabledDataSources.openStreetMap
                ? 'check-circle'
                : 'close-circle'
            }
            size={24}
            color={
              environmentalPreferences.enabledDataSources.openStreetMap
                ? '#4CAF50'
                : '#CCC'
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

// ============================================================================
// EXAMPLE 4: AI Recommendations Screen
// ============================================================================

export const AIRecommendationsScreen = () => {
  const { aiInsights, refreshAIInsights } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAIInsights();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Recommendations</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <Icon
            name="refresh"
            size={28}
            color="#4CAF50"
            style={{ transform: [{ rotate: refreshing ? '360deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Recommended Actions */}
      <Text style={styles.sectionTitle}>Suggested Actions</Text>
      {aiInsights?.recommendedActions.map((action) => (
        <View key={action.id} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationTitle}>{action.title}</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(action.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>{action.difficulty}</Text>
            </View>
          </View>
          <Text style={styles.recommendationDescription}>
            {action.description}
          </Text>
          <Text style={styles.carbonSavings}>
            💚 Potential savings: {action.potentialCarbonSavings} kg CO2
          </Text>
        </View>
      ))}

      {/* Local Trends */}
      <Text style={styles.sectionTitle}>Local Environmental Trends</Text>
      <View style={styles.trendCard}>
        <View style={styles.trendItem}>
          <Icon name="air-filter" size={24} color="#4CAF50" />
          <Text style={styles.trendLabel}>Air Quality</Text>
          <Text style={styles.trendValue}>
            {aiInsights?.localTrends.airQualityTrend}
          </Text>
        </View>

        <View style={styles.trendItem}>
          <Icon name="weather-partly-cloudy" size={24} color="#4CAF50" />
          <Text style={styles.trendLabel}>Weather</Text>
          <Text style={styles.trendValue}>
            {aiInsights?.localTrends.weatherPattern}
          </Text>
        </View>

        <View style={styles.trendItem}>
          <Icon name="alert" size={24} color={getRiskColor(aiInsights?.localTrends.environmentalRisk)} />
          <Text style={styles.trendLabel}>Risk Level</Text>
          <Text style={styles.trendValue}>
            {aiInsights?.localTrends.environmentalRisk}
          </Text>
        </View>
      </View>

      {/* Community Highlights */}
      <Text style={styles.sectionTitle}>Community Updates</Text>
      {aiInsights?.communityHighlights.map((highlight, index) => (
        <View key={index} style={styles.highlightCard}>
          <Icon
            name={getHighlightIcon(highlight.type)}
            size={24}
            color="#4CAF50"
          />
          <Text style={styles.highlightMessage}>{highlight.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getActionIcon = (type: string): string => {
  const icons: Record<string, string> = {
    transport: 'car',
    energy: 'lightning-bolt',
    waste: 'recycle',
    water: 'water',
    food: 'food',
    education: 'book',
    community: 'account-group',
  };
  return icons[type] || 'leaf';
};

const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
  };
  return colors[difficulty] || '#CCC';
};

const getRiskColor = (risk?: string): string => {
  const colors: Record<string, string> = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
  };
  return colors[risk || 'low'] || '#CCC';
};

const getHighlightIcon = (type: string): string => {
  const icons: Record<string, string> = {
    achievement: 'trophy',
    alert: 'alert',
    tip: 'lightbulb',
  };
  return icons[type] || 'information';
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievementRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  achievementLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    alignItems: 'center',
    padding: 8,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionDetails: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionCarbon: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionTemplate: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  templateCarbon: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#4CAF50',
  },
  dataSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dataSourceLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  carbonSavings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  trendCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  trendLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  trendValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  highlightCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightMessage: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
});


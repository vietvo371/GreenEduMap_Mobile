/**
 * ActionsScreen - Green Actions Tracking
 * 
 * Track and log eco-friendly activities:
 * - Transport (public transit, bike, walk)
 * - Energy (renewable, efficiency)
 * - Waste (recycling, reduction)
 * - Water (conservation)
 * - Food (plant-based, local)
 * - Education & Community
 */

import React, { useState } from 'react';
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

// Action categories with icons and colors
const ACTION_CATEGORIES = [
  {
    type: 'transport',
    label: 'Transport',
    icon: 'bus',
    color: '#2196F3',
    examples: ['Public transit', 'Bike', 'Walk', 'Carpool'],
  },
  {
    type: 'energy',
    label: 'Energy',
    icon: 'lightning-bolt',
    color: '#FF9800',
    examples: ['Solar power', 'Turn off lights', 'Energy efficient'],
  },
  {
    type: 'waste',
    label: 'Waste',
    icon: 'recycle',
    color: '#4CAF50',
    examples: ['Recycle', 'Compost', 'Zero waste', 'Reduce plastic'],
  },
  {
    type: 'water',
    label: 'Water',
    icon: 'water',
    color: '#00BCD4',
    examples: ['Save water', 'Fix leaks', 'Rainwater collection'],
  },
  {
    type: 'food',
    label: 'Food',
    icon: 'food-apple',
    color: '#8BC34A',
    examples: ['Plant-based', 'Local food', 'Reduce waste'],
  },
  {
    type: 'education',
    label: 'Education',
    icon: 'book',
    color: '#9C27B0',
    examples: ['Learn', 'Share knowledge', 'Attend workshops'],
  },
  {
    type: 'community',
    label: 'Community',
    icon: 'account-group',
    color: '#E91E63',
    examples: ['Plant trees', 'Clean up', 'Volunteer'],
  },
];

const ActionsScreen: StackScreen<'Actions'> = ({ navigation }) => {
  const { environmentalImpact, addGreenAction } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddAction = () => {
    navigation.navigate('AddGreenAction');
  };

  const handleViewHistory = () => {
    navigation.navigate('ActionHistory');
  };

  const handleCommunityActions = () => {
    navigation.navigate('CommunityActions');
  };

  const handleCategoryPress = async (category: typeof ACTION_CATEGORIES[0]) => {
    // Quick add action with default values
    Alert.alert(
      `Add ${category.label} Action`,
      `Select a ${category.label.toLowerCase()} action to log:`,
      [
        ...category.examples.map((example) => ({
          text: example,
          onPress: async () => {
            try {
              setLoading(true);
              await addGreenAction({
                type: category.type as any,
                title: example,
                description: `Completed ${example.toLowerCase()} action`,
                carbonSaved: Math.random() * 3 + 0.5, // Random 0.5-3.5kg
              });
              Alert.alert('Success!', `${example} action logged!`);
            } catch (error) {
              Alert.alert('Error', 'Failed to log action');
            } finally {
              setLoading(false);
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getActionTypeIcon = (type: string): string => {
    const category = ACTION_CATEGORIES.find((c) => c.type === type);
    return category?.icon || 'leaf';
  };

  const getActionTypeColor = (type: string): string => {
    const category = ACTION_CATEGORIES.find((c) => c.type === type);
    return category?.color || theme.colors.primary;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Green Actions</Text>
          <Text style={styles.headerSubtitle}>Track Your Impact</Text>
        </View>
        <TouchableOpacity onPress={handleAddAction} style={styles.addButton}>
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Impact Summary Card */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <Icon name="chart-line" size={24} color={theme.colors.primary} />
            <Text style={styles.impactTitle}>Your Impact</Text>
          </View>

          <View style={styles.impactStats}>
            <View style={styles.impactStatMain}>
              <Text style={styles.impactStatValue}>
                {environmentalImpact?.totalCarbonSaved.toFixed(1) || 0}
              </Text>
              <Text style={styles.impactStatUnit}>kg CO₂</Text>
              <Text style={styles.impactStatLabel}>Total Saved</Text>
            </View>

            <View style={styles.impactStatsSide}>
              <View style={styles.impactStatSmall}>
                <Icon name="calendar-today" size={16} color={theme.colors.textLight} />
                <Text style={styles.impactStatSmallValue}>
                  {environmentalImpact?.dailyCarbon.toFixed(1) || 0} kg
                </Text>
                <Text style={styles.impactStatSmallLabel}>Today</Text>
              </View>

              <View style={styles.impactStatSmall}>
                <Icon name="fire" size={16} color="#FF9800" />
                <Text style={styles.impactStatSmallValue}>
                  {environmentalImpact?.currentStreak || 0} days
                </Text>
                <Text style={styles.impactStatSmallLabel}>Streak</Text>
              </View>

              <View style={styles.impactStatSmall}>
                <Icon name="check-circle" size={16} color={theme.colors.primary} />
                <Text style={styles.impactStatSmallValue}>
                  {environmentalImpact?.totalActionsCount || 0}
                </Text>
                <Text style={styles.impactStatSmallLabel}>Actions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleViewHistory}
          >
            <Icon name="history" size={20} color={theme.colors.primary} />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleCommunityActions}
          >
            <Icon name="account-group" size={20} color={theme.colors.primary} />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
        </View>

        {/* Action Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Log an Action</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a category to quickly log your green action
          </Text>

          <View style={styles.categoriesGrid}>
            {ACTION_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.type}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <Icon name={category.icon} size={32} color={category.color} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Actions */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Actions</Text>
            <TouchableOpacity onPress={handleViewHistory}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {!environmentalImpact ||
          environmentalImpact.completedActions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="leaf-off" size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyStateText}>No actions logged yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your green actions to see your environmental impact!
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleAddAction}
              >
                <Text style={styles.emptyStateButtonText}>Log Your First Action</Text>
              </TouchableOpacity>
            </View>
          ) : (
            environmentalImpact.completedActions
              .slice(0, 5)
              .map((action) => (
                <View key={action.id} style={styles.actionItem}>
                  <View
                    style={[
                      styles.actionItemIcon,
                      { backgroundColor: getActionTypeColor(action.type) + '20' },
                    ]}
                  >
                    <Icon
                      name={getActionTypeIcon(action.type)}
                      size={20}
                      color={getActionTypeColor(action.type)}
                    />
                  </View>

                  <View style={styles.actionItemInfo}>
                    <Text style={styles.actionItemTitle}>{action.title}</Text>
                    <Text style={styles.actionItemDescription}>
                      {action.description}
                    </Text>
                    <Text style={styles.actionItemCarbon}>
                      {action.carbonSaved} kg CO₂ saved
                    </Text>
                  </View>
                </View>
              ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={handleAddAction}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  impactCard: {
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
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  impactStats: {
    flexDirection: 'row',
    gap: 16,
  },
  impactStatMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  impactStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  impactStatUnit: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  impactStatLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  impactStatsSide: {
    gap: 8,
  },
  impactStatSmall: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  impactStatSmallValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  impactStatSmallLabel: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionItemInfo: {
    flex: 1,
  },
  actionItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  actionItemDescription: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  actionItemCarbon: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomPadding: {
    height: 100,
  },
});

export default ActionsScreen;


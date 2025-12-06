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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme, SPACING, FONT_SIZE, BORDER_RADIUS, ICON_SIZE } from '../theme';

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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
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
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  addButton: {
    width: ICON_SIZE.xl,
    height: ICON_SIZE.xl,
    borderRadius: ICON_SIZE.xl / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  impactCard: {
    backgroundColor: theme.colors.white,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...theme.shadows.sm,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  impactTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  impactStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  impactStatMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: '#E8F5E9',
    borderRadius: BORDER_RADIUS.md,
  },
  impactStatValue: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily,
  },
  impactStatUnit: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.primary,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  impactStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
    marginTop: 4,
    fontFamily: theme.typography.fontFamily,
  },
  impactStatsSide: {
    gap: SPACING.xs,
  },
  impactStatSmall: {
    backgroundColor: theme.colors.background,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  impactStatSmallValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  impactStatSmallLabel: {
    fontSize: FONT_SIZE['2xs'],
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.xs,
    ...theme.shadows.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
  },
  categoriesSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    marginBottom: SPACING.md,
    fontFamily: theme.typography.fontFamily,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: theme.colors.white,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  categoryIcon: {
    width: ICON_SIZE.xxl + 8,
    height: ICON_SIZE.xxl + 8,
    borderRadius: (ICON_SIZE.xxl + 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  recentSection: {
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  viewAllText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily,
  },
  actionItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    ...theme.shadows.sm,
  },
  actionItemIcon: {
    width: ICON_SIZE.xl,
    height: ICON_SIZE.xl,
    borderRadius: ICON_SIZE.xl / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  actionItemInfo: {
    flex: 1,
  },
  actionItemTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
    fontFamily: theme.typography.fontFamily,
  },
  actionItemDescription: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily,
  },
  actionItemCarbon: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.primary,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    backgroundColor: theme.colors.white,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    fontFamily: theme.typography.fontFamily,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: theme.typography.fontFamily,
  },
  emptyStateButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  emptyStateButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: ICON_SIZE.xxl + 8,
    height: ICON_SIZE.xxl + 8,
    borderRadius: (ICON_SIZE.xxl + 8) / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  bottomPadding: {
    height: 100,
  },
});

export default ActionsScreen;


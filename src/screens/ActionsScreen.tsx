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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreen } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { theme, SPACING, FONT_SIZE, BORDER_RADIUS, ICON_SIZE } from '../theme';
import { useNearbyGreenZones } from '../hooks/useGreenResources';
import { userDataService } from '../services';
import type { GreenZone } from '../types/api';
import Geolocation from 'react-native-geolocation-service';

const { width } = Dimensions.get('window');

// Action categories with icons and colors
const ACTION_CATEGORIES = [
  {
    type: 'transport',
    label: 'Di chuyển',
    icon: 'bus',
    color: '#2196F3',
    examples: ['Xe buýt', 'Xe đạp', 'Đi bộ', 'Đi chung xe'],
    bgImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'energy',
    label: 'Năng lượng',
    icon: 'lightning-bolt',
    color: '#FF9800',
    examples: ['Điện mặt trời', 'Tắt đèn', 'Tiết kiệm điện'],
    bgImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'waste',
    label: 'Rác thải',
    icon: 'recycle',
    color: '#4CAF50',
    examples: ['Tái chế', 'Ủ phân', 'Không rác thải', 'Giảm nhựa'],
    bgImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'water',
    label: 'Nước',
    icon: 'water',
    color: '#00BCD4',
    examples: ['Tiết kiệm nước', 'Sửa rò rỉ', 'Thu nước mưa'],
    bgImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'food',
    label: 'Thực phẩm',
    icon: 'food-apple',
    color: '#8BC34A',
    examples: ['Ăn chay', 'Thực phẩm địa phương', 'Giảm lãng phí'],
    bgImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    type: 'community',
    label: 'Cộng đồng',
    icon: 'account-group',
    color: '#E91E63',
    examples: ['Trồng cây', 'Dọn dẹp', 'Tình nguyện'],
    bgImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

const ActionsScreen: StackScreen<'Actions'> = ({ navigation }) => {
  const { environmentalImpact, addGreenAction, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get current location
  useEffect(() => {
    const getLocation = async () => {
      try {
        let hasPermission = false;
        if (Platform.OS === 'ios') {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          hasPermission = auth === 'granted';
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Quyền truy cập vị trí',
              message: 'GreenEduMap cần truy cập vị trí để tìm địa điểm xanh gần bạn.',
              buttonNeutral: 'Hỏi lại sau',
              buttonNegative: 'Hủy',
              buttonPositive: 'Đồng ý',
            }
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (hasPermission) {
          Geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      } catch (error) {
        console.warn(error);
      }
    };

    getLocation();
  }, []);

  // Fetch nearby green zones
  const nearbyParams = React.useMemo(() => (
    location ? {
      latitude: location.latitude,
      longitude: location.longitude,
      radius: 5,
      limit: 5,
    } : null
  ), [location?.latitude, location?.longitude]);

  const { data: nearbyZones, loading: loadingZones } = useNearbyGreenZones(nearbyParams);

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
    // Log activity (non-blocking)
    if (user) {
      userDataService.logActivity({
        activity_type: 'view_action_category',
        description: `Viewed ${category.label} action category`,
        resource_type: 'action_category',
        resource_id: category.type,
      }).catch((err: any) => console.log('📊 Activity log failed:', err));
    }

    // Quick add action with default values
    Alert.alert(
      `Ghi nhận hành động ${category.label}`,
      `Chọn hành động ${category.label.toLowerCase()} bạn vừa thực hiện:`,
      [
        ...category.examples.map((example) => ({
          text: example,
          onPress: async () => {
            try {
              setLoading(true);
              await addGreenAction({
                type: category.type as any,
                title: example,
                description: `Đã hoàn thành hành động ${example.toLowerCase()}`,
                carbonSaved: Math.random() * 3 + 0.5, // Random 0.5-3.5kg
              });

              // Log action completion
              if (user) {
                userDataService.logActivity({
                  activity_type: 'complete_green_action',
                  description: `Completed action: ${example}`,
                  resource_type: 'green_action',
                  resource_id: category.type,
                }).catch((err: any) => console.log('📊 Activity log failed:', err));
              }

              Alert.alert('Thành công!', `Đã ghi nhận ${example}!`);
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể ghi nhận hành động');
            } finally {
              setLoading(false);
            }
          },
        })),
        { text: 'Hủy', style: 'cancel' },
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

  const handleZoneClick = (zone: GreenZone) => {
    navigation.navigate('Map');

    // Log activity (non-blocking)
    if (user) {
      userDataService.logActivity({
        activity_type: 'view_green_zone_from_actions',
        description: `Viewed green zone: ${zone.name}`,
        resource_type: 'green_zone',
        resource_id: zone.id,
      }).catch((err: any) => console.log('📊 Activity log failed:', err));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Hành động xanh</Text>
            <Text style={styles.headerSubtitle}>Ghi nhận & Theo dõi tác động</Text>
          </View>
          <TouchableOpacity onPress={handleViewHistory} style={styles.historyButton}>
            <Icon name="history" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero Stats Card - Floating */}
        <View style={styles.heroCardContainer}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Tác động của bạn</Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{environmentalImpact?.totalCarbonSaved.toFixed(1) || 0}</Text>
                <Text style={styles.heroStatUnit}>kg CO₂</Text>
                <Text style={styles.heroStatLabel}>Đã giảm</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{environmentalImpact?.totalActionsCount || 0}</Text>
                <Text style={styles.heroStatUnit}>Hành động</Text>
                <Text style={styles.heroStatLabel}>Tổng cộng</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatValue}>{environmentalImpact?.currentStreak || 0}</Text>
                <Text style={styles.heroStatUnit}>Ngày</Text>
                <Text style={styles.heroStatLabel}>Chuỗi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Measure Grid - 2 Columns */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ghi nhận ngay</Text>
          <View style={styles.categoriesGrid}>
            {ACTION_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.type}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                  <Icon name={category.icon} size={28} color="#FFF" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <Text style={styles.categorySubtext}>{category.examples[0]}, {category.examples[1]}...</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Green Zones */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Địa điểm xanh gần bạn</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={styles.viewAllText}>Xem bản đồ</Text>
            </TouchableOpacity>
          </View>

          {loadingZones ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
          ) : nearbyZones && nearbyZones.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {nearbyZones.map((zone) => (
                <TouchableOpacity
                  key={zone.id}
                  style={styles.zoneCard}
                  activeOpacity={0.9}
                  onPress={() => handleZoneClick(zone)}
                >
                  <ImageBackground
                    source={{ uri: zone.image_url || 'https://images.unsplash.com/photo-1496104679561-38d312563347?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                    style={styles.zoneImage}
                    imageStyle={{ borderRadius: BORDER_RADIUS.md }}
                  >
                    <View style={styles.zoneDistanceBadge}>
                      <Icon name="map-marker" size={12} color="#FFF" />
                      <Text style={styles.zoneDistanceText}>{zone.distance ? `${zone.distance.toFixed(1)} km` : 'N/A'}</Text>
                    </View>
                    <View style={styles.zoneInfoOverlay}>
                      <Text style={styles.zoneName} numberOfLines={1}>{zone.name}</Text>
                      <Text style={styles.zoneType}>{zone.zone_type === 'park' ? 'Công viên' : 'Khu xanh'}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            !location ? (
              <View style={styles.emptyZoneContainer}>
                <Icon name="map-marker-off" size={32} color={theme.colors.textLight} />
                <Text style={styles.emptyZoneText}>Bật định vị để tìm địa điểm gần bạn</Text>
              </View>
            ) : (
              <View style={styles.emptyZoneContainer}>
                <Icon name="tree-outline" size={32} color={theme.colors.textLight} />
                <Text style={styles.emptyZoneText}>Không tìm thấy địa điểm xanh nào gần đây</Text>
              </View>
            )
          )}
        </View>

        {/* Recent Actions List */}
        <View style={[styles.sectionContainer, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Hoạt động vừa qua</Text>

          {!environmentalImpact || environmentalImpact.completedActions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="leaf-off" size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyStateText}>Chưa có hoạt động nào</Text>
              <Text style={styles.emptyStateSubtext}>
                Hãy bắt đầu hành trình xanh của bạn ngay hôm nay!
              </Text>
            </View>
          ) : (
            environmentalImpact.completedActions
              .slice(0, 5)
              .map((action) => (
                <View key={action.id} style={styles.actionItem}>
                  <View style={styles.actionItemLeft}>
                    <View style={[styles.actionItemIcon, { backgroundColor: getActionTypeColor(action.type) + '15' }]}>
                      <Icon name={getActionTypeIcon(action.type)} size={20} color={getActionTypeColor(action.type)} />
                    </View>
                    <View>
                      <Text style={styles.actionItemTitle}>{action.title}</Text>
                      <Text style={styles.actionItemTime}>Vừa xong</Text>
                    </View>
                  </View>

                  <View style={styles.actionItemRight}>
                    <Text style={styles.actionCarbon}>-{action.carbonSaved.toFixed(1)}</Text>
                    <Text style={styles.actionCarbonUnit}>kg CO₂</Text>
                  </View>
                </View>
              ))
          )}
        </View>

      </ScrollView>

      {/* Floating Add Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddAction}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Light gray background for better contrast
  },
  headerBackground: {
    backgroundColor: theme.colors.primary,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl * 3, // Increased to make room for overlapping card
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: theme.typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontFamily: theme.typography.fontFamily,
  },
  historyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
    marginTop: -SPACING.xl * 2, // Pull up content to overlap header
  },
  // Hero Stats Card
  heroCardContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    zIndex: 1,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...theme.shadows.md,
  },
  heroTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: SPACING.md,
    opacity: 0.8,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  heroStatUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  heroStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: theme.colors.textLight,
  },
  heroDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  // Sections
  sectionContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: SPACING.md,
  },
  viewAllText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  // Categories 3-Column Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  categoryCard: {
    width: (width - (SPACING.lg * 2) - (SPACING.md * 2)) / 3, // Standardize width for 3 columns accounting for padding/gap
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
    marginBottom: 2,
    aspectRatio: 1, // Make it square
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryInfo: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  categorySubtext: {
    fontSize: 9,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  // Nearby Zones
  horizontalScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  zoneCard: {
    marginRight: SPACING.md,
    width: 200, // Wider card
    height: 120,
    ...theme.shadows.sm,
  },
  zoneImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: SPACING.sm,
  },
  zoneDistanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  zoneDistanceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  zoneInfoOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginHorizontal: -SPACING.sm,
    marginBottom: -SPACING.sm,
    padding: SPACING.sm,
  },
  zoneName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  zoneType: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
  },
  emptyZoneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    gap: 8,
  },
  emptyZoneText: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
  },
  // Recent List
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionItemTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  actionItemTime: {
    fontSize: 10,
    color: theme.colors.textLight,
  },
  actionItemRight: {
    alignItems: 'flex-end',
  },
  actionCarbon: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  actionCarbonUnit: {
    fontSize: 10,
    color: theme.colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.sm,
    color: theme.colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    elevation: 6,
  },
});

export default ActionsScreen;

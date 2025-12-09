# 💡 WebSocket Usage Examples

Các ví dụ thực tế về cách sử dụng WebSocket trong GreenEduMapApp

---

## 📱 Example 1: HomeScreen với Unread Badge

```typescript
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { unreadCount, registerRefreshCallback } = useNotifications();

  // Auto refresh khi có notification mới
  useEffect(() => {
    const unregister = registerRefreshCallback(() => {
      console.log('🔄 Refreshing HomeScreen data...');
      // Refresh your data here
      fetchAirQualityData();
      fetchWeatherData();
    });

    return () => unregister();
  }, [registerRefreshCallback]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GreenEduMap</Text>
        
        {/* Notification Bell with Badge */}
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell" size={24} color="#000" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Your content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
```

---

## 📋 Example 2: NotificationsScreen (Danh sách thông báo)

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Fetch latest notifications from API if needed
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: any) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'environmental_alert':
        navigation.navigate('Map', { 
          location: notification.data?.location 
        });
        break;
      case 'learning_update':
        navigation.navigate('Learn', { 
          courseId: notification.data?.course_id 
        });
        break;
      case 'community_update':
        navigation.navigate('Community', { 
          postId: notification.data?.post_id 
        });
        break;
      default:
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'environmental_alert':
        return { name: 'alert-circle-outline', color: '#FFC107' };
      case 'learning_update':
        return { name: 'book-open-variant', color: '#17A2B8' };
      case 'community_update':
        return { name: 'account-group', color: '#28A745' };
      case 'system_message':
        return { name: 'information-outline', color: '#6C757D' };
      default:
        return { name: 'bell', color: '#17A2B8' };
    }
  };

  const renderNotificationItem = ({ item }: any) => {
    const iconConfig = getIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[styles.notificationItem, item.read && styles.notificationItemRead]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '20' }]}>
          <Icon name={iconConfig.name} size={24} color={iconConfig.color} />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, item.read && styles.titleRead]}>
            {item.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.time}>
            {formatTime(item.timestamp)}
          </Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>Đọc tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có thông báo</Text>
          </View>
        }
      />
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markAllRead: {
    color: '#007AFF',
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  notificationItemRead: {
    backgroundColor: '#FAFAFA',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleRead: {
    fontWeight: '400',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default NotificationsScreen;
```

---

## 🗺️ Example 3: MapScreen với Auto Refresh

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNotifications } from '../hooks/useNotifications';

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 16.068882,
    longitude: 108.245350,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const { registerRefreshCallback } = useNotifications();

  // Fetch markers data
  const fetchMarkers = async () => {
    console.log('📍 Fetching map markers...');
    // Fetch from API
    // const response = await environmentService.getLocations();
    // setMarkers(response.data);
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  // Auto refresh khi có environmental alert
  useEffect(() => {
    const unregister = registerRefreshCallback(() => {
      console.log('🔄 Refreshing map data due to environmental alert...');
      fetchMarkers();
    });

    return () => unregister();
  }, [registerRefreshCallback]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {markers.map((marker: any) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
```

---

## 📚 Example 4: LearnScreen với Learning Updates

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';

const LearnScreen = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { registerRefreshCallback } = useNotifications();

  // Fetch courses
  const fetchCourses = async () => {
    console.log('📚 Fetching courses...');
    // const response = await learningService.getCourses();
    // setCourses(response.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Auto refresh khi có learning update
  useEffect(() => {
    const unregister = registerRefreshCallback(() => {
      console.log('🔄 Refreshing courses due to learning update...');
      fetchCourses();
    });

    return () => unregister();
  }, [registerRefreshCallback]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Khóa học</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  courseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default LearnScreen;
```

---

## 🔔 Example 5: Custom Notification Handler

```typescript
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNotifications, Notification } from '../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';

const CustomNotificationHandler = () => {
  const { notifications } = useNotifications();
  const navigation = useNavigation();

  useEffect(() => {
    const latestNotification = notifications[0];
    
    if (!latestNotification || latestNotification.read) return;

    // Handle critical environmental alerts
    if (
      latestNotification.type === 'environmental_alert' &&
      latestNotification.data?.severity === 'critical'
    ) {
      Alert.alert(
        '⚠️ Cảnh báo nghiêm trọng',
        latestNotification.message,
        [
          { text: 'Đóng', style: 'cancel' },
          {
            text: 'Xem chi tiết',
            onPress: () => {
              navigation.navigate('Map', {
                location: latestNotification.data.location,
              });
            },
          },
        ]
      );
    }
  }, [notifications]);

  return null;
};

export default CustomNotificationHandler;
```

---

## 🎯 Example 6: Navigation Tab Badge

Hiển thị badge trên Navigation Tab:

```typescript
// src/navigation/MainTabNavigator.tsx
import { useNotifications } from '../hooks/useNotifications';

const MainTabNavigator = () => {
  const { unreadCount } = useNotifications();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="bell" size={size} color={color} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: '#FF3B30',
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
};
```

---

## 🧪 Example 7: Debug Component

Component để test và debug WebSocket:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNotifications } from '../hooks/useNotifications';

const WebSocketDebug = () => {
  const { isConnected } = useWebSocket();
  const { notifications, unreadCount } = useNotifications();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebSocket Debug</Text>
      
      <View style={styles.row}>
        <Text>Connection Status:</Text>
        <Text style={[styles.status, isConnected && styles.connected]}>
          {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text>Unread Count:</Text>
        <Text style={styles.count}>{unreadCount}</Text>
      </View>

      <View style={styles.row}>
        <Text>Total Notifications:</Text>
        <Text style={styles.count}>{notifications.length}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('Notifications:', notifications)}
      >
        <Text style={styles.buttonText}>Log Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  status: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  connected: {
    color: '#28A745',
  },
  count: {
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default WebSocketDebug;
```

---

## 🎨 Bonus: Notification Preferences

Cho phép user tùy chỉnh loại thông báo nhận được:

```typescript
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    environmentalAlerts: true,
    learningUpdates: true,
    communityUpdates: true,
    systemMessages: true,
  });

  const togglePreference = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    // Save to AsyncStorage or API
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cài đặt thông báo</Text>

      <View style={styles.item}>
        <View>
          <Text style={styles.label}>Cảnh báo môi trường</Text>
          <Text style={styles.description}>
            Nhận thông báo về chất lượng không khí, thời tiết
          </Text>
        </View>
        <Switch
          value={preferences.environmentalAlerts}
          onValueChange={() => togglePreference('environmentalAlerts')}
        />
      </View>

      <View style={styles.item}>
        <View>
          <Text style={styles.label}>Cập nhật học tập</Text>
          <Text style={styles.description}>
            Khóa học mới, bài giảng, tài liệu
          </Text>
        </View>
        <Switch
          value={preferences.learningUpdates}
          onValueChange={() => togglePreference('learningUpdates')}
        />
      </View>

      <View style={styles.item}>
        <View>
          <Text style={styles.label}>Hoạt động cộng đồng</Text>
          <Text style={styles.description}>
            Thảo luận, sự kiện, hoạt động mới
          </Text>
        </View>
        <Switch
          value={preferences.communityUpdates}
          onValueChange={() => togglePreference('communityUpdates')}
        />
      </View>

      <View style={styles.item}>
        <View>
          <Text style={styles.label}>Thông báo hệ thống</Text>
          <Text style={styles.description}>
            Cập nhật, bảo trì, thông báo quan trọng
          </Text>
        </View>
        <Switch
          value={preferences.systemMessages}
          onValueChange={() => togglePreference('systemMessages')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    maxWidth: 250,
  },
});

export default NotificationPreferences;
```

---

**🎉 Các ví dụ này sẽ giúp bạn tích hợp WebSocket vào tất cả các màn hình của GreenEduMapApp!**

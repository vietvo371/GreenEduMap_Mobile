import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotifications } from '../hooks/useNotifications';
import { theme } from '../theme/colors';

export const NotificationBanner = () => {
  const { notifications, markAsRead } = useNotifications();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  
  const latestNotification = notifications.find(n => !n.read);

  useEffect(() => {
    if (latestNotification) {
      showToast();
    }
  }, [latestNotification?.id]);

  const showToast = () => {
    if (!latestNotification) return;

    // Reset animations
    slideAnim.setValue(-100);
    fadeAnim.setValue(0);
    progressAnim.setValue(1);

    // Show animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Auto hide after 5s
    setTimeout(() => {
      hideToast();
    }, 5000);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (latestNotification) {
        markAsRead(latestNotification.id);
      }
    });
  };

  if (!latestNotification) return null;

  const getConfig = () => {
    // Color coding by type
    switch (latestNotification.type) {
      case 'environmental_alert':
        return {
          backgroundColor: '#FFF3CD',
          icon: 'alert-circle-outline',
          iconColor: '#856404',
          borderColor: '#FFC107',
        };
      case 'learning_update':
        return {
          backgroundColor: '#D1ECF1',
          icon: 'book-open-variant',
          iconColor: '#0C5460',
          borderColor: '#17A2B8',
        };
      case 'community_update':
        return {
          backgroundColor: '#D4EDDA',
          icon: 'account-group',
          iconColor: '#155724',
          borderColor: '#28A745',
        };
      case 'system_message':
        return {
          backgroundColor: '#E2E3E5',
          icon: 'information-outline',
          iconColor: '#383D41',
          borderColor: '#6C757D',
        };
      default:
        return {
          backgroundColor: '#D1ECF1',
          icon: 'bell',
          iconColor: '#0C5460',
          borderColor: '#17A2B8',
        };
    }
  };

  const config = getConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 10,
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.toast, { backgroundColor: config.backgroundColor }]}
        onPress={hideToast}
        activeOpacity={0.9}
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: config.borderColor,
              },
            ]}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name={config.icon} size={24} color={config.iconColor} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: config.iconColor }]} numberOfLines={1}>
              {latestNotification.title}
            </Text>
            <Text style={[styles.message, { color: config.iconColor }]} numberOfLines={3}>
              {latestNotification.message}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideToast}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close" size={20} color={config.iconColor} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999999,
  },
  toast: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressBar: {
    height: '100%',
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    paddingTop: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
});

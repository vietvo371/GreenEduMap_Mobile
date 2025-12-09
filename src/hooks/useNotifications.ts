import { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';

export interface Notification {
  id: string;
  type: 'environmental_alert' | 'learning_update' | 'system_message' | 'community_update';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read?: boolean;
}

type RefreshCallback = () => void;
let refreshCallbacks: RefreshCallback[] = [];

export const useNotifications = () => {
  const { isConnected, subscribe, unsubscribe, listen } = useWebSocket();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Register refresh callback
  const registerRefreshCallback = useCallback((callback: RefreshCallback) => {
    refreshCallbacks.push(callback);
    return () => {
      refreshCallbacks = refreshCallbacks.filter(cb => cb !== callback);
    };
  }, []);

  // Trigger all refresh callbacks
  const triggerRefresh = useCallback(() => {
    refreshCallbacks.forEach(callback => callback());
  }, []);

  // Fetch unread count on mount
  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
    }
  }, [user?.id, fetchUnreadCount]);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!isConnected || !user?.id) return;

    console.log('🎯 Setting up WebSocket listeners for user:', user.id);

    const userChannel = `private-user.${user.id}`;
    subscribe(userChannel);

    // Listen to environmental alerts
    listen(userChannel, 'environmental.alert', (data) => {
      console.log('🌍 Environmental alert:', data);
      
      const notification: Notification = {
        id: `env-${data.id || Date.now()}`,
        type: 'environmental_alert',
        title: 'Cảnh báo môi trường',
        message: data.message || 'Có cảnh báo môi trường mới',
        data: data,
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [notification, ...prev]);
      fetchUnreadCount();
      triggerRefresh();
    });

    // Listen to learning updates
    listen(userChannel, 'learning.update', (data) => {
      console.log('📚 Learning update:', data);
      
      const notification: Notification = {
        id: `learning-${data.id || Date.now()}`,
        type: 'learning_update',
        title: 'Cập nhật học tập',
        message: data.message || 'Có nội dung học tập mới',
        data: data,
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [notification, ...prev]);
      fetchUnreadCount();
      triggerRefresh();
    });

    // Listen to community updates
    listen(userChannel, 'community.update', (data) => {
      console.log('👥 Community update:', data);
      
      const notification: Notification = {
        id: `community-${data.id || Date.now()}`,
        type: 'community_update',
        title: 'Cập nhật cộng đồng',
        message: data.message || 'Có hoạt động mới từ cộng đồng',
        data: data,
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [notification, ...prev]);
      fetchUnreadCount();
      triggerRefresh();
    });

    // Listen to system messages
    listen(userChannel, 'system.message', (data) => {
      console.log('📢 System message:', data);
      
      const notification: Notification = {
        id: `system-${data.id || Date.now()}`,
        type: 'system_message',
        title: 'Thông báo hệ thống',
        message: data.message || 'Có thông báo từ hệ thống',
        data: data,
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [notification, ...prev]);
      fetchUnreadCount();
      triggerRefresh();
    });

    return () => {
      unsubscribe(userChannel);
    };
  }, [isConnected, user?.id, subscribe, unsubscribe, listen, fetchUnreadCount, triggerRefresh]);

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    // Call API to mark as read
    await notificationService.markAsRead(notificationId);
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // Call API to mark all as read
    await notificationService.markAllAsRead();
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    
    // Call API to delete all notifications
    await notificationService.deleteAllNotifications();
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    registerRefreshCallback,
  };
};

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../config/env';

const API_URL = env.API_URL;

// Tạo instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: env.TIMEOUT || 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor để tự động thêm token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const notificationService = {
  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      return {
        success: false,
        data: { count: 0 },
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Lấy danh sách thông báo
   */
  getNotifications: async (page = 1, perPage = 20) => {
    try {
      const response = await api.get('/notifications', {
        params: { page, per_page: perPage },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        data: { data: [], total: 0 },
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Đánh dấu thông báo đã đọc
   */
  markAsRead: async (notificationId: string) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/read-all');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Xóa thông báo
   */
  deleteNotification: async (notificationId: string) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Xóa tất cả thông báo
   */
  deleteAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error deleting all notifications:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

/**
 * School Service - Education Data
 * Handles schools and green courses from GreenEduMap API
 */

import api from '../utils/Api';
import { ApiResponse } from '../types/api';

// ============================================================================
// TYPES
// ============================================================================

export interface School {
  id: string; // UUID - not number!
  name: string;
  code?: string;
  address: string;
  city: string;
  district: string;
  type: 'elementary' | 'middle' | 'high' | 'university' | 'international' | 'other';
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string | null;
  total_students?: number;
  total_teachers?: number;
  total_trees?: number;
  green_area?: number;
  green_score?: number;
  is_public?: boolean;
  data_uri?: string | null;
  facilities?: any | null;
  meta_data?: any | null;
  ngsi_ld_uri?: string | null;
  created_at?: string;
  updated_at?: string;
  distance?: number; // km (when using nearby endpoint)
}

export interface GreenCourse {
  id: string; // UUID
  title: string;
  description: string;
  category: string;
  duration_weeks?: number;
  max_students?: number;
  syllabus?: any | null;
  meta_data?: any | null;
  is_public?: boolean;
  school_id?: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface SchoolParams {
  skip?: number;
  limit?: number;
  district?: string;
  city?: string;
  type?: School['type']; // Changed from school_type to type
}

export interface NearbySchoolParams {
  latitude: number;
  longitude: number;
  radius?: number; // km
  limit?: number;
}

export interface GreenCourseParams {
  skip?: number;
  limit?: number;
  category?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const schoolService = {
  // ============================================================================
  // SCHOOLS
  // ============================================================================

  /**
   * Lấy danh sách trường học với phân trang
   */
  getSchools: async (params?: SchoolParams): Promise<School[]> => {
    try {
      console.log('🌐 [API] GET /schools', params);
      // API trả về array trực tiếp, không có wrapper
      const response = await api.get<School[]>('/schools', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          district: params?.district,
          city: params?.city,
          type: params?.type, // Changed from school_type to type
        },
      });

      if (response.data) {
        console.log('✅ [API] Schools received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get schools error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Tìm trường học gần vị trí
   */
  getNearbySchools: async (params: NearbySchoolParams): Promise<School[]> => {
    try {
      console.log('🌐 [API] GET /schools/nearby', params);
      // API trả về array trực tiếp, không có wrapper
      const response = await api.get<School[]>('/schools/nearby', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius_km: params.radius || 5, // API uses radius_km parameter
          limit: params.limit || 10,
        },
      });

      if (response.data) {
        console.log('✅ [API] Nearby schools received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get nearby schools error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Lấy thông tin chi tiết trường học
   * Note: ID phải là UUID string, không phải number
   */
  getSchoolById: async (id: string): Promise<School | null> => {
    try {
      console.log('🌐 [API] GET /schools/' + id);
      // API trả về School object trực tiếp hoặc error 422 nếu ID không phải UUID
      const response = await api.get<School>(`/schools/${id}`);

      if (response.data) {
        console.log('✅ [API] School by ID received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get school by ID error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail
      });
      return null;
    }
  },

  // ============================================================================
  // GREEN COURSES
  // ============================================================================

  /**
   * Lấy danh sách khóa học môi trường
   */
  getGreenCourses: async (params?: GreenCourseParams): Promise<GreenCourse[]> => {
    try {
      const requestParams = {
        skip: params?.skip || 0,
        limit: params?.limit || 10,
        category: params?.category,
      };
      console.log('🌐 [API] GET /green-courses', requestParams);

      // API trả về array trực tiếp (không có wrapper)
      const response = await api.get<GreenCourse[]>('/green-courses', {
        params: requestParams,
      });

      console.log('📥 [API] Response:', {
        status: response.status,
        coursesCount: response.data?.length || 0
      });

      if (response.data) {
        console.log('✅ [API] Green courses received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get green courses error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Lấy chi tiết khóa học
   */
  getGreenCourseById: async (id: string): Promise<GreenCourse | null> => {
    try {
      console.log('🌐 [API] GET /green-courses/' + id);
      // API trả về GreenCourse object trực tiếp
      const response = await api.get<GreenCourse>(`/green-courses/${id}`);

      if (response.data) {
        console.log('✅ [API] Green course by ID received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get green course by ID error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return null;
    }
  },

  /**
   * Đăng ký khóa học
   */
  enrollCourse: async (courseId: string): Promise<void> => {
    try {
      await api.post(`/green-courses/${courseId}/enroll`);
    } catch (error) {
      console.error('Enroll course error:', error);
      throw error;
    }
  },

  /**
   * Lấy tiến độ học tập của khóa học
   */
  getCourseProgress: async (courseId: string): Promise<{ progress: number; completed_lessons: number[] }> => {
    try {
      console.log('🌐 [API] GET /green-courses/' + courseId + '/progress');
      // API có thể trả về object trực tiếp
      const response = await api.get<{ progress: number; completed_lessons: number[] }>(
        `/green-courses/${courseId}/progress`
      );

      if (response.data) {
        console.log('✅ [API] Course progress received');
        return response.data;
      }

      return { progress: 0, completed_lessons: [] };
    } catch (error: any) {
      console.error('❌ [API] Get course progress error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return { progress: 0, completed_lessons: [] };
    }
  },
};

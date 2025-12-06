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
  id: number;
  name: string;
  district: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  school_type: 'primary' | 'secondary' | 'high' | 'university' | 'other';
  students_count?: number;
  teachers_count?: number;
  established_year?: number;
  description?: string;
  green_initiatives?: string[];
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
  school_type?: School['school_type'];
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
  getSchools: async (params?: SchoolParams): Promise<{ data: School[]; total: number }> => {
    try {
      const response = await api.get<ApiResponse<{ items: School[]; total: number }>>('/schools', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          district: params?.district,
          city: params?.city,
          school_type: params?.school_type,
        },
      });

      if (response.data.success && response.data.data) {
        return {
          data: response.data.data.items,
          total: response.data.data.total,
        };
      }

      throw new Error('Không thể lấy danh sách trường học');
    } catch (error) {
      console.error('Get schools error:', error);
      throw error;
    }
  },

  /**
   * Tìm trường học gần vị trí
   */
  getNearbySchools: async (params: NearbySchoolParams): Promise<School[]> => {
    try {
      const response = await api.get<ApiResponse<School[]>>('/schools/nearby', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 5, // Default 5km
          limit: params.limit || 10,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể tìm trường học gần đây');
    } catch (error) {
      console.error('Get nearby schools error:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết trường học
   */
  getSchoolById: async (id: number): Promise<School> => {
    try {
      const response = await api.get<ApiResponse<School>>(`/schools/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy thông tin trường học');
    } catch (error) {
      console.error('Get school by ID error:', error);
      throw error;
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
        console.log('✅ [API] Green courses received:', response.data.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category
        })));
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get green courses error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return [];
    }
  },

  /**
   * Lấy chi tiết khóa học
   */
  getGreenCourseById: async (id: string): Promise<GreenCourse> => {
    try {
      const response = await api.get<ApiResponse<GreenCourse>>(`/green-courses/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy thông tin khóa học');
    } catch (error) {
      console.error('Get green course by ID error:', error);
      throw error;
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
      const response = await api.get<ApiResponse<{ progress: number; completed_lessons: number[] }>>(
        `/green-courses/${courseId}/progress`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return { progress: 0, completed_lessons: [] };
    } catch (error) {
      console.error('Get course progress error:', error);
      return { progress: 0, completed_lessons: [] };
    }
  },
};

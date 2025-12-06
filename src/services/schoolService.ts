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
  id: number;
  title: string;
  description: string;
  category: 'climate_change' | 'renewable_energy' | 'sustainability' | 'environmental_science' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  lessons_count: number;
  icon: string;
  color: string;
  thumbnail?: string;
  instructor?: string;
  rating?: number;
  enrolled_count?: number;
  created_at: string;
  updated_at: string;
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
  category?: GreenCourse['category'];
  difficulty?: GreenCourse['difficulty'];
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
        return response.data.data;
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
  getGreenCourses: async (params?: GreenCourseParams): Promise<{ data: GreenCourse[]; total: number }> => {
    try {
      const requestParams = {
        skip: params?.skip || 0,
        limit: params?.limit || 10,
        category: params?.category,
        difficulty: params?.difficulty,
      };
      console.log('🌐 [API] GET /green-courses', requestParams);
      
      const response = await api.get<ApiResponse<{ items: GreenCourse[]; total: number }>>('/green-courses', {
        params: requestParams,
      });

      console.log('📥 [API] Response:', {
        status: response.status,
        success: response.data.success,
        total: response.data.data?.total || 0,
        itemsCount: response.data.data?.items?.length || 0
      });

      if (response.data.success && response.data.data) {
        console.log('✅ [API] Green courses received:', response.data.data.items.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category
        })));
        return response.data.data;
      }

      throw new Error('Không thể lấy danh sách khóa học');
    } catch (error: any) {
      console.error('❌ [API] Get green courses error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  /**
   * Lấy chi tiết khóa học
   */
  getGreenCourseById: async (id: number): Promise<GreenCourse> => {
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
  enrollCourse: async (courseId: number): Promise<void> => {
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
  getCourseProgress: async (courseId: number): Promise<{ progress: number; completed_lessons: number[] }> => {
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

/**
 * Green Resource Service - Green Zones & Resources
 * Handles green zones and environmental resources from GreenEduMap API
 */

import api from '../utils/Api';
import { ApiResponse } from '../types/api';

// ============================================================================
// TYPES
// ============================================================================

export interface GreenZone {
  id: string; // UUID
  name: string;
  code?: string;
  zone_type: 'park' | 'forest' | 'garden' | 'botanical' | 'wetland' | 'reserve' | 'other';
  latitude: number;
  longitude: number;
  address?: string;
  area_sqm?: number;
  tree_count?: number;
  vegetation_coverage?: number;
  maintained_by?: string;
  phone?: string | null;
  is_public?: boolean;
  data_uri?: string | null;
  facilities?: any | null;
  meta_data?: any | null;
  description?: string;
  opening_hours?: string;
  entry_fee?: number;
  image_url?: string;
  distance?: number; // km (when using nearby endpoint)
  created_at?: string;
  updated_at?: string;
}

export interface GreenResource {
  id: number;
  name: string;
  type: 'renewable_energy' | 'recycling_center' | 'water_treatment' | 'waste_management' | 'green_building' | 'other';
  district: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  capacity?: string;
  operating_hours?: string;
  contact_phone?: string;
  contact_email?: string;
  image_url?: string;
  distance?: number; // km (when using nearby endpoint)
}

export interface GreenZoneParams {
  skip?: number;
  limit?: number;
  zone_type?: GreenZone['zone_type'];
}

export interface GreenResourceParams {
  skip?: number;
  limit?: number;
  type?: GreenResource['type'];
  city?: string;
  district?: string;
}

export interface NearbyParams {
  latitude: number;
  longitude: number;
  radius?: number; // km
  limit?: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export const greenResourceService = {
  // ============================================================================
  // GREEN ZONES (Public - no auth required)
  // ============================================================================

  /**
   * Lấy danh sách khu vực xanh (công viên, rừng, vườn)
   */
  getGreenZones: async (params?: GreenZoneParams): Promise<GreenZone[]> => {
    try {
      // API trả về array trực tiếp (không có wrapper)
      const response = await api.get<GreenZone[]>('/open-data/green-zones', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          zone_type: params?.zone_type,
        },
      });

      if (response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Get green zones error:', error.data);
      return [];
    }
  },

  /**
   * Tìm khu vực xanh gần vị trí
   */
  getNearbyGreenZones: async (params: NearbyParams): Promise<GreenZone[]> => {
    try {
      // Fallback to main endpoint since /nearby is 404
      // We pass location params in case backend supports filtering
      const response = await api.get<GreenZone[]>('/open-data/green-zones', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 5,
          limit: params.limit || 10,
        },
      });

      if (response.data) {
        // If the backend doesn't return distance, we could calculate it here if needed
        // For now, we just return the list to avoid 404
        return response.data;
      }

      return [];
    } catch (error: any) {
      // Setup silent fail for 404 as the endpoint might not be ready
      if (error.response?.status === 404) {
        console.warn('Nearby green zones endpoint not found, returning empty list.');
        return [];
      }
      console.error('Get nearby green zones error:', error);
      return [];
    }
  },

  /**
   * Lấy chi tiết khu vực xanh
   */
  getGreenZoneById: async (id: string): Promise<GreenZone> => {
    try {
      const response = await api.get<ApiResponse<GreenZone>>(`/open-data/green-zones/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy thông tin khu vực xanh');
    } catch (error) {
      console.error('Get green zone by ID error:', error);
      throw error;
    }
  },

  // ============================================================================
  // GREEN RESOURCES (Public - no auth required)
  // ============================================================================

  /**
   * Lấy danh sách tài nguyên xanh (năng lượng tái tạo, trung tâm tái chế)
   */
  getGreenResources: async (params?: GreenResourceParams): Promise<{ data: GreenResource[]; total: number }> => {
    try {
      const response = await api.get<ApiResponse<{ items: GreenResource[]; total: number }>>('/open-data/green-resources', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          type: params?.type,
          city: params?.city,
          district: params?.district,
        },
      });

      if (response.data.success && response.data.data) {
        return {
          data: response.data.data.items,
          total: response.data.data.total,
        };
      }

      throw new Error('Không thể lấy danh sách tài nguyên xanh');
    } catch (error) {
      console.error('Get green resources error:', error);
      throw error;
    }
  },

  /**
   * Tìm tài nguyên xanh gần vị trí
   */
  getNearbyGreenResources: async (params: NearbyParams): Promise<GreenResource[]> => {
    try {
      // Fallback to main endpoint with location params
      const response = await api.get<ApiResponse<{ items: GreenResource[]; total: number }>>('/open-data/green-resources', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 5,
          limit: params.limit || 10,
        },
      });

      if (response.data.success && response.data.data) {
        // Note: getGreenResources returns { items: [], total: number } wrapped in ApiResponse
        return response.data.data.items;
      }

      return [];
    } catch (error) {
      console.error('Get nearby green resources error:', error);
      return [];
    }
  },

  /**
   * Lấy chi tiết tài nguyên xanh
   */
  getGreenResourceById: async (id: number): Promise<GreenResource> => {
    try {
      const response = await api.get<ApiResponse<GreenResource>>(`/open-data/green-resources/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy thông tin tài nguyên xanh');
    } catch (error) {
      console.error('Get green resource by ID error:', error);
      throw error;
    }
  },

  // ============================================================================
  // CATALOG (Public - no auth required)
  // ============================================================================

  /**
   * Lấy danh mục dữ liệu mở
   */
  getCatalog: async (): Promise<{
    datasets: Array<{
      id: string;
      title: string;
      category: string;
      formats: string[];
      api_endpoint: string;
    }>;
  }> => {
    try {
      const response = await api.get<{
        datasets: Array<{
          id: string;
          title: string;
          category: string;
          formats: string[];
          api_endpoint: string;
        }>;
      }>('/open-data/catalog');

      if (response.data && response.data.datasets) {
        return response.data;
      }

      return {
        datasets: [],
      };
    } catch (error) {
      console.error('Get catalog error:', error);
      return {
        datasets: [],
      };
    }
  },
};

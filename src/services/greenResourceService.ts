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
  id: number;
  name: string;
  zone_type: 'park' | 'forest' | 'garden' | 'botanical' | 'wetland' | 'reserve' | 'other';
  district: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  area: number; // m²
  tree_count?: number;
  description?: string;
  facilities?: string[];
  opening_hours?: string;
  entry_fee?: number;
  image_url?: string;
  distance?: number; // km (when using nearby endpoint)
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
  city?: string;
  district?: string;
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
  getGreenZones: async (params?: GreenZoneParams): Promise<{ data: GreenZone[]; total: number }> => {
    try {
      const response = await api.get<ApiResponse<{ items: GreenZone[]; total: number }>>('/open-data/green-zones', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          zone_type: params?.zone_type,
          city: params?.city,
          district: params?.district,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy danh sách khu vực xanh');
    } catch (error) {
      console.error('Get green zones error:', error);
      throw error;
    }
  },

  /**
   * Tìm khu vực xanh gần vị trí
   */
  getNearbyGreenZones: async (params: NearbyParams): Promise<GreenZone[]> => {
    try {
      const response = await api.get<ApiResponse<GreenZone[]>>('/open-data/green-zones/nearby', {
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

      return [];
    } catch (error) {
      console.error('Get nearby green zones error:', error);
      return [];
    }
  },

  /**
   * Lấy chi tiết khu vực xanh
   */
  getGreenZoneById: async (id: number): Promise<GreenZone> => {
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
        return response.data.data;
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
      const response = await api.get<ApiResponse<GreenResource[]>>('/open-data/green-resources/nearby', {
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
    air_quality_stations: number;
    weather_stations: number;
    green_zones: number;
    green_resources: number;
    schools: number;
    last_updated: string;
  }> => {
    try {
      const response = await api.get<
        ApiResponse<{
          air_quality_stations: number;
          weather_stations: number;
          green_zones: number;
          green_resources: number;
          schools: number;
          last_updated: string;
        }>
      >('/open-data/catalog');

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return {
        air_quality_stations: 0,
        weather_stations: 0,
        green_zones: 0,
        green_resources: 0,
        schools: 0,
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Get catalog error:', error);
      return {
        air_quality_stations: 0,
        weather_stations: 0,
        green_zones: 0,
        green_resources: 0,
        schools: 0,
        last_updated: new Date().toISOString(),
      };
    }
  },
};

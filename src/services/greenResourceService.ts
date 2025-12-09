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
  id: string; // UUID
  name: string;
  type: string;
  quantity: number;
  available_quantity: number;
  unit: string;
  status: string;
  expiry_date: string | null;
  is_public: boolean;
  data_uri: string | null;
  meta_data: any | null;
  zone_id: string;
  created_at: string;
  updated_at: string;
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
   * Lấy danh sách khu vực xanh công khai (công viên, rừng, vườn)
   */
  getPublicGreenZones: async (params?: GreenZoneParams): Promise<GreenZone[]> => {
    try {
      console.log('🌐 [API] GET /api/open-data/green-zones', params);
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<GreenZone[]>(`${baseUrl}/api/open-data/green-zones`, {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          zone_type: params?.zone_type,
        },
      });

      if (response.data) {
        console.log('✅ [API] Public green zones received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get public green zones error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Tìm khu vực xanh gần vị trí (Public)
   */
  getPublicNearbyGreenZones: async (params: NearbyParams): Promise<GreenZone[]> => {
    try {
      console.log('🌐 [API] GET /api/open-data/green-zones/nearby', {
        lat: params.latitude,
        lon: params.longitude,
        radius: params.radius
      });
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      // API uses lat/lon instead of latitude/longitude for this endpoint
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<GreenZone[]>(`${baseUrl}/api/open-data/green-zones/nearby`, {
        params: {
          lat: params.latitude,
          lon: params.longitude,
          radius: params.radius || 5,
          limit: params.limit || 10,
        },
      });

      if (response.data) {
        console.log('✅ [API] Public nearby green zones received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.warn('⚠️ [API] Green zones nearby endpoint parameter error. Check lat/lon params.');
      }
      console.error('❌ [API] Get public nearby green zones error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Lấy chi tiết khu vực xanh công khai
   */
  getPublicGreenZoneById: async (id: string): Promise<GreenZone | null> => {
    try {
      console.log('🌐 [API] GET /api/open-data/green-zones/' + id);
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<GreenZone>(`${baseUrl}/api/open-data/green-zones/${id}`);
      if (response.data) {
        console.log('✅ [API] Public green zone by ID received');
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('❌ [API] Get public green zone by ID error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return null;
    }
  },

  // ============================================================================
  // GREEN ZONES (Authenticated - requires auth)
  // ============================================================================

  /**
   * Lấy danh sách khu vực xanh (Authenticated)
   */
  getGreenZones: async (params?: GreenZoneParams): Promise<GreenZone[]> => {
    try {
      console.log('🌐 [API] GET /green-zones', params);
      // API trả về array trực tiếp, không có wrapper
      const response = await api.get<GreenZone[]>('/green-zones', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          zone_type: params?.zone_type,
        },
      });

      if (response.data) {
        console.log('✅ [API] Green zones (auth) received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get green zones error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Lấy chi tiết khu vực xanh theo ID (Authenticated)
   */
  getGreenZoneById: async (id: string): Promise<GreenZone | null> => {
    try {
      console.log('🌐 [API] GET /green-zones/' + id);
      // API trả về GreenZone object trực tiếp hoặc 503 error
      const response = await api.get<GreenZone>(`/green-zones/${id}`);

      if (response.data) {
        console.log('✅ [API] Green zone by ID received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get green zone by ID error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail
      });
      return null;
    }
  },

  /**
   * Tìm khu vực xanh gần vị trí (Authenticated)
   */
  getNearbyGreenZones: async (params: NearbyParams): Promise<GreenZone[]> => {
    try {
      console.log('🌐 [API] GET /green-zones/nearby', {
        lat: params.latitude,
        lon: params.longitude,
        radius: params.radius
      });

      const response = await api.get<GreenZone[]>('/green-zones/nearby', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 5,
          limit: params.limit || 10,
        },
      });

      if (response.data) {
        console.log('✅ [API] Nearby green zones (auth) received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get nearby green zones error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  // ============================================================================
  // GREEN RESOURCES (Public - no auth required)
  // ============================================================================

  /**
   * Lấy danh sách tài nguyên xanh công khai
   */
  getPublicGreenResources: async (params?: GreenResourceParams): Promise<any[]> => {
    try {
      console.log('🌐 [API] GET /api/open-data/green-resources', params);
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<any[]>(`${baseUrl}/api/open-data/green-resources`, {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          type: params?.type,
        },
      });

      if (response.data) {
        console.log('✅ [API] Public green resources received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get public green resources error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  // ============================================================================
  // GREEN RESOURCES (Authenticated - requires auth)
  // ============================================================================

  /**
   * Lấy danh sách tài nguyên xanh (Authenticated)
   */
  getGreenResources: async (params?: GreenResourceParams): Promise<any[]> => {
    try {
      console.log('🌐 [API] GET /green-resources', params);
      // API trả về array trực tiếp, không có wrapper
      const response = await api.get<any[]>('/green-resources', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          type: params?.type,
        },
      });

      if (response.data) {
        console.log('✅ [API] Green resources (auth) received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get green resources error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Lấy chi tiết tài nguyên xanh (Authenticated)
   */
  getGreenResourceById: async (id: string): Promise<any | null> => {
    try {
      console.log('🌐 [API] GET /green-resources/' + id);
      // API trả về object trực tiếp hoặc 503 error
      const response = await api.get<any>(`/green-resources/${id}`);

      if (response.data) {
        console.log('✅ [API] Green resource by ID received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get green resource by ID error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail
      });
      return null;
    }
  },

  // ============================================================================
  // RECYCLING CENTERS
  // ============================================================================

  /**
   * Lấy danh sách trung tâm tái chế công khai
   */
  getPublicCenters: async (params?: { skip?: number; limit?: number }): Promise<any[]> => {
    try {
      console.log('🌐 [API] GET /api/open-data/centers', params);
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<any[]>(`${baseUrl}/api/open-data/centers`, {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
        },
      });

      if (response.data) {
        console.log('✅ [API] Public centers received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get public centers error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Tìm trung tâm tái chế gần vị trí (Public)
   */
  getPublicNearbyCenters: async (params: NearbyParams): Promise<any[]> => {
    try {
      console.log('🌐 [API] GET /api/open-data/centers/nearby', params);
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<any[]>(`${baseUrl}/api/open-data/centers/nearby`, {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius_km: params.radius || 10,
          limit: params.limit || 10,
        },
      });

      if (response.data) {
        console.log('✅ [API] Public nearby centers received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get public nearby centers error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  /**
   * Lấy danh sách trung tâm tái chế (Authenticated)
   */
  getCenters: async (params?: { skip?: number; limit?: number }): Promise<any[]> => {
    try {
      console.log('🌐 [API] GET /centers', params);
      // API trả về array trực tiếp, không có wrapper
      const response = await api.get<any[]>('/centers', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
        },
      });

      if (response.data) {
        console.log('✅ [API] Centers (auth) received:', response.data.length, 'items');
        return response.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get centers error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  // ============================================================================
  // CATALOG & EXPORT (Public - no auth required)
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
      console.log('🌐 [API] GET /api/open-data/catalog');
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<{
        datasets: Array<{
          id: string;
          title: string;
          category: string;
          formats: string[];
          api_endpoint: string;
        }>;
      }>(`${baseUrl}/api/open-data/catalog`);

      if (response.data && response.data.datasets) {
        console.log('✅ [API] Catalog received:', response.data.datasets.length, 'datasets');
        return response.data;
      }

      return {
        datasets: [],
      };
    } catch (error: any) {
      console.error('❌ [API] Get catalog error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return {
        datasets: [],
      };
    }
  },

  /**
   * Xuất dữ liệu AQI (placeholder endpoint)
   */
  exportAirQuality: async (format: 'json' | 'csv' | 'geojson' = 'json'): Promise<any> => {
    try {
      console.log('🌐 [API] GET /api/open-data/export/air-quality', { format });
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<any>(`${baseUrl}/api/open-data/export/air-quality`, {
        params: { format },
      });

      if (response.data) {
        console.log('✅ [API] Export data received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Export air quality error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return null;
    }
  },
};

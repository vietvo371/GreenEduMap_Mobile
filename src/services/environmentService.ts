/**
 * Environment Service - Air Quality & Weather Data
 * Handles environmental data from GreenEduMap API
 */

import api from '../utils/Api';
import { ApiResponse } from '../types/api';

// ============================================================================
// TYPES
// ============================================================================

export interface AirQualityData {
  id: string; // UUID
  latitude: number;
  longitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  source: string;
  station_name: string;
  station_id: string | null;
  measurement_date: string;
  created_at: string;
}

export interface WeatherData {
  id: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  city_name: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind: {
    speed: number;
    direction: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  observation_time: string;
  source: string;
}

export interface WeatherForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  pop: number; // Probability of precipitation
  wind_speed: number;
}

export interface AirQualityParams {
  skip?: number;
  limit?: number;
  city?: string;
}

export interface WeatherParams {
  skip?: number;
  limit?: number;
  city?: string;
}

export interface CurrentWeatherParams {
  lat: number;
  lon: number;
  fetch_new?: boolean;
}

// ============================================================================
// SERVICE
// ============================================================================

export const environmentService = {
  // ============================================================================
  // AIR QUALITY
  // ============================================================================

  /**
   * Lấy danh sách dữ liệu chất lượng không khí với phân trang
   */
  getAirQuality: async (params?: AirQualityParams): Promise<{ data: AirQualityData[]; total: number; skip: number; limit: number }> => {
    try {
      console.log('🌐 [API] GET /air-quality', params);
      // API trả về: { total, skip, limit, data: [] }
      const response = await api.get<{
        total: number;
        skip: number;
        limit: number;
        data: AirQualityData[];
      }>('/air-quality', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          city: params?.city,
        },
      });

      if (response.data) {
        console.log('✅ [API] Air quality data received:', response.data.data.length, 'items');
        return response.data;
      }

      return { data: [], total: 0, skip: 0, limit: 10 };
    } catch (error: any) {
      console.error('❌ [API] Get air quality error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return { data: [], total: 0, skip: 0, limit: 10 };
    }
  },

  /**
   * Lấy dữ liệu AQI mới nhất (24 giờ qua)
   */
  getLatestAirQuality: async (limit: number = 10): Promise<{ total: number; data: AirQualityData[] }> => {
    try {
      console.log('🌐 [API] GET /air-quality/latest', { limit });
      // API trả về: { total, data: [] }
      const response = await api.get<{ total: number; data: AirQualityData[] }>('/air-quality/latest', {
        params: { limit },
      });

      console.log('📥 [API] Response:', {
        status: response.status,
        total: response.data?.total || 0,
        dataLength: response.data?.data?.length || 0
      });

      if (response.data && response.data.data) {
        console.log('✅ [API] Latest AQI data received:', response.data.data.length, 'items');
        return response.data;
      }

      return { total: 0, data: [] };
    } catch (error: any) {
      console.error('❌ [API] Get latest air quality error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return { total: 0, data: [] };
    }
  },

  /**
   * Lấy bản ghi chất lượng không khí theo ID
   * Note: ID phải là UUID string, không phải number
   */
  getAirQualityById: async (id: string): Promise<AirQualityData | null> => {
    try {
      console.log('🌐 [API] GET /air-quality/' + id);
      // API trả về object trực tiếp hoặc error
      const response = await api.get<AirQualityData>(`/air-quality/${id}`);

      if (response.data) {
        console.log('✅ [API] Air quality by ID received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get air quality by ID error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail
      });
      return null;
    }
  },

  /**
   * Tìm dữ liệu AQI gần vị trí
   */
  getAirQualityByLocation: async (
    lat: number,
    lon: number,
    radius: number = 50,
    limit: number = 10
  ): Promise<{ data: AirQualityData[]; total: number } | null> => {
    try {
      console.log('🌐 [API] GET /air-quality/location', { lat, lon, radius, limit });
      const response = await api.get<{ data: AirQualityData[]; total: number }>('/air-quality/location', {
        params: { lat, lon, radius, limit },
      });

      if (response.data) {
        console.log('✅ [API] Air quality by location received:', response.data.data.length, 'items');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get air quality by location error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail,
      });
      return null;
    }
  },

  /**
   * Lấy dữ liệu AQI lịch sử cho một vị trí
   */
  getAirQualityHistory: async (
    lat: number,
    lon: number,
    days: number = 7,
    radius: number = 10
  ): Promise<{ data: AirQualityData[]; total: number } | null> => {
    try {
      console.log('🌐 [API] GET /air-quality/history', { lat, lon, days, radius });
      const response = await api.get<{ data: AirQualityData[]; total: number }>('/air-quality/history', {
        params: { lat, lon, days, radius },
      });

      if (response.data) {
        console.log('✅ [API] Air quality history received:', response.data.data.length, 'items');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get air quality history error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail,
      });
      return null;
    }
  },

  // ============================================================================
  // WEATHER
  // ============================================================================

  /**
   * Lấy dữ liệu thời tiết với phân trang
   */
  getWeather: async (params?: WeatherParams): Promise<{ data: WeatherData[]; total: number; skip: number; limit: number }> => {
    try {
      console.log('🌐 [API] GET /weather', params);
      // API trả về: { total, skip, limit, data: [] }
      const response = await api.get<{
        total: number;
        skip: number;
        limit: number;
        data: WeatherData[];
      }>('/weather', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          city: params?.city,
        },
      });

      if (response.data) {
        console.log('✅ [API] Weather data received:', response.data.data.length, 'items');
        return response.data;
      }

      return { data: [], total: 0, skip: 0, limit: 10 };
    } catch (error: any) {
      console.error('❌ [API] Get weather error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return { data: [], total: 0, skip: 0, limit: 10 };
    }
  },

  /**
   * Lấy dữ liệu thời tiết hiện tại theo toạ độ (Authenticated)
   */
  getCurrentWeather: async (params: CurrentWeatherParams): Promise<WeatherData | null> => {
    try {
      console.log('🌐 [API] GET /weather/current', params);
      // API trả về WeatherData object trực tiếp
      const response = await api.get<WeatherData>('/weather/current', {
        params: {
          lat: params.lat,
          lon: params.lon,
          fetch_new: params.fetch_new || false,
        },
      });

      if (response.data) {
        console.log('✅ [API] Current weather data received');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get current weather error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return null;
    }
  },

  /**
   * Lấy dữ liệu thời tiết gần vị trí
   */
  getWeatherByLocation: async (
    lat: number,
    lon: number,
    radius: number = 50,
    hours: number = 24
  ): Promise<{ data: WeatherData[]; total: number } | null> => {
    try {
      console.log('🌐 [API] GET /weather/location', { lat, lon, radius, hours });
      const response = await api.get<{ data: WeatherData[]; total: number }>('/weather/location', {
        params: { lat, lon, radius, hours },
      });

      if (response.data) {
        console.log('✅ [API] Weather by location received:', response.data.data.length, 'items');
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get weather by location error:', {
        message: error.message,
        status: error.response?.status,
        detail: error.response?.data?.detail,
      });
      return null;
    }
  },

  // ============================================================================
  // PUBLIC ENDPOINTS (không cần authentication)
  // ============================================================================

  /**
   * Lấy dữ liệu AQI công khai
   */
  getPublicAirQuality: async (params?: { limit?: number; city?: string }): Promise<{ data: AirQualityData[]; total: number }> => {
    try {
      console.log('🌐 [API] GET /api/open-data/air-quality', params);
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<{ total: number; data: AirQualityData[] }>(
        `${baseUrl}/api/open-data/air-quality`,
        {
          params: {
            limit: params?.limit || 10,
            city: params?.city,
          },
        }
      );

      if (response.data && response.data.data) {
        console.log('✅ [API] Public AQI data received:', response.data.data.length, 'items');
        return {
          data: response.data.data,
          total: response.data.total,
        };
      }

      return { data: [], total: 0 };
    } catch (error: any) {
      console.error('❌ [API] Get public air quality error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return { data: [], total: 0 };
    }
  },

  /**
   * Lấy dữ liệu AQI gần vị trí cụ thể (Public)
   */
  getPublicAirQualityByLocation: async (
    lat: number,
    lon: number,
    radius: number = 50
  ): Promise<{ data: AirQualityData[]; total: number; location: { lat: number; lon: number }; radius_km: number }> => {
    try {
      console.log('🌐 [API] GET /api/open-data/air-quality/location', { lat, lon, radius });
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<{
        location: { lat: number; lon: number };
        radius_km: number;
        total: number;
        data: AirQualityData[];
      }>(`${baseUrl}/api/open-data/air-quality/location`, {
        params: { lat, lon, radius },
      });

      if (response.data) {
        console.log('✅ [API] Public AQI location data received:', response.data.data.length, 'items');
        return response.data;
      }

      return {
        location: { lat, lon },
        radius_km: radius,
        total: 0,
        data: [],
      };
    } catch (error: any) {
      console.error('❌ [API] Get public air quality by location error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return {
        location: { lat, lon },
        radius_km: radius,
        total: 0,
        data: [],
      };
    }
  },

  /**
   * Lấy thời tiết hiện tại công khai
   */
  getPublicCurrentWeather: async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      console.log('🌐 [API] GET /api/open-data/weather/current', { lat, lon });
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      // Need to use absolute URL to bypass /api/v1 baseURL
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<WeatherData>(`${baseUrl}/api/open-data/weather/current`, {
        params: { lat, lon },
      });

      console.log('📥 [API] Response:', {
        status: response.status,
        hasData: !!response.data
      });

      if (response.data) {
        console.log('✅ [API] Public weather data:', {
          location: response.data.location,
          temp: response.data.temperature,
          humidity: response.data.humidity,
          weather: response.data.weather
        });
        return response.data;
      }

      return null;
    } catch (error: any) {
      console.error('❌ [API] Get public weather error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      return null;
    }
  },

  /**
   * Lấy dự báo thời tiết 7 ngày
   */
  getWeatherForecast: async (lat: number, lon: number): Promise<WeatherForecast[]> => {
    try {
      console.log('🌐 [API] GET /api/open-data/weather/forecast', { lat, lon });
      // Public endpoints are at /api/open-data, not /api/v1/open-data
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<any>(`${baseUrl}/api/open-data/weather/forecast`, {
        params: { lat, lon },
      });

      if (response.data && response.data.list) {
        console.log('✅ [API] Forecast data received:', response.data.list.length, 'items');
        // Transform OpenWeather format to our WeatherForecast format
        const forecastData: WeatherForecast[] = response.data.list.map((item: any) => ({
          date: item.dt_txt,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          weather_main: item.weather[0].main,
          weather_description: item.weather[0].description,
          weather_icon: item.weather[0].icon,
          pop: item.pop || 0,
          wind_speed: item.wind.speed,
        }));
        return forecastData;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get weather forecast error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },
};

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
  id: number;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  status: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  timestamp: string;
  source: string;
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
  getAirQuality: async (params?: AirQualityParams): Promise<{ data: AirQualityData[]; total: number }> => {
    try {
      const response = await api.get<ApiResponse<{ items: AirQualityData[]; total: number }>>('/air-quality', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          city: params?.city,
        },
      });

      if (response.data.success && response.data.data) {
        return {
          data: response.data.data.items,
          total: response.data.data.total,
        };
      }

      throw new Error('Không thể lấy dữ liệu chất lượng không khí');
    } catch (error) {
      console.error('Get air quality error:', error);
      throw error;
    }
  },

  /**
   * Lấy dữ liệu AQI mới nhất (24 giờ qua)
   */
  getLatestAirQuality: async (limit: number = 10): Promise<AirQualityData[]> => {
    try {
      console.log('🌐 [API] GET /air-quality/latest', { limit });
      const response = await api.get<ApiResponse<{ total: number; data: AirQualityData[] }>>('/air-quality/latest', {
        params: { limit },
      });

      console.log('📥 [API] Response:', {
        status: response.status,
        success: response.data.success,
        total: response.data.data?.total || 0,
        dataLength: response.data.data?.data?.length || 0
      });

      if (response.data.success && response.data.data && response.data.data.data) {
        console.log('✅ [API] Latest AQI data received:', response.data.data.data);
        return response.data.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ [API] Get latest air quality error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return [];
    }
  },

  /**
   * Lấy bản ghi chất lượng không khí theo ID
   */
  getAirQualityById: async (id: number): Promise<AirQualityData> => {
    try {
      const response = await api.get<ApiResponse<AirQualityData>>(`/air-quality/${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy dữ liệu chất lượng không khí');
    } catch (error) {
      console.error('Get air quality by ID error:', error);
      throw error;
    }
  },

  // ============================================================================
  // WEATHER
  // ============================================================================

  /**
   * Lấy dữ liệu thời tiết với phân trang
   */
  getWeather: async (params?: WeatherParams): Promise<{ data: WeatherData[]; total: number }> => {
    try {
      const response = await api.get<ApiResponse<{ items: WeatherData[]; total: number }>>('/weather', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          city: params?.city,
        },
      });

      if (response.data.success && response.data.data) {
        return {
          data: response.data.data.items,
          total: response.data.data.total,
        };
      }

      throw new Error('Không thể lấy dữ liệu thời tiết');
    } catch (error) {
      console.error('Get weather error:', error);
      throw error;
    }
  },

  /**
   * Lấy dữ liệu thời tiết hiện tại theo toạ độ
   */
  getCurrentWeather: async (params: CurrentWeatherParams): Promise<WeatherData> => {
    try {
      const response = await api.get<ApiResponse<WeatherData>>('/weather/current', {
        params: {
          lat: params.lat,
          lon: params.lon,
          fetch_new: params.fetch_new || false,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy dữ liệu thời tiết hiện tại');
    } catch (error) {
      console.error('Get current weather error:', error);
      throw error;
    }
  },

  // ============================================================================
  // PUBLIC ENDPOINTS (không cần authentication)
  // ============================================================================

  /**
   * Lấy dữ liệu AQI công khai
   */
  getPublicAirQuality: async (params?: { limit?: number; city?: string }): Promise<AirQualityData[]> => {
    try {
      const response = await api.get<ApiResponse<AirQualityData[]>>('/open-data/air-quality', {
        params: {
          limit: params?.limit || 10,
          city: params?.city,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Get public air quality error:', error);
      return [];
    }
  },

  /**
   * Lấy thời tiết hiện tại công khai
   */
  getPublicCurrentWeather: async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
      console.log('🌐 [API] GET /open-data/weather/current', { lat, lon });
      // API trả về data trực tiếp (không có wrapper ApiResponse)
      const response = await api.get<WeatherData>('/open-data/weather/current', {
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
        status: error.response?.status
      });
      return null;
    }
  },

  /**
   * Lấy dự báo thời tiết 7 ngày
   */
  getWeatherForecast: async (lat: number, lon: number): Promise<WeatherForecast[]> => {
    try {
      // API trả về full OpenWeather response structure
      const response = await api.get<any>('/open-data/weather/forecast', {
        params: { lat, lon },
      });

      if (response.data && response.data.list) {
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
    } catch (error) {
      console.error('Get weather forecast error:', error);
      return [];
    }
  },
};

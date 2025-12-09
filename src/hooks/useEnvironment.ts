/**
 * Custom hook for Environment Data
 * Handles Air Quality and Weather data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { environmentService } from '../services';
import type {
  AirQualityData,
  WeatherData,
  WeatherForecast,
  CurrentWeatherParams,
} from '../types/api';

// ============================================================================
// AIR QUALITY HOOKS
// ============================================================================

export const useLatestAirQuality = (limit: number = 10) => {
  const [data, setData] = useState<AirQualityData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useLatestAirQuality] Fetching AQI data, limit:', limit);
      // API trả về { total, data: [] }
      const result = await environmentService.getLatestAirQuality(limit);
      console.log('✅ [useLatestAirQuality] Success! Received', result.data.length, 'records, total:', result.total);
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu AQI');
      console.error('❌ [useLatestAirQuality] Error:', err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
};

export const usePublicAirQuality = (params?: { limit?: number; city?: string }) => {
  const [data, setData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await environmentService.getPublicAirQuality(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu AQI');
      console.error('Fetch public AQI error:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.limit, params?.city]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ============================================================================
// WEATHER HOOKS
// ============================================================================

export const useCurrentWeather = (params: CurrentWeatherParams | null) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useCurrentWeather] Fetching weather data for:', { lat: params.lat, lon: params.lon });
      const result = await environmentService.getCurrentWeather(params);
      console.log('✅ [useCurrentWeather] Success!');
      console.log('🌡️ [useCurrentWeather] Weather:', {
        location: result.location,
        temp: result.temperature,
        humidity: result.humidity,
        description: result.weather_description
      });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thời tiết');
      console.error('❌ [useCurrentWeather] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.lat, params?.lon, params?.fetch_new]);

  useEffect(() => {
    if (params) {
      fetchData();
    }
  }, [fetchData, params]);

  return { data, loading, error, refetch: fetchData };
};

export const usePublicCurrentWeather = (lat: number | null, lon: number | null) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (lat === null || lon === null) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [usePublicCurrentWeather] Fetching public weather for:', { lat, lon });
      const result = await environmentService.getPublicCurrentWeather(lat, lon);
      console.log('✅ [usePublicCurrentWeather] Success!');
      console.log('🌤️ [usePublicCurrentWeather] Data:', {
        location: result?.location,
        temp: result?.temperature,
        humidity: result?.humidity,
        weather: result?.weather_main
      });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thời tiết');
      console.error('❌ [usePublicCurrentWeather] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchData();
    }
  }, [fetchData, lat, lon]);

  return { data, loading, error, refetch: fetchData };
};

export const useWeatherForecast = (lat: number | null, lon: number | null) => {
  const [data, setData] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (lat === null || lon === null) return;

    try {
      setLoading(true);
      setError(null);
      const result = await environmentService.getWeatherForecast(lat, lon);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dự báo thời tiết');
      console.error('Fetch weather forecast error:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchData();
    }
  }, [fetchData, lat, lon]);

  return { data, loading, error, refetch: fetchData };
};

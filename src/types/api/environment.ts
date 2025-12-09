/**
 * Environment API Types
 * Types for Air Quality, Weather, Schools, Green Zones & Resources
 */

// ============================================================================
// AIR QUALITY
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
  so2: number;
  o3: number;
  source: string;
  station_name: string;
  station_id?: string | null;
  measurement_date: string;
  created_at: string;
}

export interface AirQualityParams {
  skip?: number;
  limit?: number;
  city?: string;
}

// ============================================================================
// WEATHER
// ============================================================================

export interface WeatherData {
  id: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  latitude?: number;
  longitude?: number;
  city_name: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  // Authenticated endpoint có wind_speed/wind_direction riêng
  wind_speed?: number;
  wind_direction?: number;
  // Public endpoint có wind object
  wind?: {
    speed: number;
    direction: number;
  };
  clouds?: number | null;
  visibility?: number;
  weather_main?: string;
  weather_description?: string;
  // Public endpoint có weather object
  weather?: {
    main: string;
    description: string;
    icon: string;
  };
  observation_time: string;
  source: string;
  created_at?: string;
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
// SCHOOLS
// ============================================================================

export interface School {
  id: string; // UUID
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
  category: 'climate_change' | 'renewable_energy' | 'sustainability' | 'environmental_science' | 'other' | string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks?: number;
  duration_hours?: number;
  lessons_count?: number;
  color?: string;
  icon?: string;
  max_students?: number;
  syllabus?: any | null;
  meta_data?: any | null;
  is_public?: boolean;
  school_id?: string;
  created_at?: string;
  updated_at?: string | null;
  progress?: number; // User's progress (0-100)
}

export interface SchoolQueryParams {
  skip?: number;
  limit?: number;
  district?: string;
  city?: string;
  type?: School['type'];
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
  difficulty?: string;
}

// ============================================================================
// GREEN ZONES & RESOURCES
// ============================================================================

export interface GreenZone {
  id: string; // UUID
  name: string;
  code?: string;
  zone_type: 'park' | 'forest' | 'garden' | 'street' | 'botanical' | 'wetland' | 'reserve' | 'other';
  latitude: number;
  longitude: number;
  address?: string;
  area_sqm?: number;
  tree_count?: number;
  vegetation_coverage?: number | null;
  maintained_by?: string | null;
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
// CATALOG
// ============================================================================

export interface DataCatalog {
  air_quality_stations: number;
  weather_stations: number;
  green_zones: number;
  green_resources: number;
  schools: number;
  last_updated: string;
}

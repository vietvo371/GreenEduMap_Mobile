/**
 * Environment API Types
 * Types for Air Quality, Weather, Schools, Green Zones & Resources
 */

// ============================================================================
// AIR QUALITY
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
  difficulty?: string;
}

// ============================================================================
// GREEN ZONES & RESOURCES
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

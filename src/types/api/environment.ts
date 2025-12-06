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
  id: number;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  visibility: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  timestamp: string;
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
  progress?: number; // User's progress (0-100)
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
// GREEN ZONES & RESOURCES
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

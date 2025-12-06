/**
 * Services Index
 * Central export for all API services
 */

export { authService } from './authService';
export { environmentService } from './environmentService';
export { schoolService } from './schoolService';
export { greenResourceService } from './greenResourceService';
export { aiTaskService } from './aiTaskService';
export { healthService } from './healthService';

// Export types
export type {
  // Environment types
  AirQualityData,
  WeatherData,
  WeatherForecast,
  AirQualityParams,
  WeatherParams,
  CurrentWeatherParams,
} from './environmentService';

export type {
  // School types
  School,
  GreenCourse,
  SchoolParams,
  NearbySchoolParams,
  GreenCourseParams,
} from './schoolService';

export type {
  // Green Resource types
  GreenZone,
  GreenResource,
  GreenZoneParams,
  GreenResourceParams,
  NearbyParams,
} from './greenResourceService';

export type {
  // AI Task types
  AITask,
  ClusteringTaskRequest,
  PredictionTaskRequest,
  CorrelationTaskRequest,
  ExportTaskRequest,
} from './aiTaskService';

export type {
  // Health types
  HealthStatus,
} from './healthService';

/**
 * Health Service - System Health Check
 * Handles health check for API Gateway and services
 */

import api from '../utils/Api';

// ============================================================================
// TYPES
// ============================================================================

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  gateway?: 'healthy' | 'unhealthy' | 'degraded';
  services?: {
    environment?: 'healthy' | 'unhealthy' | 'degraded';
    auth?: 'healthy' | 'unhealthy' | 'degraded';
    education?: 'healthy' | 'unhealthy' | 'degraded';
    resource?: 'healthy' | 'unhealthy' | 'degraded';
  };
  messaging?: {
    rabbitmq?: 'connected' | 'disconnected';
  };
  timestamp?: string;
  version?: string;
  uptime?: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export const healthService = {
  /**
   * Kiểm tra trạng thái API Gateway và các services
   * Note: /health endpoint is at root level, not under /api/v1
   */
  checkHealth: async (): Promise<HealthStatus> => {
    try {
      // Need to use full URL since /health is not under /api/v1
      const baseUrl = api.defaults.baseURL?.replace('/api/v1', '') || '';
      const response = await api.get<HealthStatus>(`${baseUrl}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        gateway: 'unhealthy',
        services: {
          environment: 'unhealthy',
          auth: 'unhealthy',
          education: 'unhealthy',
          resource: 'unhealthy',
        },
      };
    }
  },
};

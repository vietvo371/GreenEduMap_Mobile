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
  timestamp: string;
  services: {
    api: 'up' | 'down';
    database: 'up' | 'down';
    redis?: 'up' | 'down';
    ai_service?: 'up' | 'down';
  };
  version?: string;
  uptime?: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export const healthService = {
  /**
   * Kiểm tra trạng thái API Gateway và các services
   */
  checkHealth: async (): Promise<HealthStatus> => {
    try {
      const response = await api.get<HealthStatus>('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          api: 'down',
          database: 'down',
        },
      };
    }
  },
};

/**
 * AI Task Service - AI Processing Tasks
 * Handles AI tasks like clustering, prediction, and correlation analysis
 */

import api from '../utils/Api';
import { ApiResponse } from '../types/api';

// ============================================================================
// TYPES
// ============================================================================

export interface AITask {
  task_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface ClusteringTaskRequest {
  data_type: 'environment' | 'schools' | 'weather';
  n_clusters: number;
  method?: 'kmeans' | 'dbscan' | 'hierarchical';
}

export interface PredictionTaskRequest {
  prediction_type: 'air_quality' | 'weather' | 'temperature';
  location_id?: string;
  latitude?: number;
  longitude?: number;
  days_ahead?: number;
}

export interface CorrelationTaskRequest {
  analysis_type: 'pearson' | 'spearman' | 'kendall';
  variables?: string[];
}

export interface ExportTaskRequest {
  data_type: 'schools' | 'air_quality' | 'weather' | 'green_zones' | 'green_resources';
  format: 'csv' | 'json' | 'excel';
  filters?: Record<string, any>;
}

// ============================================================================
// SERVICE
// ============================================================================

export const aiTaskService = {
  // ============================================================================
  // AI TASKS
  // ============================================================================

  /**
   * Tạo tác vụ phân cụm AI
   */
  queueClusteringTask: async (request: ClusteringTaskRequest): Promise<AITask> => {
    try {
      const response = await api.post<ApiResponse<AITask>>('/tasks/ai/clustering', request);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể tạo tác vụ phân cụm');
    } catch (error) {
      console.error('Queue clustering task error:', error);
      throw error;
    }
  },

  /**
   * Tạo tác vụ dự đoán AI (ví dụ: dự báo AQI)
   */
  queuePredictionTask: async (request: PredictionTaskRequest): Promise<AITask> => {
    try {
      const response = await api.post<ApiResponse<AITask>>('/tasks/ai/prediction', request);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể tạo tác vụ dự đoán');
    } catch (error) {
      console.error('Queue prediction task error:', error);
      throw error;
    }
  },

  /**
   * Tạo tác vụ phân tích tương quan AI
   */
  queueCorrelationTask: async (request: CorrelationTaskRequest): Promise<AITask> => {
    try {
      const response = await api.post<ApiResponse<AITask>>('/tasks/ai/correlation', request);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể tạo tác vụ phân tích tương quan');
    } catch (error) {
      console.error('Queue correlation task error:', error);
      throw error;
    }
  },

  /**
   * Tạo tác vụ xuất dữ liệu
   */
  queueExportTask: async (request: ExportTaskRequest): Promise<AITask> => {
    try {
      const response = await api.post<ApiResponse<AITask>>('/tasks/export', request);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể tạo tác vụ xuất dữ liệu');
    } catch (error) {
      console.error('Queue export task error:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái tác vụ
   */
  getTaskStatus: async (taskId: string): Promise<AITask> => {
    try {
      const response = await api.get<ApiResponse<AITask>>(`/tasks/${taskId}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy trạng thái tác vụ');
    } catch (error) {
      console.error('Get task status error:', error);
      throw error;
    }
  },

  /**
   * Lấy kết quả tác vụ đã hoàn thành
   */
  getTaskResult: async (taskId: string): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(`/tasks/${taskId}/result`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Không thể lấy kết quả tác vụ');
    } catch (error) {
      console.error('Get task result error:', error);
      throw error;
    }
  },

  /**
   * Hủy tác vụ đang chờ hoặc đang xử lý
   */
  cancelTask: async (taskId: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Cancel task error:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách tác vụ của người dùng
   */
  getUserTasks: async (params?: { skip?: number; limit?: number; status?: AITask['status'] }): Promise<{
    data: AITask[];
    total: number;
  }> => {
    try {
      const response = await api.get<ApiResponse<{ items: AITask[]; total: number }>>('/tasks', {
        params: {
          skip: params?.skip || 0,
          limit: params?.limit || 10,
          status: params?.status,
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return { data: [], total: 0 };
    } catch (error) {
      console.error('Get user tasks error:', error);
      return { data: [], total: 0 };
    }
  },
};

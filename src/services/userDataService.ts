/**
 * User Data Service - Favorites, Contributions, Activities, Settings
 * Handles user-specific data from GreenEduMap API
 */

import api from '../utils/Api';

// ============================================================================
// TYPES
// ============================================================================

export interface Favorite {
    target_type: string;
    target_id: string;
    note: string;
    is_public: boolean;
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface Contribution {
    type: string;
    title: string;
    description: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    is_public: boolean;
    data: any;
    id: string;
    user_id: string;
    status: string;
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Activity {
    action: string;
    target_type: string;
    target_id: string | null;
    description: string;
    extra_data: any | null;
    is_public: boolean;
    id: string;
    user_id: string;
    created_at: string;
}

export interface UserSettings {
    notification_enabled: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
    language: string;
    theme: string;
    default_city: string;
    default_latitude: number;
    default_longitude: number;
    privacy_level: string;
    data: any;
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface AddFavoriteRequest {
    item_type: string;
    item_id: string;
    item_name: string;
    notes?: string;
}

export interface SubmitContributionRequest {
    contribution_type: string;
    title: string;
    description: string;
    location_name?: string;
    latitude?: number;
    longitude?: number;
    extra_data?: any;
}

export interface LogActivityRequest {
    activity_type: string;
    description: string;
    resource_type: string;
    resource_id?: string;
}

export interface UpdateSettingsRequest {
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    push_notifications?: boolean;
    default_city?: string;
    aqi_alert_threshold?: number;
    weather_units?: string;
    map_style?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const userDataService = {
    // ============================================================================
    // FAVORITES
    // ============================================================================

    /**
     * Lấy danh sách địa điểm yêu thích của người dùng
     */
    getFavorites: async (): Promise<{ total: number; items: Favorite[] }> => {
        try {
            console.log('🌐 [API] GET /user-data/favorites');
            const response = await api.get<{ total: number; items: Favorite[] }>('/user-data/favorites');

            if (response.data) {
                console.log('✅ [API] Favorites received:', response.data.total, 'items');
                return response.data;
            }

            return { total: 0, items: [] };
        } catch (error: any) {
            console.error('❌ [API] Get favorites error:', {
                message: error.message,
                status: error.response?.status,
            });
            return { total: 0, items: [] };
        }
    },

    /**
     * Thêm địa điểm vào danh sách yêu thích
     */
    addFavorite: async (data: AddFavoriteRequest): Promise<Favorite | null> => {
        try {
            console.log('🌐 [API] POST /user-data/favorites', data);
            const response = await api.post<Favorite>('/user-data/favorites', data);

            if (response.data) {
                console.log('✅ [API] Favorite added successfully');
                return response.data;
            }

            return null;
        } catch (error: any) {
            console.error('❌ [API] Add favorite error:', {
                message: error.message,
                status: error.response?.status,
            });
            throw error;
        }
    },

    /**
     * Xóa địa điểm khỏi danh sách yêu thích
     */
    deleteFavorite: async (favoriteId: string): Promise<boolean> => {
        try {
            console.log('🌐 [API] DELETE /user-data/favorites/' + favoriteId);
            await api.delete(`/user-data/favorites/${favoriteId}`);
            console.log('✅ [API] Favorite deleted successfully');
            return true;
        } catch (error: any) {
            console.error('❌ [API] Delete favorite error:', {
                message: error.message,
                status: error.response?.status,
            });
            return false;
        }
    },

    // ============================================================================
    // CONTRIBUTIONS
    // ============================================================================

    /**
     * Lấy danh sách đóng góp của người dùng
     */
    getContributions: async (): Promise<{ total: number; items: Contribution[] }> => {
        try {
            console.log('🌐 [API] GET /user-data/contributions');
            const response = await api.get<{ total: number; items: Contribution[] }>('/user-data/contributions');

            if (response.data) {
                console.log('✅ [API] Contributions received:', response.data.total, 'items');
                return response.data;
            }

            return { total: 0, items: [] };
        } catch (error: any) {
            console.error('❌ [API] Get contributions error:', {
                message: error.message,
                status: error.response?.status,
            });
            return { total: 0, items: [] };
        }
    },

    /**
     * Gửi đóng góp mới (báo cáo, đề xuất, dữ liệu)
     */
    submitContribution: async (data: SubmitContributionRequest): Promise<Contribution | null> => {
        try {
            console.log('🌐 [API] POST /user-data/contributions', data);
            const response = await api.post<Contribution>('/user-data/contributions', data);

            if (response.data) {
                console.log('✅ [API] Contribution submitted successfully');
                return response.data;
            }

            return null;
        } catch (error: any) {
            console.error('❌ [API] Submit contribution error:', {
                message: error.message,
                status: error.response?.status,
            });
            throw error;
        }
    },

    /**
     * Lấy danh sách đóng góp công khai đã được duyệt
     */
    getPublicContributions: async (): Promise<{ total: number; items: Contribution[] }> => {
        try {
            console.log('🌐 [API] GET /user-data/contributions/public');
            const response = await api.get<{ total: number; items: Contribution[] }>('/user-data/contributions/public');

            if (response.data) {
                console.log('✅ [API] Public contributions received:', response.data.total, 'items');
                return response.data;
            }

            return { total: 0, items: [] };
        } catch (error: any) {
            console.error('❌ [API] Get public contributions error:', {
                message: error.message,
                status: error.response?.status,
            });
            return { total: 0, items: [] };
        }
    },

    // ============================================================================
    // ACTIVITIES
    // ============================================================================

    /**
     * Lấy lịch sử hoạt động của người dùng
     */
    getActivities: async (): Promise<{ total: number; items: Activity[] }> => {
        try {
            console.log('🌐 [API] GET /user-data/activities');
            const response = await api.get<{ total: number; items: Activity[] }>('/user-data/activities');

            if (response.data) {
                console.log('✅ [API] Activities received:', response.data.total, 'items');
                return response.data;
            }

            return { total: 0, items: [] };
        } catch (error: any) {
            console.error('❌ [API] Get activities error:', {
                message: error.message,
                status: error.response?.status,
            });
            return { total: 0, items: [] };
        }
    },

    /**
     * Ghi lại hoạt động của người dùng (tracking)
     */
    logActivity: async (data: LogActivityRequest): Promise<Activity | null> => {
        try {
            console.log('🌐 [API] POST /user-data/activities', data);
            const response = await api.post<Activity>('/user-data/activities', data);

            if (response.data) {
                console.log('✅ [API] Activity logged successfully');
                return response.data;
            }

            return null;
        } catch (error: any) {
            console.error('❌ [API] Log activity error:', {
                message: error.message,
                status: error.response?.status,
            });
            // Don't throw error for activity logging - it's not critical
            return null;
        }
    },

    // ============================================================================
    // SETTINGS
    // ============================================================================

    /**
     * Lấy cài đặt cá nhân của người dùng
     */
    getSettings: async (): Promise<UserSettings | null> => {
        try {
            console.log('🌐 [API] GET /user-data/settings');
            const response = await api.get<UserSettings>('/user-data/settings');

            if (response.data) {
                console.log('✅ [API] Settings received');
                return response.data;
            }

            return null;
        } catch (error: any) {
            console.error('❌ [API] Get settings error:', {
                message: error.message,
                status: error.response?.status,
            });
            return null;
        }
    },

    /**
     * Cập nhật cài đặt cá nhân
     */
    updateSettings: async (data: UpdateSettingsRequest): Promise<UserSettings | null> => {
        try {
            console.log('🌐 [API] PUT /user-data/settings', data);
            const response = await api.put<UserSettings>('/user-data/settings', data);

            if (response.data) {
                console.log('✅ [API] Settings updated successfully');
                return response.data;
            }

            return null;
        } catch (error: any) {
            console.error('❌ [API] Update settings error:', {
                message: error.message,
                status: error.response?.status,
            });
            throw error;
        }
    },
};

import api from '../utils/Api';
import { LoginRequest, LoginResponse, RegisterRequest, User, ChangePasswordRequest, ResetPasswordRequest, UpdateProfileRequest, ApiResponse } from '../types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';
const REFRESH_TOKEN_KEY = '@refresh_token';

export const authService = {
    // ============================================================================
    // AUTHENTICATION
    // ============================================================================

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Đăng nhập thất bại');
            }

            const data = response.data.data;
            if (data.access_token) {
                await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
            }
            if (data.refresh_token) {
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
            }
            if (data.user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Đăng ký thất bại');
            }

            const responseData = response.data.data;
            if (responseData.access_token) {
                await AsyncStorage.setItem(TOKEN_KEY, responseData.access_token);
            }
            if (responseData.refresh_token) {
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, responseData.refresh_token);
            }
            if (responseData.user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(responseData.user));
            }

            return responseData;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Ignore error on logout
        } finally {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY]);
        }
    },

    // ============================================================================
    // PROFILE MANAGEMENT
    // ============================================================================

    getProfile: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await api.put<ApiResponse<User>>('/auth/profile', data);
        console.log('Update profile response:', response.data);

        if (response.data.success && response.data.data) {
            // Update stored user data
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
            return response.data.data;
        }

        throw new Error('Cập nhật thông tin thất bại');
    },

    // ============================================================================
    // TOKEN MANAGEMENT
    // ============================================================================

    getToken: async (): Promise<string | null> => {
        return await AsyncStorage.getItem(TOKEN_KEY);
    },

    getUser: async (): Promise<User | null> => {
        const json = await AsyncStorage.getItem(USER_KEY);
        return json ? JSON.parse(json) : null;
    },

    refreshToken: async (): Promise<string> => {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<ApiResponse<{ token: string; refreshToken?: string }>>('/auth/refresh', {
            refresh_token: refreshToken
        });

        if (response.data.success && response.data.data.token) {
            await AsyncStorage.setItem(TOKEN_KEY, response.data.data.token);
            if (response.data.data.refreshToken) {
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.refreshToken);
            }
            return response.data.data.token;
        }

        throw new Error('Làm mới token thất bại');
    },

    // ============================================================================
    // PASSWORD MANAGEMENT
    // ============================================================================

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await api.post('/auth/change-password', data);
    },

    requestPasswordReset: async (email: string): Promise<void> => {
        await api.post('/auth/forgot-password', { email });
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await api.post('/auth/reset-password', data);
    },

    // ============================================================================
    // VERIFICATION
    // ============================================================================

    verifyEmail: async (code: string): Promise<void> => {
        await api.post('/auth/verify-email', { code });
    },

    verifyPhone: async (code: string): Promise<void> => {
        await api.post('/auth/verify-phone', { code });
    },

    verifyEkyc: async (data: any): Promise<any> => {
        const response = await api.post('/auth/ekyc/verify', data);
        return response.data;
    },

    // ============================================================================
    // NOTIFICATIONS
    // ============================================================================

    updateFcmToken: async (pushToken: string): Promise<void> => {
        await api.post('/auth/update-fcm-token', { push_token: pushToken });
    },
};


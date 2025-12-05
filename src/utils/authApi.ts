import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './Api';
import { EkycVerifyRequest, EkycVerifyResponse } from '../types/ekyc';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface SignInResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ============================================================================
// AUTH API SERVICE
// ============================================================================

class AuthApiService {
  private readonly TOKEN_KEY = '@auth_token';
  private readonly USER_KEY = '@user_data';
  private readonly REFRESH_TOKEN_KEY = '@refresh_token';

  /**
   * Sign in user
   */
  async signIn(credentials: { email: string; password: string }): Promise<SignInResponse> {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const { user, access_token, refresh_token, token_type } = response.data;

      // Save tokens and user data
      await this.saveToken(access_token);
      await this.saveRefreshToken(refresh_token);
      await this.saveUser(user);

      return { user, access_token, refresh_token, token_type };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign up new user
   */
  async signUp(userData: SignUpData): Promise<SignInResponse> {
    try {
      const response = await api.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        phone: userData.phone,
      });

      const { user, access_token, refresh_token, token_type } = response.data;

      // Save tokens and user data after registration
      await this.saveToken(access_token);
      await this.saveRefreshToken(refresh_token);
      await this.saveUser(user);

      console.log('Sign up successful:', response.data);
      return { user, access_token, refresh_token, token_type };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      // TODO: Call backend to invalidate token
      // await api.post('/auth/logout');

      // Clear local storage
      await AsyncStorage.multiRemove([
        this.TOKEN_KEY,
        this.USER_KEY,
        this.REFRESH_TOKEN_KEY,
      ]);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Verify eKYC
   */
  async verifyEkyc(data: EkycVerifyRequest): Promise<EkycVerifyResponse> {
    try {
      // TODO: Replace with real API call
      const response = await api.post('/auth/ekyc/verify', data);
      return response.data;
    } catch (error) {
      console.error('eKYC verification error:', error);
      throw error;
    }
  }

  /**
   * Load stored user data
   */
  async loadStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error loading stored user:', error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<{ access_token: string; refresh_token: string } | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken
      });
      const { access_token, refresh_token, token_type } = response.data;

      await this.saveToken(access_token);
      await this.saveRefreshToken(refresh_token);
      return { access_token, refresh_token };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      const user = response.data;

      await this.saveUser(user);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: { full_name?: string; phone?: string }): Promise<User> {
    try {
      const response = await api.put('/auth/profile', updates);
      const updatedUser = response.data;

      await this.saveUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      // TODO: Replace with real API call
      await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(identifier: string, type: 'email' | 'phone'): Promise<void> {
    try {
      // TODO: Replace with real API call
      await api.post('/auth/forgot-password', { identifier, type });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // TODO: Replace with real API call
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(identifier: string, otp: string, type: 'email' | 'phone'): Promise<{ token: string }> {
    try {
      // TODO: Replace with real API call
      const response = await api.post('/auth/verify-otp', {
        identifier,
        otp,
        type,
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(identifier: string, type: 'email' | 'phone'): Promise<void> {
    try {
      // TODO: Replace with real API call
      await api.post('/auth/resend-otp', { identifier, type });
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }

  // ============================================================================
  // TOKEN MANAGEMENT
  // ============================================================================

  /**
   * Save auth token
   */
  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  /**
   * Get auth token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Save refresh token
   */
  private async saveRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
    }
  }

  /**
   * Get refresh token
   */
  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Save user data
   */
  private async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const authApi = new AuthApiService();

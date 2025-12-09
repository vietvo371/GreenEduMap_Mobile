import { ApiResponse } from './common';

export type UserRole = 'citizen' | 'student' | 'teacher' | 'parent' | 'researcher' | 'admin' | 'verifier';

export interface User {
    id: string; // UUID
    username?: string;
    email: string;
    full_name: string;
    phone?: string;
    avatar?: string | null;
    role?: string;
    is_active?: boolean;
    is_verified?: boolean;
    is_public?: boolean;
    created_at: string;
    updated_at?: string;
    last_login?: string;
}

// Extended user stats - NOT from API yet, for future implementation
export interface UserStats {
    points?: number; // Environmental points
    carbon_saved?: number; // Total CO2 saved (kg)
    actions_count?: number; // Total green actions
    badge_level?: number;
    badge_level_text?: string;
    trees_planted?: number;
    water_saved?: number; // liters
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in?: number;
    user?: User; // Optional - will be fetched separately
}

export interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    password_confirmation?: string;
    full_name: string;
    phone: string;
    role?: UserRole;
}

export interface UpdateProfileRequest {
    full_name?: string;
    phone?: string;
    avatar?: string; // base64 image or URL
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export interface ResetPasswordRequest {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface VerifyCodeRequest {
    code: string;
}

export interface UpdateFcmTokenRequest {
    push_token: string;
}


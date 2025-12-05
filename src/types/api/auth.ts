import { ApiResponse } from './common';

export type UserRole = 'student' | 'teacher' | 'parent' | 'researcher' | 'admin' | 'verifier';

export interface User {
    id: number;
    username?: string;
    email: string;
    full_name: string;
    phone?: string;
    avatar?: string | null;
    role?: UserRole;
    email_verified?: boolean;
    phone_verified?: boolean;
    ekyc_verified?: boolean;
    points?: number; // Environmental points
    carbon_saved?: number; // Total CO2 saved
    badge_level?: number;
    badge_level_text?: string;
    created_at: string;
    updated_at?: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
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


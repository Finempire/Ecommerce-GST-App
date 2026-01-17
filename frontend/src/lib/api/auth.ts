// Authentication API Service

import apiClient, { ApiResponse } from './client';

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    subscription_plan: string;
    gstin?: string;
    business_name?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email?: string;
    whatsapp_number?: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: string;
    whatsapp_number?: string;
    gstin?: string;
    business_name?: string;
}

export const authApi = {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data, false);

        if (response.success && response.data) {
            // Store token and user data
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    },

    /**
     * Login with email/whatsapp and password
     */
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials, false);

        if (response.success && response.data) {
            // Store token and user data
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    },

    /**
     * Logout - clear stored data
     */
    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
        return apiClient.post('/auth/forgot-password', { email }, false);
    },

    /**
     * Reset password with token
     */
    async resetPassword(token: string, new_password: string): Promise<ApiResponse<{ message: string }>> {
        return apiClient.post('/auth/reset-password', { token, new_password }, false);
    },

    /**
     * Get current user from storage
     */
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;

        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('auth_token');
    },

    /**
     * Get auth token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    },
};

export default authApi;

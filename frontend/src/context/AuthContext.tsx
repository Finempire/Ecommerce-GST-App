'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, User, LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
    register: (data: RegisterData) => Promise<ApiResponse<AuthResponse>>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = authApi.getCurrentUser();
                if (storedUser && authApi.isAuthenticated()) {
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
        setIsLoading(true);
        try {
            const response = await authApi.login(credentials);
            if (response.success && response.data) {
                setUser(response.data.user);
            }
            return response;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
        setIsLoading(true);
        try {
            const response = await authApi.register(data);
            if (response.success && response.data) {
                setUser(response.data.user);
            }
            return response;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        authApi.logout();
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useAuth();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                window.location.href = '/login';
            }
        }, [isAuthenticated, isLoading]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}

export default AuthContext;

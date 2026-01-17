// User entity types

export type UserRole = 'admin' | 'accountant' | 'business';
export type SubscriptionPlan = 'free_trial' | 'light' | 'popular' | 'professional';

export interface User {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    whatsapp_number?: string;
    role: UserRole;
    subscription_plan: SubscriptionPlan;
    gstin?: string;
    business_name?: string;
    reset_token?: string;
    reset_token_expiry?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface UserPublic {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    subscription_plan: SubscriptionPlan;
    gstin?: string;
    business_name?: string;
}

export interface CreateUserDTO {
    email: string;
    password: string;
    name: string;
    whatsapp_number?: string;
    role?: UserRole;
    gstin?: string;
    business_name?: string;
}

export interface UpdateUserDTO {
    name?: string;
    whatsapp_number?: string;
    gstin?: string;
    business_name?: string;
    subscription_plan?: SubscriptionPlan;
}

export interface LoginDTO {
    email?: string;
    whatsapp_number?: string;
    password: string;
}

export interface AuthResponse {
    user: UserPublic;
    token: string;
}

// Helper to convert DB user to public user
export function toPublicUser(user: User): UserPublic {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_plan: user.subscription_plan,
        gstin: user.gstin,
        business_name: user.business_name,
    };
}

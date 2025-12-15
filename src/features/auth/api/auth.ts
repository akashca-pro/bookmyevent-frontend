import { apiClient } from "@/lib/http";
import { z } from "zod";

export const LoginSchema = z.object({
    email: z
        .email('Invalid email address')
        .min(5)
        .max(255),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100)
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
});

export const SignupSchema = z.object({
    name: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name must contain only letters'), // Added \s to allow spaces in name

    email: z
        .email('Invalid email address')
        .min(5)
        .max(255),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100)
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'), // Matches user request regex
});

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type SignupCredentials = z.infer<typeof SignupSchema>;

export interface AuthResponse<T = {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}> {
    success: boolean;
    message: string;
    data: T;
}

export interface ProfileResponseDTO {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export const adminLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/admin/login', {
        data: credentials,
    });
};

export const userLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/user/login', {
        data: credentials,
    });
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/signup', {
        data: credentials,
    });
};

export const logout = async (): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/logout', {
        method: 'DELETE',
    });
};

export const getCurrentUser = async (): Promise<AuthResponse<ProfileResponseDTO>> => {
    return apiClient<AuthResponse<ProfileResponseDTO>>('/profile');
};

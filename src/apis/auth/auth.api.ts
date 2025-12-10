import type { ApiResponse } from '@/types/apiRes.type';
import { apiClient } from '../http';

const preUrl = '/auth'

export interface SignupRequest {
    name : string;
    email : string;
    password : string;
}

export interface SignupResponse {
    id : string;
    name : string;
    email : string;
    role : 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
    id : string;
    name : string;
    email : string;
    role : 'user' | 'admin';
}

export function signupUser(data : SignupRequest){
    return apiClient<ApiResponse<SignupResponse>>(`${preUrl}/signup`,{
        method : 'POST',
        body : JSON.stringify(data),
    })
}

export function loginUser(data: LoginRequest) {
  return apiClient<ApiResponse<LoginResponse>>(`${preUrl}/login}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

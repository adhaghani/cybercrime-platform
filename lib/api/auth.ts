/**
 * Authentication Service
 * Handles login, signup, password reset, and session management
 */

import { apiClient } from './client';
import { Staff, Student } from '@/lib/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  contact_number: string;
  password: string;
  account_type?: string;
  studentID: string;
  program: string;
  semester: number;
  year_of_study: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export type UserProfile = Student | Staff;

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  
  // Set token in API client
  if (response.token) {
    apiClient.setToken(response.token);
  }
  
  return response;
}

/**
 * Sign up new user
 */
export async function signUp(data: SignUpData): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/api/auth/register', data);
  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout');
  
  // Clear token
  apiClient.clearToken();
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = apiClient.getToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await apiClient.get<UserProfile>('/api/auth/me');
    return response;
  } catch (error) {
    // If unauthorized or token invalid, clear token
    console.error("Error fetching current user:", error);
    apiClient.clearToken();
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/api/auth/forgot-password', { email });
  return response;
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/api/auth/update-password', { password: newPassword });
  return response;
}

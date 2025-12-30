/**
 * Authentication API v2 - Integration with new OOP backend
 */

import { apiClient } from './client';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  matricNumber?: string; // For students
  department?: string; // For staff
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export const authApiV2 = {
  // Login
  login: async (data: LoginDTO) => {
    return apiClient.post('/auth/login', data);
  },

  // Register
  register: async (data: RegisterDTO) => {
    return apiClient.post('/auth/register', data);
  },

  // Logout
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  // Refresh token
  refreshToken: async () => {
    return apiClient.post('/auth/refresh');
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordDTO) => {
    return apiClient.post('/auth/forgot-password', data);
  },

  // Reset password
  resetPassword: async (data: ResetPasswordDTO) => {
    return apiClient.post('/auth/reset-password', data);
  },
};

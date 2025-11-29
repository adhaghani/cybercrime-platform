/**
 * Authentication Service
 * Handles login, signup, password reset, and session management
 */

import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
    role: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // TODO: Replace with actual backend API call when auth endpoints are ready
  // const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  
  // Mock implementation for now
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        // Mock successful login
        const mockUser = {
          id: '1',
          email: credentials.email,
          full_name: 'John Doe',
          username: credentials.email.split('@')[0],
          avatar_url: '',
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockToken = btoa(JSON.stringify({ 
          userId: mockUser.id, 
          email: mockUser.email,
          exp: Date.now() + 86400000 // 24 hours
        }));

        apiClient.setToken(mockToken);
        
        resolve({
          token: mockToken,
          user: mockUser,
        });
      } else {
        reject({ message: 'Invalid credentials', status: 401 });
      }
    }, 500);
  });
}

/**
 * Sign up new user
 */
export async function signUp(data: SignUpData): Promise<{ message: string }> {
  // TODO: Replace with actual backend API call when auth endpoints are ready
  // const response = await apiClient.post<{ message: string }>('/api/auth/register', data);
  
  // Mock implementation for now
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email && data.password) {
        resolve({
          message: 'Registration successful. Please check your email to verify your account.',
        });
      } else {
        reject({ message: 'Invalid registration data', status: 400 });
      }
    }, 500);
  });
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  // TODO: Replace with actual backend API call when auth endpoints are ready
  // await apiClient.post('/api/auth/logout');
  
  // Clear token
  apiClient.clearToken();
  
  // Mock implementation
  return Promise.resolve();
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = apiClient.getToken();
  
  if (!token) {
    return null;
  }

  // TODO: Replace with actual backend API call when auth endpoints are ready
  // const response = await apiClient.get<UserProfile>('/api/auth/me');
  
  // Mock implementation - decode token
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now()) {
      apiClient.clearToken();
      return null;
    }

    // Mock user data
    return {
      id: decoded.userId || '1',
      email: decoded.email || 'user@example.com',
      full_name: 'John Doe',
      username: decoded.email?.split('@')[0] || 'user',
      avatar_url: '',
      role: 'student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    apiClient.clearToken();
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  // TODO: Replace with actual backend API call when auth endpoints are ready
  // const response = await apiClient.post<{ message: string }>('/api/auth/forgot-password', { email });
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email) {
        resolve({
          message: 'Password reset email sent. Please check your inbox.',
        });
      } else {
        reject({ message: 'Invalid email address', status: 400 });
      }
    }, 500);
  });
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ message: string }> {
  // TODO: Replace with actual backend API call when auth endpoints are ready
  // const response = await apiClient.post<{ message: string }>('/api/auth/update-password', { password: newPassword });
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (newPassword && newPassword.length >= 8) {
        resolve({
          message: 'Password updated successfully.',
        });
      } else {
        reject({ message: 'Password must be at least 8 characters', status: 400 });
      }
    }, 500);
  });
}

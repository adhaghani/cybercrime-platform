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
  email: string;
  password: string;
  full_name?: string;
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
  // TODO: Replace with actual backend API call when auth endpoints are ready
  // const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  
  // Mock implementation for now
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        // Mock successful login
        
        const mockUser: Student = {
          accountId: '1',
          email: credentials.email,
          name: 'John Doe',
          contactNumber: '012-3456789',
          accountType: 'STUDENT',
          // role: 'SUPERADMIN',
          // department: 'IT Department',
          // position: 'System Administrator',
          // supervisorId: '5',
          program: 'Computer Science',
          semester: 4,
          yearOfStudy: 2,
          passwordHash: '',
          createdAt: '',
          updatedAt: ''
        };

        const mockToken = btoa(JSON.stringify({ 
          accountId: mockUser.accountId,
          name: mockUser.name,
          email: mockUser.email,
          // role: mockUser.role,
          accountType: mockUser.accountType,
          contactNumber: mockUser.contactNumber,
          // department: mockUser.department,
          // position: mockUser.position,
          // supervisorId: mockUser.supervisorId,
          program: mockUser.program,
          semester: mockUser.semester,
          yearOfStudy: mockUser.yearOfStudy,
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
    // In a real app, we would fetch the full profile from the backend
    // Here we reconstruct it from the token or return a default mock
    if (decoded.role === 'STUDENT') {
      return {
          accountId: decoded.accountId || '1',
          email: decoded.email || "email@john.com",
          name: decoded.name || 'John Doe',
          contactNumber: decoded.contactNumber || '012-3456789',
          accountType: decoded.accountType || 'STUDENT',
          program: decoded.program || 'Computer Science',
          semester: decoded.semester || 4,
          yearOfStudy: decoded.yearOfStudy || 2,
          passwordHash: '',
          createdAt: '',
          updatedAt: ''
      } as Student;
    } else {
      return {
          accountId: decoded.accountId || '1',
          email: decoded.email || "john@gmail.com",
          name: decoded.name || 'John Doe',
          contactNumber: decoded.contactNumber || '012-3456789',
          accountType: decoded.accountType || 'STAFF',
          role: decoded.role || 'SUPERADMIN',
          department: decoded.department || 'IT Department',
          position: decoded.position || 'System Administrator',
          supervisorId: decoded.supervisorId || '5',
          passwordHash: '',
          createdAt: '',
          updatedAt: ''
      } as Staff;
    }
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

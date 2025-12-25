/**
 * Authentication Service
 * Handles login, signup, password reset, and session management
 */

import { apiClient } from './client';
import { Staff, Student } from '@/lib/types';

// Toggle between mock and real API
const USE_MOCK_AUTH = false;

// Mock users for testing
const MOCK_USERS = {
  superadmin: {
    email: 'superadmin@staff.uitm.edu.my',
    password: 'SuperAdmin123!',
    user: {
      accountId: '9999',
      name: 'Super Admin',
      email: 'superadmin@staff.uitm.edu.my',
      contactNumber: '0123456789',
      accountType: 'STAFF',
      staffId: '99999999',
      role: 'SUPERADMIN',
      department: 'IT Security',
      position: 'Chief Security Officer',
    } as Staff,
  },
  admin: {
    email: 'admin@staff.uitm.edu.my',
    password: 'Admin123!',
    user: {
      accountId: '8888',
      name: 'Admin User',
      email: 'admin@staff.uitm.edu.my',
      contactNumber: '0123456788',
      accountType: 'STAFF',
      staffId: '88888888',
      role: 'ADMIN',
      department: 'Administration',
      position: 'Administrator',
    } as Staff,
  },
  supervisor: {
    email: 'supervisor@staff.uitm.edu.my',
    password: 'Supervisor123!',
    user: {
      accountId: '7777',
      name: 'Supervisor User',
      email: 'supervisor@staff.uitm.edu.my',
      contactNumber: '0123456777',
      accountType: 'STAFF',
      staffId: '77777777',
      role: 'SUPERVISOR',
      department: 'Security',
      position: 'Security Supervisor',
    } as Staff,
  },
  staff: {
    email: 'staff@staff.uitm.edu.my',
    password: 'Staff123!',
    user: {
      accountId: '6666',
      name: 'Staff User',
      email: 'staff@staff.uitm.edu.my',
      contactNumber: '0123456666',
      accountType: 'STAFF',
      staffId: '66666666',
      role: 'STAFF',
      department: 'Security',
      position: 'Security Officer',
    } as Staff,
  },
  student: {
    email: 'student@student.uitm.edu.my',
    password: 'Student123!',
    user: {
      accountId: '5555',
      name: 'Student User',
      email: 'student@student.uitm.edu.my',
      contactNumber: '0123456555',
      accountType: 'STUDENT',
      studentId: '2025160493',
      program: 'Computer Science',
      semester: 3,
      yearOfStudy: 2,
    } as Student,
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  account_type?: string;
  studentID?: string;
  program?: string;
  semester?: number;
  year_of_study?: number;
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
  if (USE_MOCK_AUTH) {
    // Mock authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          const mockToken = 'mock-token-' + Date.now();
          apiClient.setToken(mockToken);
          
          resolve({
            token: mockToken,
            user: {
              accountId: '1',
              email: credentials.email,
              name: 'John Doe',
              contactNumber: '012-3456789',
              accountType: 'STUDENT',
              studentId: '2023123456',
              program: 'Computer Science',
              semester: 4,
              yearOfStudy: 2,
              passwordHash: '',
              createdAt: '',
              updatedAt: ''
            } as Student,
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    
    // Set token in API client
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Invalid email or password');
  }
}

/**
 * Sign up new user
 */
export async function signUp(data: SignUpData): Promise<{ message: string }> {
  if (USE_MOCK_AUTH) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Account created successfully' });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<{ message: string }>('/api/auth/register', data);
    return response;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  if (USE_MOCK_AUTH) {
    apiClient.clearToken();
    return Promise.resolve();
  }

  try {
    await apiClient.post('/api/auth/logout');
    apiClient.clearToken();
  } catch (error: any) {
    console.error('Logout error:', error);
    // Still clear token even if API call fails
    apiClient.clearToken();
    throw error;
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = apiClient.getToken();
  
  if (!token) {
    return null;
  }

  if (USE_MOCK_AUTH) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (token.startsWith('mock-token-')) {
          resolve({
            accountId: '1',
            email: 'student@student.uitm.edu.my',
            name: 'Student User',
            contactNumber: '0123456555',
            accountType: 'STUDENT',
            studentId: '2025160493',
            program: 'Computer Science',
            semester: 3,
            yearOfStudy: 2,
            passwordHash: '',
            createdAt: '',
            updatedAt: ''
          } as Student);
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  try {
    const response = await apiClient.get<UserProfile>('/api/auth/me');
    return response;
  } catch (error) {
    console.error("Error fetching current user:", error);
    apiClient.clearToken();
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  if (USE_MOCK_AUTH) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password reset email sent' });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<{ message: string }>('/api/auth/forgot-password', { email });
    return response;
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send reset email');
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ message: string }> {
  if (USE_MOCK_AUTH) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password updated successfully' });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<{ message: string }>('/api/auth/update-password', { password: newPassword });
    return response;
  } catch (error: any) {
    console.error('Update password error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
}
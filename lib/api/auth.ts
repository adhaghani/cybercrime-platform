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
      ACCOUNT_ID: '9999',
      NAME: 'Super Admin',
      EMAIL: 'superadmin@staff.uitm.edu.my',
      CONTACT_NUMBER: '0123456789',
      ACCOUNT_TYPE: 'STAFF',
      STAFF_ID: '99999999',
      ROLE: 'SUPERADMIN',
      DEPARTMENT: 'IT Security',
      POSITION: 'Chief Security Officer',
    } as Staff,
  },
  admin: {
    email: 'admin@staff.uitm.edu.my',
    password: 'Admin123!',
    user: {
      ACCOUNT_ID: '8888',
      NAME: 'Admin User',
      EMAIL: 'admin@staff.uitm.edu.my',
      CONTACT_NUMBER: '0123456788',
      ACCOUNT_TYPE: 'STAFF',
      STAFF_ID: '88888888',
      ROLE: 'ADMIN',
      DEPARTMENT: 'Administration',
      POSITION: 'Administrator',
    } as Staff,
  },
  supervisor: {
    email: 'supervisor@staff.uitm.edu.my',
    password: 'Supervisor123!',
    user: {
      ACCOUNT_ID: '7777',
      NAME: 'Supervisor User',
      EMAIL: 'supervisor@staff.uitm.edu.my',
      CONTACT_NUMBER: '0123456777',
      ACCOUNT_TYPE: 'STAFF',
      STAFF_ID: '77777777',
      ROLE: 'SUPERVISOR',
      DEPARTMENT: 'Security',
      POSITION: 'Security Supervisor',
    } as Staff,
  },
  staff: {
    email: 'staff@staff.uitm.edu.my',
    password: 'Staff123!',
    user: {
      ACCOUNT_ID: '6666',
      NAME: 'Staff User',
      EMAIL: 'staff@staff.uitm.edu.my',
      CONTACT_NUMBER: '0123456666',
      ACCOUNT_TYPE: 'STAFF',
      STAFF_ID: '66666666',
      ROLE: 'STAFF',
      DEPARTMENT: 'Security',
      POSITION: 'Security Officer',
    } as Staff,
  },
  student: {
    email: 'student@student.uitm.edu.my',
    password: 'Student123!',
    user: {
      ACCOUNT_ID: '5555',
      NAME: 'Student User',
      EMAIL: 'student@student.uitm.edu.my',
      CONTACT_NUMBER: '0123456555',
      ACCOUNT_TYPE: 'STUDENT',
      STUDENT_ID: '2025160493',
      PROGRAM: 'Computer Science',
      SEMESTER: 3,
      YEAR_OF_STUDY: 2,
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
  contact_number: string;
  password: string;
  account_type: string;
  studentID?: string;
  program?: string;
  semester?: number;
  year_of_study?: number;
  staffID?: string;
  department?: string;
  position?: string;
  role?: string;
  supervisorID?: string;
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
        const mockUser = Object.values(MOCK_USERS).find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (mockUser) {
          const mockToken = `mock-token-${mockUser.user.ACCOUNT_ID}-${Date.now()}`;
          apiClient.setToken(mockToken);
          
          resolve({
            token: mockToken,
            user: mockUser.user,
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate network delay
    });
  }

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
  if (USE_MOCK_AUTH) {
    // Mock signup
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Account created successfully' });
      }, 500);
    });
  }

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

  if (USE_MOCK_AUTH) {
    // Mock get current user
    return new Promise((resolve) => {
      setTimeout(() => {
        if (token.startsWith('mock-token-')) {
          const accountId = token.split('-')[2];
          const mockUser = Object.values(MOCK_USERS).find(
            (u) => u.user.ACCOUNT_ID === accountId
          );
          resolve(mockUser ? mockUser.user : null);
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  try {
    const response = await apiClient.get<UserProfile>('/api/auth/me');
    console.log(response);
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

/**
 * API Client for Oracle Backend
 * Handles HTTP requests to the Express.js backend with Oracle DB
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    
    // Initialize token from cookie if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = this.getTokenFromCookie();
    }
  }

  /**
   * Get token from cookie
   */
  private getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('auth_token='));
    
    if (!authCookie) return null;
    
    return authCookie.split('=')[1];
  }

  /**
   * Set token in cookie
   */
  private setTokenCookie(token: string, maxAge: number = 86400) {
    if (typeof document === 'undefined') return;
    
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
  }

  /**
   * Clear token cookie
   */
  private clearTokenCookie() {
    if (typeof document === 'undefined') return;
    
    document.cookie = 'auth_token=; path=/; max-age=0';
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        this.setTokenCookie(token);
      } else {
        this.clearTokenCookie();
      }
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.setToken(null);
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw {
            message: errorData.message || 'An error occurred',
            status: response.status,
            errors: errorData.errors,
          } as ApiError;
        } else {
          throw {
            message: response.statusText || 'An error occurred',
            status: response.status,
          } as ApiError;
        }
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      if (isJson) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or multiple instances
export default ApiClient;

// Export types
export type { ApiError };

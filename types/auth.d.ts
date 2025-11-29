/**
 * Authentication type definitions
 * Used throughout the application for user authentication and authorization
 */

export interface AuthClaims {
  email?: string;
  sub?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  role?: string;
  session_id?: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_at?: number;
  user: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  claims: AuthClaims | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setClaims: (claims: AuthClaims | null) => void;
}

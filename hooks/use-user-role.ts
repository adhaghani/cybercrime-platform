"use client";

import { useAuth } from "@/lib/context/auth-provider";

/**
 * Hook to easily get the current user's role
 * @returns The user's role (e.g., 'student', 'staff', 'admin') or null if not authenticated
 */
export function useUserRole() {
  const { claims } = useAuth();
  
  return claims?.role || null;
}

/**
 * Hook to check if user has a specific role
 * @returns Function to check if user has the specified role
 */
export function useHasRole() {
  const { claims } = useAuth();
  
  return (role: string) => claims?.role === role;
}

/**
 * Hook to check if user has any of the specified roles
 * @returns Function to check if user has any of the specified roles
 */
export function useHasAnyRole() {
  const { claims } = useAuth();
  
  return (roles: string[]) => {
    if (!claims?.role) return false;
    return roles.includes(claims.role);
  };
}

/**
 * Hook to check if user is a student
 */
export function useIsStudent() {
  const role = useUserRole();
  return role === 'STUDENT';
}

/**
 * Hook to check if user is staff
 */
export function useIsStaff() {
  const role = useUserRole();
  return role === 'STAFF';
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  const role = useUserRole();
  return role === 'ADMIN' || role === 'SUPERADMIN';
}

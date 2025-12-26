/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/lib/context/auth-provider";
import { getCurrentUser } from "@/lib/api/auth";
import { useEffect, useState, useRef } from "react";

export function ProtectedLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { claims, setClaims, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const hasAttemptedLoadRef = useRef(false);

  useEffect(() => {
    // Prevent multiple simultaneous loads
    if (hasAttemptedLoadRef.current) return;
    
    const loadUserData = async () => {
      hasAttemptedLoadRef.current = true;
      // Always fetch fresh user data from the server on mount
      // This ensures auth state is synced with HttpOnly cookie
      try {
        console.log('[ProtectedLayout] Fetching current user...');
        const user = await getCurrentUser();

        if (!user) {
          console.log('[ProtectedLayout] No user found, redirecting to login');
          // window.location.href = "/auth/login";
          return;
        }

        // Set user claims (using UPPERCASE to match Claims interface)
        console.log('[ProtectedLayout] User data received:', user);
        
        setClaims({
          ACCOUNT_ID: user.ACCOUNT_ID,
          EMAIL: user.EMAIL,
          NAME: user.NAME,
          CONTACT_NUMBER: user.CONTACT_NUMBER,
          AVATAR_URL: user.AVATAR_URL,
          ACCOUNT_TYPE: user.ACCOUNT_TYPE,
          ...((user.ACCOUNT_TYPE === 'STUDENT') ? {
            STUDENT_ID: user.STUDENT_ID,
            PROGRAM: user.PROGRAM,
            SEMESTER: user.SEMESTER,
            YEAR_OF_STUDY: user.YEAR_OF_STUDY,
          } : {
            STAFF_ID: user.STAFF_ID,
            DEPARTMENT: user.DEPARTMENT,
            POSITION: user.POSITION,
            ROLE: user.ROLE,
          }),
          CREATED_AT: user.CREATED_AT,
          UPDATED_AT: user.UPDATED_AT,
        });
        console.log('[ProtectedLayout] Claims set successfully');
      } catch (error) {
        console.error("[ProtectedLayout] Error loading user data:", error);
        // Don't redirect immediately, let isAuthenticated check handle it
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = "/auth/login";
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}

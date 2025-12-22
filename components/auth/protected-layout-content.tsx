"use client";

import { useAuth } from "@/lib/context/auth-provider";
import { getCurrentUser } from "@/lib/api/auth";
import { useEffect, useState } from "react";

export function ProtectedLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { claims, setClaims, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      // Check if we already have claims in sessionStorage
      if (claims && Object.keys(claims).length > 0) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();

        if (!user) {
          window.location.href = "/auth/login";
          return;
        }

        // Set user claims
        const userRole = 'role' in user ? user.role : user.accountType;
        
        console.log('Setting user role:', userRole, 'User type:', user.accountType);
        
        setClaims({
          sub: user.accountId,
          email: user.email,
          user_metadata: {
            name: user.name || "",
            contactNumber: user.contactNumber || "",
            ...(('studentId' in user) ? {
              studentId: user.studentId,
              program: user.program,
              semester: user.semester,
              yearOfStudy: user.yearOfStudy,
            } : {
              staffId: user.staffId,
              department: user.department,
              position: user.position,
            })
          },
          role: userRole as any,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        window.location.href = "/auth/login";
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [claims, setClaims]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}

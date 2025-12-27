"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHasAnyRole } from "@/hooks/use-user-role";
import { toast } from "sonner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Role-based access control component
 * Protects content based on user roles
 * 
 * @example
 * <RoleGuard allowedRoles={['admin', 'superadmin']}>
 *   <AdminContent />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const hasAnyRole = useHasAnyRole();
  const hasAccess = hasAnyRole(allowedRoles);
 
  useEffect(() => {
    if (!hasAccess) {
      toast.error("You do not have permission to access this page.");
      router.replace(redirectTo);
    }
  }, [hasAccess, router, redirectTo]);

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Checking permissions...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

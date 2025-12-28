"use client";

import React from 'react'
import { RoleGuard } from '@/components/auth/role-guard';
import { generateMetadata } from '@/lib/seo';
export default function Layout({ children }: { children: React.ReactNode }) {

  generateMetadata({
    title: "User Management - Cybercrime Reporting Platform",
    description: "Manage users and their roles on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/user-management",
  });

  return <RoleGuard allowedRoles={['ADMIN', 'SUPERADMIN', 'STAFF', 'SUPERVISOR']}>
    {children}
    </RoleGuard>;
}
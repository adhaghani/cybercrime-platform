"use client";

import React from 'react'
import { RoleGuard } from '@/components/auth/role-guard';
import { generateMetadata } from '@/lib/seo';
export default function Layout({ children }: { children: React.ReactNode }) {

  generateMetadata({
    title: "Statistic - Cybercrime Reporting Platform",
    description: "View detailed statistics and reports on the Cybercrime Reporting Platform.",
    canonical: "/dashboard/statistic",
  });

  return <RoleGuard allowedRoles={['ADMIN', 'SUPERADMIN', 'STAFF', 'SUPERVISOR']}>
    {children}
    </RoleGuard>;
}
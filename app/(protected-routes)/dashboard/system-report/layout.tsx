"use client";

import React from 'react'
import { RoleGuard } from '@/components/auth/role-guard';

export default function Layout({ children }: { children: React.ReactNode }) {

  return <RoleGuard allowedRoles={['ADMIN', 'STAFF', 'SUPERADMIN']}>{children}</RoleGuard>;
}
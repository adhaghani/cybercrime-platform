import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/dashboard/user-stats
 * Get user statistics (total users, students, staff, admins)
 * 
 * Now proxies to OOP backend at /api/v2/dashboard/user-stats
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/dashboard/user-stats',
    includeAuth: true,
  });
}

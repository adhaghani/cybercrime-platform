import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/dashboard/recent-activity
 * Get recent activity (reports, announcements, assignments)
 * Query params: limit, type
 * 
 * Now proxies to OOP backend at /api/v2/dashboard/recent-activity
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/dashboard/recent-activity',
    includeAuth: true,
  });
}

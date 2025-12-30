import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/my-reports
 * Get reports submitted by the current authenticated user
 * Query params: type, status, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/reports/my-reports
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/my-reports',
    includeAuth: true,
  });
}

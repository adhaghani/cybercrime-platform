import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/facilities/my-reports
 * Get facility reports submitted by the current authenticated user
 * Query params: status, severity_level, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/facilities/my-reports
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/facilities/my-reports',
    includeAuth: true,
  });
}

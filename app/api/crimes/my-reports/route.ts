import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/crimes/my-reports
 * Get crime reports submitted by the current authenticated user
 * Query params: status, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/crimes/my-reports
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/crimes/my-reports',
    includeAuth: true,
  });
}

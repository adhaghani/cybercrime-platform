import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/by-location
 * Get reports grouped by location with counts
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/by-location',
    includeAuth: true,
  });
}

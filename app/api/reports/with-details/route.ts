import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/with-details
 * Get reports with detailed information
 * Query params: type (optional)
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/with-details',
    includeAuth: true,
  });
}
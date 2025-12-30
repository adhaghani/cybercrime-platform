import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/public-latest
 * Get latest public reports (no auth required)
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/public-latest',
    includeAuth: false,
  });
}

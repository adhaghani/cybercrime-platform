import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/by-date-range
 * Get time-series data for reports
 * Query params: date_from, date_to, group_by (day|week|month)
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/by-date-range',
    includeAuth: true,
  });
}

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/export
 * Export reports to CSV or Excel
 * Query params: format (csv|xlsx), filters (type, status, date_from, date_to)
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/export',
    includeAuth: true,
  });
}

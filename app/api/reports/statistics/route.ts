import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/statistics
 * Get all statistics for reports (report types, status, crime categories, facility severities, reports over time, user growth)
 * Query params: days (default 30), months (default 12)
 * 
 * Now proxies to OOP backend at /api/v2/reports/statistics
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/statistics',
    includeAuth: true,
  });
}

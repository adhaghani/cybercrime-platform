import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/dashboard/charts
 * Get chart data for dashboard visualizations
 * Query params: type (reports-by-month, crimes-by-category, etc.)
 * 
 * Now proxies to OOP backend at /api/v2/dashboard/charts
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/dashboard/charts',
    includeAuth: true,
  });
}

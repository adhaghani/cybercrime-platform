import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/facilities/by-severity
 * Get facility issue statistics grouped by severity level
 * Query params: date_from, date_to, facility_type
 * 
 * Now proxies to OOP backend at /api/v2/facilities/by-severity
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/facilities/by-severity',
    includeAuth: true,
  });
}

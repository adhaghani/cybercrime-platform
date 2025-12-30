import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/staff/export
 * Export staff list to CSV or Excel
 * Query params: format (csv|xlsx), department, role
 * 
 * Now proxies to OOP backend at /api/v2/staff/export
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/staff/export',
    includeAuth: true,
  });
}

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/report-assignments/my-assignments
 * Get report assignments for the current authenticated staff member
 * Query params: status, type, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/report-assignments/my-assignments
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/report-assignments/my-assignments',
    includeAuth: true,
  });
}

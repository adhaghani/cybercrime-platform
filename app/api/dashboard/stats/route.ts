import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics (total reports, pending, crimes, students, etc.)
 * 
 * Now proxies to OOP backend at /api/v2/dashboard/stats
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/dashboard/stats',
    includeAuth: true,
  });
}

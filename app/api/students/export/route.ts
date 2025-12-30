import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/students/export
 * Export students list to CSV or Excel
 * Query params: format (csv|xlsx), program, semester, year
 * 
 * Now proxies to OOP backend at /api/v2/students/export
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/students/export',
    includeAuth: true,
  });
}

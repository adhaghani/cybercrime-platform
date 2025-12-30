import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/report-assignments
 * List all report assignments
 * 
 * POST /api/report-assignments
 * Create a new report assignment (assign staff to report)
 * 
 * Now proxies to OOP backend at /api/v2/report-assignments
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/report-assignments',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/report-assignments',
    method: 'POST',
    includeAuth: true,
  });
}

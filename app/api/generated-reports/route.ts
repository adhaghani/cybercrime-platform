import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/generated-reports
 * List all generated reports
 * 
 * POST /api/generated-reports
 * Create a new generated report
 * 
 * Now proxies to OOP backend at /api/v2/generated-reports
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/generated-reports',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/generated-reports',
    method: 'POST',
    includeAuth: true,
  });
}

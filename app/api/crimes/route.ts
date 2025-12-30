import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/crimes
 * List all crime reports
 * 
 * POST /api/crimes
 * Create a new crime report
 * 
 * Now proxies to OOP backend at /api/v2/crimes
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/crimes',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/crimes',
    method: 'POST',
    includeAuth: true,
  });
}

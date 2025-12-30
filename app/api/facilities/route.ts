import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/facilities
 * List all facility reports
 * 
 * POST /api/facilities
 * Create a new facility report
 * 
 * Now proxies to OOP backend at /api/v2/facilities
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/facilities',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/facilities',
    method: 'POST',
    includeAuth: true,
  });
}

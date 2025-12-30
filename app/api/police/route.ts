import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/police
 * List all UiTM Auxiliary Police contacts (public)
 * 
 * POST /api/police
 * Create a new police contact (auth required)
 * 
 * Now proxies to OOP backend at /api/v2/police
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/police',
    includeAuth: false, // Public endpoint
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/police',
    method: 'POST',
    includeAuth: true,
  });
}

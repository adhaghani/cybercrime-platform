import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/public
 * Public endpoint to fetch latest reports without authentication
 * Limited to recent reports for public viewing
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    includeAuth: false, // No authentication required for public access
  });
}

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/reports/search
 * Advanced search for reports
 * Query params: q, type, status, date_from, date_to, location, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/reports/search
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports/search',
    includeAuth: true,
  });
}

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/crimes/by-category
 * Get crime statistics grouped by category
 * Query params: date_from, date_to
 * 
 * Now proxies to OOP backend at /api/v2/crimes/by-category
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/crimes/by-category',
    includeAuth: true,
  });
}

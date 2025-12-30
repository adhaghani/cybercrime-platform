import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/staff/search
 * Advanced search for staff
 * Query params: q, department, role, page, limit
 * 
 * Now proxies to OOP backend at /api/v2/staff/search
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/staff/search',
    includeAuth: true,
  });
}

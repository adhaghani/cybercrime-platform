import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/staff
 * List all staff members
 * Query params: role - filter by role (ADMIN, STAFF, etc.)
 * 
 * POST /api/staff
 * Create a new staff record
 * 
 * Now proxies to OOP backend at /api/v2/staff
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/staff',
    includeAuth: true,
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/staff',
    method: 'POST',
    includeAuth: true,
  });
}

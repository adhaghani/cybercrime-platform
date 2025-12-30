import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/auth/update-password
 * Update password for authenticated user
 * 
 * Now proxies to OOP backend at /api/v2/auth/update-password
 */
export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/auth/update-password',
    method: 'POST',
    includeAuth: true, // Requires authentication
  });
}

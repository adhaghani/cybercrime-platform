import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/auth/reset-password
 * Reset password with token from email
 * 
 * Now proxies to OOP backend at /api/v2/auth/reset-password
 */
export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/auth/reset-password',
    method: 'POST',
    includeAuth: false, // Public endpoint
  });
}

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 * 
 * Now proxies to OOP backend at /api/v2/auth/forgot-password
 */
export async function POST(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/auth/forgot-password',
    method: 'POST',
    includeAuth: false, // Public endpoint
  });
}

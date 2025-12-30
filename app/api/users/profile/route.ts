import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/users/profile
 * Get current user profile
 * 
 * PUT /api/users/profile
 * Update current user profile
 * 
 * Now proxies to OOP backend at /api/v2/users/profile
 */

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/users/profile',
    includeAuth: true,
  });
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/users/profile',
    method: 'PUT',
    includeAuth: true,
  });
}

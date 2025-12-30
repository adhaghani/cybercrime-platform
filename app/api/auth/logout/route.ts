import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, clearAuthCookie } from '@/lib/api/proxy';

/**
 * POST /api/auth/logout
 * Clear authentication token and log out user
 * Now proxies to OOP backend at /api/v2/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // Call backend logout endpoint
    await proxyToBackend(request, {
      path: '/auth/logout',
      method: 'POST',
      includeAuth: true,
    });

    // Clear auth cookie
    const res = NextResponse.json({ message: 'Logged out successfully' });
    return clearAuthCookie(res);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

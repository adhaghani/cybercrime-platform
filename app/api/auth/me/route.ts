import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, clearAuthCookie } from '@/lib/api/proxy';

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * Now proxies to OOP backend at /api/v2/auth/me
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    console.log('[API /auth/me] Token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Proxy to new backend
    const response = await proxyToBackend(request, {
      path: '/auth/me',
      includeAuth: true,
    });

    console.log('[API /auth/me] Backend response status:', response.status);

    // Clear cookie if unauthorized
    if (response.status === 401) {
      const data = await response.json();
      const errorResponse = NextResponse.json(data, { status: 401 });
      return clearAuthCookie(errorResponse);
    }

    return response;
  } catch (error) {
    console.error('[API /auth/me] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

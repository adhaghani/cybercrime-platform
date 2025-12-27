import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/me
 * Get current authenticated user profile
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

    // Forward request to backend with token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('[API /auth/me] Backend response status:', response.status);

    if (!response.ok) {
      // Clear invalid cookie
      const errorResponse = NextResponse.json(data, { status: response.status });
      errorResponse.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return errorResponse;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API /auth/me] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

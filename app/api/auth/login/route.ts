import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, setAuthCookie } from '@/lib/api/proxy';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 * Now proxies to OOP backend at /api/v2/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Proxy to new backend (pass the already-parsed body)
    const response = await proxyToBackend(request, {
      path: '/auth/login',
      method: 'POST',
      includeAuth: false,
      body, // Pass the parsed body since we already consumed the request
    });

    // If successful, set auth cookie
    if (response.status === 200) {
      const data = await response.json();
      if (data.token) {
        const res = NextResponse.json(data);
        return setAuthCookie(res, data.token);
      }
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

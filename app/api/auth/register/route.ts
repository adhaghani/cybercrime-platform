import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/auth/register
 * Register a new user account
 * Now proxies to OOP backend at /api/v2/auth/register
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, contact_number, account_type } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Proxy to new backend
    return proxyToBackend(request, {
      path: '/auth/register',
      method: 'POST',
      includeAuth: false,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

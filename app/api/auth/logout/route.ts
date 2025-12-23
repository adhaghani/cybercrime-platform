import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Clear authentication token and log out user
 */
export async function POST() {
  try {
    const res = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear auth token cookie
    res.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

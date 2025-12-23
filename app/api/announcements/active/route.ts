import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/announcements/active
 * Get active announcements (published and within date range)
 * Query params: audience, priority, limit
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/active?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/active`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get active announcements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

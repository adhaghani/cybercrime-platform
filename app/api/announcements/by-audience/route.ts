import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/announcements/by-audience
 * Get announcements filtered by audience
 * Query params: audience (required), status, page, limit
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    const { searchParams } = new URL(request.url);
    
    if (!searchParams.get('audience')) {
      return NextResponse.json(
        { error: 'audience query parameter is required' },
        { status: 400 }
      );
    }

    const queryString = searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/by-audience?${queryString}`;

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
    console.error('Get announcements by audience error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/facilities/my-reports
 * Get facility reports submitted by the current authenticated user
 * Query params: status, severity_level, page, limit
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/my-reports?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/my-reports`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get my facility reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

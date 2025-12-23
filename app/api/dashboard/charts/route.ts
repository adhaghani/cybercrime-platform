import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard/charts
 * Get chart data for dashboard visualizations
 * Query params: type (reports-by-month, crimes-by-category, etc.)
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/charts?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/charts`;

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
    console.error('Get chart data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

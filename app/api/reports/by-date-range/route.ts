import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/reports/by-date-range
 * Get time-series data for reports
 * Query params: date_from, date_to, group_by (day|week|month)
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
    
    if (!queryString) {
      return NextResponse.json(
        { error: 'date_from and date_to parameters are required' },
        { status: 400 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reports/by-date-range?${queryString}`;

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
    console.error('Get reports by date range error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

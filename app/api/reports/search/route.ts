import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/reports/search
 * Advanced search for reports
 * Query params: q, type, status, date_from, date_to, location, page, limit
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    if (!queryString) {
      return NextResponse.json(
        { error: 'At least one search parameter is required' },
        { status: 400 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reports/search?${queryString}`;

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
    console.error('Search reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

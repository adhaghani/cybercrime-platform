import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/reports/statistics
 * Get all statistics for reports (report types, status, crime categories, facility severities, reports over time, user growth)
 * Query params: days (default 30), months (default 12)
 */

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { searchParams } = new URL(request.url);
    
    const days = searchParams.get('days') || '30';
    const months = searchParams.get('months') || '12';
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reports/statistics/all?days=${days}&months=${months}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

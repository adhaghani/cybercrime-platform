import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/report-assignments/by-staff/[staffId]
 * Get all assignments for a specific staff member
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { staffId } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/report_assignments/by-staff/${staffId}?${queryString}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/report_assignments/by-staff/${staffId}`;

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
    console.error('Get assignments by staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

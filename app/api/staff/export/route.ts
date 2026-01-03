import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000/api/v2';

/**
 * GET /api/staff/export
 * Export staff list to CSV
 * Query params: role, department
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Build URL with query params
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${BACKEND_URL}/staff/export?${queryString}`
      : `${BACKEND_URL}/staff/export`;

    // Prepare headers
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make request to backend
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Get CSV data
    const csvData = await response.text();

    // Return CSV with proper headers
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=staff_members.csv',
      },
    });
  } catch (error) {
    console.error('Export staff CSV error:', error);
    return NextResponse.json(
      {
        error: 'Failed to export staff data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

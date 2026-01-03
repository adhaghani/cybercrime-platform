import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000/api/v2';

/**
 * GET /api/students/export
 * Export students list to CSV
 * Query params: program, semester, year_of_study
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Build URL with query params
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${BACKEND_URL}/students/export?${queryString}`
      : `${BACKEND_URL}/students/export`;

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
        'Content-Disposition': 'attachment; filename=students.csv',
      },
    });
  } catch (error) {
    console.error('Export students CSV error:', error);
    return NextResponse.json(
      {
        error: 'Failed to export students data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

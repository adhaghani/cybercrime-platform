import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/resolutions
 * List all resolutions (staff only)
 * Query params:
 *   - reportId: Filter by report ID
 *   - resolvedBy: Filter by staff who resolved
 *   - resolutionType: Filter by resolution type
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
    const reportId = searchParams.get('reportId');
    const resolvedBy = searchParams.get('resolvedBy');
    const resolutionType = searchParams.get('resolutionType');

    const params = new URLSearchParams();
    if (reportId) params.append('reportId', reportId);
    if (resolvedBy) params.append('resolvedBy', resolvedBy);
    if (resolutionType) params.append('resolutionType', resolutionType);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/resolutions?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get resolutions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

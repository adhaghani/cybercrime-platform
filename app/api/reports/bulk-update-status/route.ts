import { NextRequest, NextResponse } from 'next/server';

/**
 * PUT /api/reports/bulk-update-status
 * Update status for multiple reports at once
 * Body: { ids: string[], status: ReportStatus }
 */

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids) || !body.status) {
      return NextResponse.json(
        { error: 'ids array and status are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/bulk-update-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Bulk update report status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

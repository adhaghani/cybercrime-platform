import { NextRequest, NextResponse } from 'next/server';

/**
 * PUT /api/report-assignments/bulk-update
 * Update multiple report assignments at once
 * Body: { updates: Array<{ id: string, data: Partial<Assignment> }> }
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

    if (!body.updates || !Array.isArray(body.updates)) {
      return NextResponse.json(
        { error: 'updates array is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/report_assignments/bulk-update`, {
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
    console.error('Bulk update assignments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

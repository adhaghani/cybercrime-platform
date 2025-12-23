import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/crimes/report/[reportId]
 * Get crime details by report ID
 * 
 * PUT /api/crimes/report/[reportId]
 * Update crime details
 * 
 * DELETE /api/crimes/report/[reportId]
 * Delete crime record
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { reportId } = params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crimes/report/${reportId}`, {
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
    console.error('Get crime error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { reportId } = params;
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crimes/${reportId}`, {
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
    console.error('Update crime error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { reportId } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crimes/${reportId}`, {
      method: 'DELETE',
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
    console.error('Delete crime error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

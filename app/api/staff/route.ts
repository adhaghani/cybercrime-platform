import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/staff
 * List all staff members
 * 
 * POST /api/staff
 * Create a new staff record (after account creation)
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

    // Get the 'role' query parameter
    const { searchParams } = new URL(request.url);
    let role = searchParams.get('role');
    // Normalize role value for administrator
    if (role && role.toLowerCase() === 'administrator') {
      role = 'ADMIN'; // or 'ADMINISTRATOR' if that's your backend's convention
    }

    // Build backend API URL
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/staff`;
    if (role) {
      apiUrl += `?role=${encodeURIComponent(role)}`;
    }

    const response = await fetch(apiUrl, {
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
    console.error('Get staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.cookies.get('auth_token')?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(data, { status: response.status });
//     }

//     return NextResponse.json(data, { status: 201 });
//   } catch (error) {
//     console.error('Create staff error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

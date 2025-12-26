import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed type
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { id } = await params;  // ← MUST await params

    console.log('=== FETCHING REPORT ===');
    console.log('Report ID:', id);
    console.log('Has token:', !!token);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';  // ← Fallback
    console.log('Using API URL:', apiUrl);

    const reportUrl = `${apiUrl}/api/reports/${id}`;
    console.log('Fetching from:', reportUrl);

    const reportResponse = await fetch(reportUrl, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });

    console.log('Report response status:', reportResponse.status);

    if (!reportResponse.ok) {
      const errorText = await reportResponse.text();
      console.error('Report fetch failed:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to fetch report' };
      }
      
      return NextResponse.json(errorData, { status: reportResponse.status });
    }

    const reportData = await reportResponse.json();
    console.log('Report data received:', reportData);

    // If it's a crime report, fetch crime-specific data
    if (reportData.TYPE === 'CRIME') {
      console.log('Report is CRIME type, fetching crime data...');
      
      try {
        const crimeUrl = `${apiUrl}/api/crimes/report/${id}`;
        console.log('Fetching crime data from:', crimeUrl);

        const crimeResponse = await fetch(crimeUrl, {
          method: 'GET',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
            'Content-Type': 'application/json',
          },
        });

        console.log('Crime response status:', crimeResponse.status);

        if (crimeResponse.ok) {
          const crimeDataArray = await crimeResponse.json();
          console.log('Crime data received:', crimeDataArray);
          
          if (crimeDataArray && crimeDataArray.length > 0) {
            const crimeData = crimeDataArray[0];
            
            // Normalize field names
            const mergedData = {
              type: 'CRIME',
              reportId: reportData.REPORT_ID,
              submittedBy: reportData.SUBMITTED_BY,
              title: reportData.TITLE,
              description: reportData.DESCRIPTION,
              location: reportData.LOCATION,
              status: reportData.STATUS,
              submittedAt: reportData.SUBMITTED_AT,
              updatedAt: reportData.UPDATED_AT,
              crimeCategory: crimeData.CRIME_CATEGORY,
              suspectDescription: crimeData.SUSPECT_DESCRIPTION || null,
              victimInvolved: crimeData.VICTIM_INVOLVED || null,
              weaponInvolved: crimeData.WEAPON_INVOLVED || null,
              injuryLevel: crimeData.INJURY_LEVEL || null,
              evidenceDetails: crimeData.EVIDENCE_DETAILS || null,
            };
            
            console.log('Returning merged data');
            return NextResponse.json(mergedData);
          }
        }
      } catch (crimeError) {
        console.error('Error fetching crime data:', crimeError);
      }
    }

    // Return normalized report data
    const normalizedData = {
      type: reportData.TYPE,
      reportId: reportData.REPORT_ID,
      submittedBy: reportData.SUBMITTED_BY,
      title: reportData.TITLE,
      description: reportData.DESCRIPTION,
      location: reportData.LOCATION,
      status: reportData.STATUS,
      submittedAt: reportData.SUBMITTED_AT,
      updatedAt: reportData.UPDATED_AT,
    };

    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('=== GET REPORT ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed type
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { id } = await params;  // ← MUST await params
    const body = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/reports/${id}`, {
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
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed type
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { id } = await params;  // ← MUST await params

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/reports/${id}`, {
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
    console.error('Delete report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
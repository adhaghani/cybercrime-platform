import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${apiUrl}/api/reports/with-details${type ? `?type=${type}` : ''}`;

    const response = await fetch(url, {
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

    // Normalize the data from Oracle uppercase to camelCase
    const normalizedData = data.map((item: any) => ({
      type: item.TYPE,
      reportId: item.REPORT_ID,
      submittedBy: item.SUBMITTED_BY,
      title: item.TITLE,
      description: item.DESCRIPTION,
      location: item.LOCATION,
      status: item.STATUS,
      submittedAt: item.SUBMITTED_AT,
      updatedAt: item.UPDATED_AT,
      // Crime-specific fields
      ...(item.CRIME_CATEGORY && {
        crimeCategory: item.CRIME_CATEGORY,
        suspectDescription: item.SUSPECT_DESCRIPTION,
        victimInvolved: item.VICTIM_INVOLVED,
        weaponInvolved: item.WEAPON_INVOLVED,
        injuryLevel: item.INJURY_LEVEL,
        evidenceDetails: item.EVIDENCE_DETAILS,
      }),
      // Facility-specific fields
      ...(item.FACILITY_TYPE && {
        facilityType: item.FACILITY_TYPE,
        severityLevel: item.SEVERITY_LEVEL,
        affectedEquipment: item.AFFECTED_EQUIPMENT,
      }),
    }));

    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('Get reports with details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
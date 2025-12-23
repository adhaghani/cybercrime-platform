# Next.js API Routes Documentation

Complete API routes for the Cybercrime Platform. All routes proxy requests to the Oracle backend API with proper authentication and error handling.

## Authentication Routes

### `POST /api/auth/login`
- **Description**: Authenticate user with email and password
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: UserProfile }`
- **Sets**: HTTP-only cookie `auth_token`

### `POST /api/auth/register`
- **Description**: Register a new user account
- **Body**: `{ name: string, email: string, password: string, contact_number?: string, account_type?: 'STUDENT' | 'STAFF' }`
- **Response**: `{ message: string, account_id: number }`

### `POST /api/auth/logout`
- **Description**: Clear authentication token
- **Response**: `{ message: string }`
- **Clears**: `auth_token` cookie

### `GET /api/auth/me`
- **Description**: Get current authenticated user profile
- **Auth**: Required
- **Response**: UserProfile

### `POST /api/auth/forgot-password`
- **Description**: Request password reset email
- **Body**: `{ email: string }`
- **Response**: `{ message: string }`

### `POST /api/auth/reset-password`
- **Description**: Reset password with token from email
- **Body**: `{ token: string, password: string }`
- **Response**: `{ message: string }`

### `POST /api/auth/update-password`
- **Description**: Update password for authenticated user
- **Auth**: Required
- **Body**: `{ password: string }`
- **Response**: `{ message: string }`

---

## Accounts Routes

### `GET /api/accounts`
- **Description**: List all accounts
- **Auth**: Optional
- **Response**: Account[]

### `POST /api/accounts`
- **Description**: Create a new account
- **Body**: `{ name: string, email: string, password: string, contact_number?: string, account_type?: string }`
- **Response**: `{ message: string, account_id: number }`

### `GET /api/accounts/[id]`
- **Description**: Get account by ID
- **Params**: `id` - Account ID
- **Response**: Account

### `PUT /api/accounts/[id]`
- **Description**: Update account
- **Auth**: Required
- **Params**: `id` - Account ID
- **Body**: Partial<Account>
- **Response**: `{ message: string }`

### `DELETE /api/accounts/[id]`
- **Description**: Delete account
- **Auth**: Required
- **Params**: `id` - Account ID
- **Response**: `{ message: string }`

---

## Announcements Routes

### `GET /api/announcements`
- **Description**: List all announcements
- **Response**: Announcement[]

### `POST /api/announcements`
- **Description**: Create a new announcement
- **Auth**: Required
- **Body**: `{ title: string, message: string, audience: string, type: string, start_date: string, end_date: string }`
- **Response**: `{ message: string, announcement_id: number }`

### `GET /api/announcements/[id]`
- **Description**: Get announcement by ID
- **Params**: `id` - Announcement ID
- **Response**: Announcement

### `PUT /api/announcements/[id]`
- **Description**: Update announcement
- **Auth**: Required
- **Params**: `id` - Announcement ID
- **Body**: Partial<Announcement>
- **Response**: `{ message: string }`

### `DELETE /api/announcements/[id]`
- **Description**: Delete announcement
- **Auth**: Required
- **Params**: `id` - Announcement ID
- **Response**: `{ message: string }`

---

## Reports Routes

### `GET /api/reports`
- **Description**: List all reports
- **Query Params**: `type`, `status`, `submitted_by`
- **Response**: Report[]

### `POST /api/reports`
- **Description**: Create a new report
- **Auth**: Required
- **Body**: `{ submitted_by: string, title: string, description: string, location: string, type: 'CRIME' | 'FACILITY', status?: string, attachment_path?: string }`
- **Response**: `{ message: string, report_id: number }`

### `GET /api/reports/[id]`
- **Description**: Get report by ID
- **Params**: `id` - Report ID
- **Response**: Report

### `PUT /api/reports/[id]`
- **Description**: Update report
- **Auth**: Required
- **Params**: `id` - Report ID
- **Body**: Partial<Report>
- **Response**: `{ message: string }`

### `DELETE /api/reports/[id]`
- **Description**: Delete report
- **Auth**: Required
- **Params**: `id` - Report ID
- **Response**: `{ message: string }`

---

## Crime Reports Routes

### `GET /api/crimes`
- **Description**: List all crime reports
- **Response**: Crime[]

### `POST /api/crimes`
- **Description**: Create crime details for a report
- **Auth**: Required
- **Body**: `{ report_id: number, crime_category: string, suspect_description?: string, victim_involved?: string, injury_level?: string, weapon_involved?: string, evidence_details?: string }`
- **Response**: `{ message: string }`

### `GET /api/crimes/report/[reportId]`
- **Description**: Get crime details by report ID
- **Params**: `reportId` - Report ID
- **Response**: Crime[]

### `PUT /api/crimes/report/[reportId]`
- **Description**: Update crime details
- **Auth**: Required
- **Params**: `reportId` - Report ID
- **Body**: Partial<Crime>
- **Response**: `{ message: string }`

### `DELETE /api/crimes/report/[reportId]`
- **Description**: Delete crime record
- **Auth**: Required
- **Params**: `reportId` - Report ID
- **Response**: `{ message: string }`

---

## Facility Reports Routes

### `GET /api/facilities`
- **Description**: List all facility reports
- **Response**: Facility[]

### `POST /api/facilities`
- **Description**: Create facility details for a report
- **Auth**: Required
- **Body**: `{ report_id: number, facility_type: string, severity_level: string, affected_equipment?: string }`
- **Response**: `{ message: string }`

### `GET /api/facilities/[reportId]`
- **Description**: Get facility details by report ID
- **Params**: `reportId` - Report ID
- **Response**: Facility[]

### `PUT /api/facilities/[reportId]`
- **Description**: Update facility details
- **Auth**: Required
- **Params**: `reportId` - Report ID
- **Body**: Partial<Facility>
- **Response**: `{ message: string }`

### `DELETE /api/facilities/[reportId]`
- **Description**: Delete facility record
- **Auth**: Required
- **Params**: `reportId` - Report ID
- **Response**: `{ message: string }`

---

## Report Assignments Routes

### `GET /api/report-assignments`
- **Description**: List all report assignments
- **Auth**: Required
- **Response**: ReportAssignment[]

### `POST /api/report-assignments`
- **Description**: Assign staff to a report
- **Auth**: Required
- **Body**: `{ account_id: string, report_id: string, action_taken?: string, additional_feedback?: string }`
- **Response**: `{ message: string, assignment_id: number }`

### `PUT /api/report-assignments/[id]`
- **Description**: Update report assignment (action taken, feedback)
- **Auth**: Required
- **Params**: `id` - Assignment ID
- **Body**: `{ action_taken?: string, additional_feedback?: string }`
- **Response**: `{ message: string }`

### `DELETE /api/report-assignments/[id]`
- **Description**: Delete report assignment
- **Auth**: Required
- **Params**: `id` - Assignment ID
- **Response**: `{ message: string }`

---

## Emergency Services Routes

### `GET /api/emergency`
- **Description**: List all emergency contacts
- **Response**: EmergencyInfo[]

### `POST /api/emergency`
- **Description**: Create emergency contact
- **Auth**: Required
- **Body**: `{ name: string, address: string, phone: string, email?: string, state: string, type?: string, hotline?: string }`
- **Response**: `{ message: string, emergency_id: number }`

### `GET /api/emergency/[id]`
- **Description**: Get emergency contact by ID
- **Params**: `id` - Emergency ID
- **Response**: EmergencyInfo

### `PUT /api/emergency/[id]`
- **Description**: Update emergency contact
- **Auth**: Required
- **Params**: `id` - Emergency ID
- **Body**: Partial<EmergencyInfo>
- **Response**: `{ message: string }`

### `DELETE /api/emergency/[id]`
- **Description**: Delete emergency contact
- **Auth**: Required
- **Params**: `id` - Emergency ID
- **Response**: `{ message: string }`

---

## Police Routes

### `GET /api/police`
- **Description**: List all UiTM Auxiliary Police contacts
- **Response**: UiTMAuxiliaryPolice[]

### `POST /api/police`
- **Description**: Create police contact
- **Auth**: Required
- **Body**: `{ campus: string, column2?: string }`
- **Response**: `{ message: string, emergency_id: number }`

### `GET /api/police/[id]`
- **Description**: Get police contact by ID
- **Params**: `id` - Emergency ID
- **Response**: UiTMAuxiliaryPolice

### `PUT /api/police/[id]`
- **Description**: Update police contact details
- **Auth**: Required
- **Params**: `id` - Emergency ID
- **Body**: Partial<UiTMAuxiliaryPolice>
- **Response**: `{ message: string }`

### `DELETE /api/police/[id]`
- **Description**: Delete police contact
- **Auth**: Required
- **Params**: `id` - Emergency ID
- **Response**: `{ message: string }`

---

## Students Routes

### `GET /api/students`
- **Description**: List all students
- **Auth**: Required
- **Response**: Student[]

### `POST /api/students`
- **Description**: Create student record
- **Auth**: Required
- **Body**: `{ account_id: string, program: string, semester: number, year_of_study: number }`
- **Response**: `{ message: string }`

### `GET /api/students/[id]`
- **Description**: Get student by account ID
- **Auth**: Required
- **Params**: `id` - Account ID
- **Response**: Student

### `PUT /api/students/[id]`
- **Description**: Update student details
- **Auth**: Required
- **Params**: `id` - Account ID
- **Body**: Partial<Student>
- **Response**: `{ message: string }`

### `DELETE /api/students/[id]`
- **Description**: Delete student record
- **Auth**: Required
- **Params**: `id` - Account ID
- **Response**: `{ message: string }`

---

## Staff Routes

### `GET /api/staff`
- **Description**: List all staff members
- **Auth**: Required
- **Response**: Staff[]

### `POST /api/staff`
- **Description**: Create staff record
- **Auth**: Required
- **Body**: `{ account_id: string, role: string, department: string, position: string }`
- **Response**: `{ message: string }`

### `GET /api/staff/[id]`
- **Description**: Get staff by account ID
- **Auth**: Required
- **Params**: `id` - Account ID
- **Response**: Staff

### `PUT /api/staff/[id]`
- **Description**: Update staff details
- **Auth**: Required
- **Params**: `id` - Account ID
- **Body**: Partial<Staff>
- **Response**: `{ message: string }`

### `DELETE /api/staff/[id]`
- **Description**: Delete staff record
- **Auth**: Required
- **Params**: `id` - Account ID
- **Response**: `{ message: string }`

---

## Generated Reports Routes

### `GET /api/generated-reports`
- **Description**: List all generated reports
- **Auth**: Required
- **Response**: GeneratedReport[]

### `POST /api/generated-reports`
- **Description**: Create a generated report
- **Auth**: Required
- **Body**: `{ generated_by: string, title: string, summary: string, date_range_start: string, date_range_end: string, report_category: string, report_data_type: string, report_data: any, requested_at: string }`
- **Response**: `{ message: string, generate_id: number }`

### `GET /api/generated-reports/[id]`
- **Description**: Get generated report by ID
- **Auth**: Required
- **Params**: `id` - Generate ID
- **Response**: GeneratedReport

### `DELETE /api/generated-reports/[id]`
- **Description**: Delete generated report
- **Auth**: Required
- **Params**: `id` - Generate ID
- **Response**: `{ message: string }`

---

## Dashboard Routes

### `GET /api/dashboard/stats`
- **Description**: Get dashboard statistics
- **Auth**: Required
- **Response**: `{ totalReports: number, pendingReports: number, totalCrimes: number, totalStudents: number, ... }`

---

## AI Routes

### `POST /api/ai/generate`
- **Description**: Generate AI content using LM Studio
- **Body**: `{ prompt: string, temperature?: number, maxTokens?: number, model?: string }`
- **Response**: AI-generated content

---

## Additional Endpoints

### Bulk Operations

#### `POST /api/announcements/bulk-archive`
- **Description**: Archive multiple announcements at once
- **Auth**: Required
- **Body**: `{ ids: string[] }`
- **Response**: `{ message: string, archived: number }`

#### `DELETE /api/reports/bulk-delete`
- **Description**: Delete multiple reports at once
- **Auth**: Required
- **Body**: `{ ids: string[] }`
- **Response**: `{ message: string, deleted: number }`

#### `PUT /api/report-assignments/bulk-update`
- **Description**: Update multiple report assignments at once
- **Auth**: Required
- **Body**: `{ updates: Array<{ id: string, data: Partial<Assignment> }> }`
- **Response**: `{ message: string, updated: number }`

#### `PUT /api/reports/bulk-update-status`
- **Description**: Update status for multiple reports at once
- **Auth**: Required
- **Body**: `{ ids: string[], status: ReportStatus }`
- **Response**: `{ message: string, updated: number }`

### Export & Download Endpoints

#### `GET /api/reports/export`
- **Description**: Export reports to CSV or Excel format
- **Auth**: Required
- **Query Params**: `format=csv|xlsx, type?, status?, date_from?, date_to?`
- **Response**: Binary file (CSV or XLSX)

#### `GET /api/generated-reports/[id]/download`
- **Description**: Download a generated report file (PDF)
- **Auth**: Required
- **Params**: `id` - Report ID
- **Response**: Binary file (PDF)

#### `GET /api/students/export`
- **Description**: Export students list to CSV or Excel
- **Auth**: Required
- **Query Params**: `format=csv|xlsx, program?, semester?, year?`
- **Response**: Binary file (CSV or XLSX)

#### `GET /api/staff/export`
- **Description**: Export staff list to CSV or Excel
- **Auth**: Required
- **Query Params**: `format=csv|xlsx, department?, role?`
- **Response**: Binary file (CSV or XLSX)

### Analytics & Aggregation Endpoints

#### `GET /api/reports/by-location`
- **Description**: Get reports grouped by location with counts
- **Auth**: Required
- **Query Params**: `date_from?, date_to?`
- **Response**: `Array<{ location: string, count: number }>`

#### `GET /api/reports/by-date-range`
- **Description**: Get time-series data for reports
- **Auth**: Required
- **Query Params**: `date_from, date_to, group_by=day|week|month`
- **Response**: `Array<{ date: string, count: number }>`

#### `GET /api/crimes/by-category`
- **Description**: Get crime statistics grouped by crime category
- **Auth**: Required
- **Query Params**: `date_from?, date_to?`
- **Response**: `Array<{ category: string, count: number }>`

#### `GET /api/facilities/by-severity`
- **Description**: Get facility issue statistics grouped by severity level
- **Auth**: Required
- **Query Params**: `date_from?, date_to?, facility_type?`
- **Response**: `Array<{ severity: string, count: number }>`

### Search Endpoints

#### `GET /api/reports/search`
- **Description**: Advanced search for reports with filters
- **Auth**: Required
- **Query Params**: `q?, type?, status?, date_from?, date_to?, location?, page?, limit?`
- **Response**: Paginated report list

#### `GET /api/announcements/search`
- **Description**: Advanced search for announcements
- **Auth**: Required
- **Query Params**: `q?, priority?, type?, target_audience?, page?, limit?`
- **Response**: Paginated announcement list

#### `GET /api/students/search`
- **Description**: Search for students with filters
- **Auth**: Required
- **Query Params**: `q?, program?, semester?, year?, page?, limit?`
- **Response**: Paginated student list

#### `GET /api/staff/search`
- **Description**: Search for staff members with filters
- **Auth**: Required
- **Query Params**: `q?, department?, role?, page?, limit?`
- **Response**: Paginated staff list

### My Reports Endpoints

#### `GET /api/reports/my-reports`
- **Description**: Get reports submitted by the current authenticated user
- **Auth**: Required
- **Query Params**: `type?, status?, page?, limit?`
- **Response**: Paginated report list

#### `GET /api/crimes/my-reports`
- **Description**: Get crime reports submitted by the current user
- **Auth**: Required
- **Query Params**: `page?, limit?`
- **Response**: Paginated crime report list

#### `GET /api/facilities/my-reports`
- **Description**: Get facility reports submitted by the current user
- **Auth**: Required
- **Query Params**: `severity_level?, page?, limit?`
- **Response**: Paginated facility report list

### Assignment Filtering

#### `GET /api/report-assignments/my-assignments`
- **Description**: Get assignments for the current authenticated staff member
- **Auth**: Required
- **Query Params**: `status?, page?, limit?`
- **Response**: Paginated assignment list

#### `GET /api/report-assignments/by-staff/[staffId]`
- **Description**: Get all assignments for a specific staff member
- **Auth**: Required
- **Params**: `staffId` - Staff Account ID
- **Query Params**: `page?, limit?`
- **Response**: Paginated assignment list

#### `GET /api/report-assignments/by-report/[reportId]`
- **Description**: Get all assignments for a specific report
- **Auth**: Required
- **Params**: `reportId` - Report ID
- **Query Params**: `page?, limit?`
- **Response**: Paginated assignment list

### Announcement Filtering

#### `GET /api/announcements/active`
- **Description**: Get currently active announcements (within date range)
- **Auth**: Optional
- **Query Params**: `page?, limit?`
- **Response**: Paginated announcement list

#### `GET /api/announcements/by-audience/[audience]`
- **Description**: Get announcements for a specific target audience
- **Auth**: Optional
- **Params**: `audience` - Target audience (ALL|STUDENT|STAFF|ADMIN)
- **Query Params**: `page?, limit?`
- **Response**: Paginated announcement list

### User Profile Endpoints

#### `GET /api/users/profile`
- **Description**: Get current user's complete profile
- **Auth**: Required
- **Response**: UserProfile with account, student/staff details

#### `PUT /api/users/profile`
- **Description**: Update current user's profile
- **Auth**: Required
- **Body**: Partial<UserProfile>
- **Response**: `{ message: string }`

#### `GET /api/users/[id]/reports`
- **Description**: Get all reports submitted by a specific user
- **Auth**: Required
- **Params**: `id` - User Account ID
- **Query Params**: `page?, limit?`
- **Response**: Paginated report list

#### `GET /api/users/[id]/assignments`
- **Description**: Get all assignments for a specific staff user
- **Auth**: Required
- **Params**: `id` - Staff Account ID
- **Query Params**: `page?, limit?`
- **Response**: Paginated assignment list

### Dashboard Analytics

#### `GET /api/dashboard/stats`
- **Description**: Get overall dashboard statistics
- **Auth**: Required
- **Response**: `{ totalReports, pendingReports, resolvedReports, totalCrimes, totalFacilities, ... }`

#### `GET /api/dashboard/user-stats`
- **Description**: Get user-specific statistics
- **Auth**: Required
- **Response**: `{ myReports, myAssignments, pendingActions, ... }`

#### `GET /api/dashboard/recent-activity`
- **Description**: Get recent activity feed
- **Auth**: Required
- **Query Params**: `limit?, days?`
- **Response**: Array of recent activities

#### `GET /api/dashboard/charts`
- **Description**: Get data for dashboard charts
- **Auth**: Required
- **Query Params**: `period=week|month|year`
- **Response**: Chart data arrays

---

## Usage Examples

### Frontend Usage with Fetch

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

// Get reports
const reports = await fetch('/api/reports');
const data = await reports.json();

// Create report (authenticated)
const newReport = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    submitted_by: userId,
    title: 'Theft Report',
    description: 'Description...',
    location: 'Campus Area A',
    type: 'CRIME',
  }),
});
```

### Using API Client

```typescript
import { apiClient } from '@/lib/api/client';

// Authenticated requests automatically include token from cookies
const reports = await apiClient.get('/api/reports');
const newReport = await apiClient.post('/api/reports', reportData);
```

---

## Error Responses

All endpoints return consistent error responses:

```typescript
{
  error: string;        // Error message
  status?: number;      // HTTP status code
  errors?: any;         // Additional error details
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

- Routes marked with **Auth: Required** need authentication
- Authentication token is stored in HTTP-only cookie `auth_token`
- Token is automatically included in requests by the Next.js API routes
- Token is validated by the backend Oracle API

---

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend Oracle API URL
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

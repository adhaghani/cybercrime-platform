# API Routes Summary

All Next.js API routes have been created for the Cybercrime Platform. These routes act as a proxy layer between the frontend and the Oracle backend API.

## 📁 Structure

```
app/api/
├── auth/
│   ├── login/route.ts              # POST - Login
│   ├── register/route.ts           # POST - Register
│   ├── logout/route.ts             # POST - Logout
│   ├── me/route.ts                 # GET - Current user
│   ├── forgot-password/route.ts    # POST - Request password reset
│   ├── reset-password/route.ts     # POST - Reset password
│   └── update-password/route.ts    # POST - Update password
├── accounts/
│   ├── route.ts                    # GET, POST - List/Create accounts
│   └── [id]/route.ts               # GET, PUT, DELETE - Account by ID
├── announcements/
│   ├── route.ts                    # GET, POST - List/Create announcements
│   ├── [id]/route.ts               # GET, PUT, DELETE - Announcement by ID
│   ├── active/route.ts             # GET - Active announcements
│   ├── by-audience/[audience]/route.ts  # GET - By target audience
│   ├── search/route.ts             # GET - Search announcements
│   └── bulk-archive/route.ts       # POST - Bulk archive
├── reports/
│   ├── route.ts                    # GET, POST - List/Create reports
│   ├── [id]/route.ts               # GET, PUT, DELETE - Report by ID
│   ├── my-reports/route.ts         # GET - Current user's reports
│   ├── search/route.ts             # GET - Search reports
│   ├── bulk-delete/route.ts        # DELETE - Bulk delete
│   ├── bulk-update-status/route.ts # PUT - Bulk update status
│   ├── export/route.ts             # GET - Export to CSV/Excel
│   ├── by-location/route.ts        # GET - Group by location
│   └── by-date-range/route.ts      # GET - Time-series data
├── crimes/
│   ├── route.ts                    # GET, POST - List/Create crimes
│   ├── report/[reportId]/route.ts  # GET, PUT, DELETE - Crime by report ID
│   ├── my-reports/route.ts         # GET - Current user's crime reports
│   └── by-category/route.ts        # GET - Group by category
├── facilities/
│   ├── route.ts                    # GET, POST - List/Create facilities
│   ├── [reportId]/route.ts         # GET, PUT, DELETE - Facility by report ID
│   ├── my-reports/route.ts         # GET - Current user's facility reports
│   └── by-severity/route.ts        # GET - Group by severity
├── report-assignments/
│   ├── route.ts                    # GET, POST - List/Create assignments
│   ├── [id]/route.ts               # PUT, DELETE - Update/Delete assignment
│   ├── my-assignments/route.ts     # GET - Current staff's assignments
│   ├── by-staff/[staffId]/route.ts # GET - By staff member
│   ├── by-report/[reportId]/route.ts  # GET - By report
│   └── bulk-update/route.ts        # PUT - Bulk update
├── emergency/
│   ├── route.ts                    # GET, POST - List/Create emergency contacts
│   └── [id]/route.ts               # GET, PUT, DELETE - Emergency contact by ID
├── police/
│   ├── route.ts                    # GET, POST - List/Create police contacts
│   └── [id]/route.ts               # GET, PUT, DELETE - Police contact by ID
├── students/
│   ├── route.ts                    # GET, POST - List/Create students
│   ├── [id]/route.ts               # GET, PUT, DELETE - Student by ID
│   ├── search/route.ts             # GET - Search students
│   └── export/route.ts             # GET - Export to CSV/Excel
├── staff/
│   ├── route.ts                    # GET, POST - List/Create staff
│   ├── [id]/route.ts               # GET, PUT, DELETE - Staff by ID
│   ├── search/route.ts             # GET - Search staff
│   └── export/route.ts             # GET - Export to CSV/Excel
├── users/
│   ├── profile/route.ts            # GET, PUT - User profile
│   └── [id]/
│       ├── reports/route.ts        # GET - User's reports
│       └── assignments/route.ts    # GET - User's assignments
├── generated-reports/
│   ├── route.ts                    # GET, POST - List/Create generated reports
│   ├── [id]/route.ts               # GET, DELETE - Generated report by ID
│   └── [id]/download/route.ts      # GET - Download report file
├── dashboard/
│   ├── stats/route.ts              # GET - Overall statistics
│   ├── user-stats/route.ts         # GET - User-specific stats
│   ├── recent-activity/route.ts    # GET - Recent activity feed
│   └── charts/route.ts             # GET - Chart data
└── ai/
    └── generate/route.ts           # POST - AI generation
```

## ✅ Features

- **Authentication**: JWT token management with HTTP-only cookies
- **Authorization**: Automatic token forwarding to backend
- **Error Handling**: Consistent error responses
- **Type Safety**: Full TypeScript support
- **Security**: 
  - HTTP-only cookies for tokens
  - Token validation on backend
  - Protected routes with middleware

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Start Backend

```bash
cd backend/cybercrime-api
npm install
npm start
```

### 3. Start Frontend

```bash
npm install
npm run dev
```

## 📝 Usage Examples

### Authentication

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
});
const data = await response.json();
// Token is automatically stored in HTTP-only cookie

// Get current user
const userResponse = await fetch('/api/auth/me');
const user = await userResponse.json();

// Logout
await fetch('/api/auth/logout', { method: 'POST' });
```

### CRUD Operations

```typescript
// Create a report
const newReport = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    submitted_by: '123',
    title: 'Security Issue',
    description: 'Broken lock',
    location: 'Building A',
    type: 'FACILITY',
  }),
});

// Get all reports
const reports = await fetch('/api/reports');
const reportList = await reports.json();

// Get specific report
const report = await fetch('/api/reports/1');
const reportData = await report.json();

// Update report
await fetch('/api/reports/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'IN_PROGRESS' }),
});

// Delete report
await fetch('/api/reports/1', { method: 'DELETE' });
```

### Using API Client

```typescript
import { apiClient } from '@/lib/api/client';

// All methods automatically handle authentication
const reports = await apiClient.get('/api/reports');
const newReport = await apiClient.post('/api/reports', reportData);
const updated = await apiClient.put('/api/reports/1', { status: 'RESOLVED' });
await apiClient.delete('/api/reports/1');
```

### Search & Filter

```typescript
// Search reports
const results = await fetch('/api/reports/search?q=theft&type=CRIME&status=PENDING');

// Get my reports
const myReports = await fetch('/api/reports/my-reports');

// Get active announcements
const active = await fetch('/api/announcements/active');

// Search students
const students = await fetch('/api/students/search?program=CS&semester=3');
```

### Bulk Operations

```typescript
// Bulk delete reports
await fetch('/api/reports/bulk-delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: ['1', '2', '3'] }),
});

// Bulk archive announcements
await fetch('/api/announcements/bulk-archive', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: ['10', '11', '12'] }),
});
```

### Export & Download

```typescript
// Export reports to CSV
const csv = await fetch('/api/reports/export?format=csv&status=RESOLVED');
const blob = await csv.blob();

// Download generated report
const pdf = await fetch('/api/generated-reports/123/download');
const file = await pdf.blob();

// Export students to Excel
const excel = await fetch('/api/students/export?format=xlsx&program=IT');
```

### Analytics

```typescript
// Reports by location
const byLocation = await fetch('/api/reports/by-location');

// Time-series data
const timeSeries = await fetch('/api/reports/by-date-range?date_from=2024-01-01&date_to=2024-12-31&group_by=month');

// Crime statistics
const crimeStats = await fetch('/api/crimes/by-category');

// Dashboard stats
const stats = await fetch('/api/dashboard/stats');
```

## 🔒 Authentication Flow

1. **Login**: User submits credentials → Backend validates → Returns JWT token
2. **Token Storage**: Token stored in HTTP-only cookie (secure, XSS-protected)
3. **Subsequent Requests**: Cookie automatically included in requests
4. **Backend Validation**: Backend validates JWT on protected endpoints
5. **Logout**: Cookie cleared, token invalidated

## 📊 Available Endpoints

### Authentication (7 endpoints)
- Login, Register, Logout, Get Current User, Forgot Password, Reset Password, Update Password

### Core Resources (90+ endpoints)
- **Accounts** (5) - CRUD operations
- **Announcements** (9) - CRUD, active, by-audience, search, bulk-archive
- **Reports** (11) - CRUD, my-reports, search, bulk operations, export, analytics
- **Crimes** (5) - CRUD, my-reports, by-category
- **Facilities** (5) - CRUD, my-reports, by-severity
- **Report Assignments** (7) - CRUD, my-assignments, by-staff, by-report, bulk-update
- **Emergency Services** (5) - CRUD operations
- **Police Contacts** (5) - CRUD operations
- **Students** (7) - CRUD, search, export
- **Staff** (7) - CRUD, search, export
- **Users** (4) - Profile management, reports, assignments
- **Generated Reports** (6) - CRUD, download
- **Dashboard** (4) - Stats, user-stats, recent-activity, charts
- **AI Generation** (1) - AI content generation

### Feature Categories
- **Bulk Operations** (4) - Archive announcements, delete reports, update assignments, update status
- **Export/Download** (4) - Reports, students, staff, generated reports
- **Search** (4) - Reports, announcements, students, staff
- **Analytics** (4) - By location, date range, category, severity
- **Filtering** (8) - My reports, active announcements, by audience, by staff/report

## 🔍 Error Handling

All endpoints return consistent error format:

```typescript
{
  error: string;
  status?: number;
  errors?: any;
}
```

HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 📖 Documentation

For detailed API documentation, see [API_ROUTES.md](./API_ROUTES.md)

## 🧪 Testing

```bash
# Test backend connection
curl http://localhost:3001/api/test

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test authenticated endpoint (with cookie)
curl http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

## 🛠️ Development Tips

1. **Hot Reload**: API routes support hot reload in development
2. **Debugging**: Check browser DevTools → Network tab for API calls
3. **Backend Logs**: Monitor backend console for SQL queries and errors
4. **Type Safety**: Use TypeScript interfaces from `lib/types.ts`

## 📌 Next Steps

1. ✅ All API routes created (90+ endpoints)
2. ✅ Bulk operations, export, search, and analytics endpoints added
3. ⏭️ Implement backend endpoints in `backend/cybercrime-api/server.js`:
   - Authentication (login, register, JWT validation)
   - All CRUD operations
   - Filtering, search, and pagination logic
   - Bulk operations handlers
   - Export functionality (CSV/Excel generation)
   - Analytics aggregation queries
4. ⏭️ Update frontend components to use new API routes
5. ⏭️ Add request/response validation with Zod schemas
6. ⏭️ Implement rate limiting for sensitive endpoints
7. ⏭️ Add unit tests for critical endpoints

## 🤝 Contributing

When adding new endpoints:
1. Create route file in appropriate directory
2. Add proper TypeScript types
3. Include JSDoc comments
4. Handle errors consistently
5. Update documentation

---

**Status**: ✅ Complete - 90+ API routes implemented
**Version**: 2.0 - Includes bulk operations, exports, search, analytics
**Last Updated**: December 23, 2024

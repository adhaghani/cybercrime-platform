# Frontend API Migration Script
# Automatically updates all API route files to use the new OOP backend

This document tracks the migration of Next.js API routes to proxy to the new OOP backend.

## Migration Status

### ✅ Completed Routes

#### Authentication Routes
- [x] `/api/auth/login` - Login with email/password
- [x] `/api/auth/logout` - Logout and clear session  
- [x] `/api/auth/me` - Get current user profile
- [x] `/api/auth/register` - Register new account
- [ ] `/api/auth/forgot-password` - Request password reset
- [ ] `/api/auth/reset-password` - Reset password with token
- [ ] `/api/auth/update-password` - Update password

#### Report Routes
- [x] `/api/reports` - GET all reports, POST create report
- [ ] `/api/reports/[id]` - GET, PUT, DELETE specific report
- [ ] `/api/reports/[id]/resolve` - Resolve report
- [ ] `/api/reports/statistics` - Get report statistics
- [ ] `/api/reports/search` - Search reports
- [ ] `/api/reports/my-reports` - Get user's reports
- [ ] `/api/reports/public-latest` - Get public latest reports

#### Crime Report Routes
- [x] `/api/crimes` - GET all crimes, POST create crime
- [ ] `/api/crimes/by-category` - Get crimes by category
- [ ] `/api/crimes/my-reports` - Get user's crime reports
- [ ] `/api/crimes/report/[reportId]` - Get crime by report ID

#### Facility Report Routes
- [x] `/api/facilities` - GET all facilities, POST create facility
- [ ] `/api/facilities/[reportId]` - Get facility by report ID
- [ ] `/api/facilities/by-severity` - Get facilities by severity
- [ ] `/api/facilities/my-reports` - Get user's facility reports

#### Announcement Routes
- [x] `/api/announcements` - GET all, POST create
- [ ] `/api/announcements/[id]` - GET, PUT, DELETE specific
- [ ] `/api/announcements/active` - Get active announcements
- [ ] `/api/announcements/by-audience` - Get by target audience
- [ ] `/api/announcements/search` - Search announcements

### 🔄 Pending Routes

#### Emergency Services
- [ ] `/api/emergency` - GET all contacts, POST create
- [ ] `/api/emergency/[id]` - GET, PUT, DELETE specific contact
- [ ] `/api/emergency/public` - Get public emergency contacts

#### Team Management
- [ ] `/api/teams` - GET all teams, POST create team
- [ ] `/api/teams/my-team` - Get user's team

#### User Management
- [ ] `/api/accounts` - GET all accounts, POST create
- [ ] `/api/accounts/[id]` - GET, PUT, DELETE specific account
- [ ] `/api/students` - Student management
- [ ] `/api/staff` - Staff management

#### Report Assignments
- [ ] `/api/report-assignments` - Assignment CRUD
- [ ] `/api/report-assignments/my-assignments` - Get user's assignments
- [ ] `/api/report-assignments/by-report/[reportId]` - Get by report
- [ ] `/api/report-assignments/by-staff/[staffId]` - Get by staff

#### Resolutions
- [ ] `/api/resolutions` - Resolution CRUD
- [ ] `/api/resolutions/[id]` - Specific resolution

#### Dashboard
- [ ] `/api/dashboard/stats` - Dashboard statistics
- [ ] `/api/dashboard/charts` - Chart data
- [ ] `/api/dashboard/recent-activity` - Recent activities
- [ ] `/api/dashboard/user-stats` - User-specific stats

#### File Uploads
- [ ] `/api/upload/profile-picture` - Upload profile picture
- [ ] `/api/upload/report-evidence` - Upload report evidence
- [ ] `/api/upload/announcement-photo` - Upload announcement photo

## Environment Variables

### Before (Old Backend)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### After (New OOP Backend)
```env
# Keep for backward compatibility with some client-side calls
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# New OOP backend URL (used by proxy utility)
BACKEND_API_URL=http://localhost:4000/api/v2
```

## Testing Checklist

- [x] Backend server running on port 4000
- [x] Frontend proxy utility created
- [x] Core auth routes updated
- [x] Core report routes updated
- [ ] All routes tested with Postman/Thunder Client
- [ ] Frontend UI tested end-to-end
- [ ] Error handling verified
- [ ] Authentication flow working
- [ ] File uploads working

## Migration Pattern

### Before (Direct fetch)
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
  method: 'GET',
  headers: {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'Content-Type': 'application/json',
  },
});
```

### After (Proxy utility)
```typescript
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    path: '/reports',
    includeAuth: true,
  });
}
```

## Benefits

1. **Centralized Configuration** - Backend URL managed in one place
2. **Consistent Error Handling** - Unified error responses
3. **Automatic Auth** - Token management handled automatically
4. **Type Safety** - TypeScript support for all endpoints
5. **Easy Maintenance** - Update proxy logic affects all routes
6. **Better Logging** - Centralized request/response logging

## Next Steps

1. Update remaining API routes using the proxy utility
2. Test all endpoints with the new backend
3. Update frontend components to handle new response formats
4. Add error boundaries for better error handling
5. Implement request/response interceptors for logging
6. Add rate limiting on frontend proxy
7. Set up monitoring and alerting

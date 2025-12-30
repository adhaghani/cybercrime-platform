# Quick Start Guide - New OOP Backend Integration

## Prerequisites

- Node.js 18+ installed
- Oracle Database running
- npm or yarn package manager

## Step 1: Environment Setup

### 1.1 Create Environment Files

**Root directory `.env.local`:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Frontend API routes (for client-side calls)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# New OOP Backend URL (server-side proxy)
BACKEND_API_URL=http://localhost:4000/api/v2

NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend directory `.env`:**
```bash
cd backend/cybercrime-api-v2
cp .env.example .env
```

Edit `backend/cybercrime-api-v2/.env`:
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Your Oracle DB credentials
DB_USER=PDBADMIN
DB_PASSWORD=PDBADMIN
DB_CONNECT_STRING=localhost:1521/CYBERCRIME

DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_INCREMENT=1

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

LOG_LEVEL=info
```

## Step 2: Install Dependencies

### Frontend
```bash
# From project root
npm install
```

### Backend
```bash
cd backend/cybercrime-api-v2
npm install
```

## Step 3: Start the Backend

```bash
cd backend/cybercrime-api-v2

# Build TypeScript
npm run build

# Start server
npm start

# Or for development with auto-reload:
npm run dev
```

**Expected output:**
```
🚀 Server running on port 4000
📝 Environment: development
🌐 API v2 available at: http://localhost:4000/api/v2
❤️  Health check: http://localhost:4000/api/v2/health
✅ Database connected successfully
```

## Step 4: Verify Backend is Running

Open a new terminal and test:

```bash
# Health check
curl http://localhost:4000/api/v2/health

# Should return something like:
# {"status":"healthy","database":"connected","timestamp":"..."}
```

## Step 5: Start the Frontend

```bash
# From project root
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

## Step 6: Test the Integration

### 6.1 Browser Test

1. Open http://localhost:3000
2. Navigate to login page
3. Open browser DevTools (F12) → Network tab
4. Try to login
5. Verify API calls go through the proxy:
   - Frontend calls: `http://localhost:3000/api/auth/login`
   - Backend receives: `http://localhost:4000/api/v2/auth/login`

### 6.2 Command Line Test

```bash
# Test backend directly
curl http://localhost:4000/api/v2/reports

# Test through frontend proxy
curl http://localhost:3000/api/reports
```

### 6.3 Run Test Script

```bash
cd backend/cybercrime-api-v2
chmod +x test-api.sh
./test-api.sh
```

## Step 7: Common Issues & Solutions

### Issue: "Connection refused" on port 4000
**Solution:** Backend not running. Start it with `npm start`

### Issue: "Database connection failed"
**Solution:** 
- Check Oracle DB is running
- Verify DB credentials in `.env`
- Test connection: `sqlplus PDBADMIN/PDBADMIN@localhost:1521/CYBERCRIME`

### Issue: "CORS error"
**Solution:** 
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check backend CORS configuration in `src/app.ts`

### Issue: "401 Unauthorized"
**Solution:**
- Login first to get JWT token
- Check token is being set in cookies
- Verify `auth_token` cookie exists in browser DevTools

### Issue: Frontend calls fail with "Network error"
**Solution:**
- Check both frontend and backend are running
- Verify `BACKEND_API_URL` in frontend `.env.local`
- Check no firewall blocking localhost:4000

## Step 8: Development Workflow

### Making Changes to Backend

1. Edit files in `backend/cybercrime-api-v2/src/`
2. Rebuild: `npm run build`
3. Restart server: `npm start` or use `npm run dev` for auto-reload
4. Test changes

### Making Changes to Frontend API Routes

1. Edit files in `app/api/`
2. Changes are hot-reloaded automatically
3. Refresh browser to test

### Database Schema Changes

1. Connect to Oracle: `sqlplus PDBADMIN/PDBADMIN@localhost:1521/CYBERCRIME`
2. Run your SQL scripts
3. Update models in `backend/cybercrime-api-v2/src/models/`
4. Update repositories if needed
5. Rebuild and restart backend

## Step 9: Testing Checklist

Use this checklist to verify everything works:

### Authentication
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Logout clears session
- [ ] `/auth/me` returns current user
- [ ] Protected routes require authentication
- [ ] Token expires after 7 days

### Reports
- [ ] Create new report
- [ ] List all reports
- [ ] View specific report
- [ ] Update report status
- [ ] Delete report
- [ ] Search reports
- [ ] Filter reports by status/type

### Crime Reports
- [ ] Create crime report
- [ ] List all crimes
- [ ] View crime details
- [ ] Get crimes by category
- [ ] Get crime statistics

### Facility Reports
- [ ] Create facility report
- [ ] List all facilities
- [ ] View facility details
- [ ] Get facilities by type
- [ ] Get maintenance required facilities
- [ ] Get cost summary

### Announcements
- [ ] Create announcement (admin)
- [ ] List announcements
- [ ] View announcement details
- [ ] Get active announcements (public)
- [ ] Update announcement
- [ ] Delete announcement

## Step 10: Monitoring

### View Backend Logs
```bash
cd backend/cybercrime-api-v2
tail -f logs/app.log  # if you have file logging
# or just watch terminal output
```

### View Database Queries
Set `LOG_LEVEL=debug` in backend `.env` to see SQL queries

### Frontend Console
Open browser DevTools → Console to see:
- API call logs
- Authentication status
- Error messages

## Next Steps

Once everything is working:

1. **Update remaining API routes** - See `docs/API_MIGRATION_STATUS.md`
2. **Add tests** - Write integration tests for all endpoints
3. **Set up production environment** - Configure for deployment
4. **Add monitoring** - Implement logging and alerting
5. **Optimize performance** - Add caching, connection pooling
6. **Security hardening** - Rate limiting, input validation
7. **Documentation** - API documentation with Swagger/OpenAPI

## Useful Commands

```bash
# Backend
cd backend/cybercrime-api-v2
npm run build          # Compile TypeScript
npm start              # Start production server
npm run dev            # Start development server with auto-reload
npm test               # Run tests (when implemented)
./test-api.sh          # Test API endpoints

# Frontend
npm run dev            # Start Next.js dev server
npm run build          # Build for production
npm run lint           # Lint code
npm run type-check     # Check TypeScript types

# Database
sqlplus PDBADMIN/PDBADMIN@localhost:1521/CYBERCRIME  # Connect to DB
```

## Support

If you encounter issues:

1. Check logs in both frontend and backend terminals
2. Verify all environment variables are set correctly
3. Ensure Oracle DB is running and accessible
4. Check the migration status document
5. Review the integration guide

## Success Indicators

You know everything is working when:

✅ Backend starts without errors on port 4000
✅ Frontend starts without errors on port 3000
✅ Health endpoint returns "healthy"
✅ Login works and sets auth cookie
✅ Protected routes work with authentication
✅ Database queries execute successfully
✅ API calls proxy correctly to backend
✅ Error messages are informative

Happy coding! 🚀

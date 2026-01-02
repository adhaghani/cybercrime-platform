# Forgot Password Feature - Setup Guide

## Overview
The forgot password feature has been implemented using Resend email service. This allows users to securely reset their passwords via email.

## Setup Steps

### 1. Database Migration
Run the SQL migration to create the password reset tokens table:

```bash
# Connect to your Oracle database and run:
sqlplus PDBADMIN/PDBADMIN@localhost:1521/CYBERCRIME @database/migrations/002_create_password_reset_tokens.sql
```

Or execute the SQL file manually in your database client.

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 3. Domain Configuration (For Production)

For production use, you need to verify your domain:

1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add the provided DNS records to your domain
4. Wait for verification (usually takes a few minutes)

For development/testing, you can use the default sending domain provided by Resend (limited to 100 emails/day).

### 4. Environment Variables

Add these variables to your `.env` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com  # Use your verified domain

# Frontend URL (for reset links in emails)
FRONTEND_URL=http://localhost:3000  # Change to your production URL in production
```

### 5. Update Environment Config

The environment variables are already configured in `src/config/app.config.ts`.

### 6. Test the Feature

1. Start the backend server:
   ```bash
   cd backend/cybercrime-api-v2
   npm run dev
   ```

2. Test the forgot password endpoint:
   ```bash
   curl -X POST http://localhost:4000/api/v2/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com"}'
   ```

3. Check your email for the reset link

4. Test the reset password endpoint:
   ```bash
   curl -X POST http://localhost:4000/api/v2/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token": "token_from_email", "password": "NewPassword123!"}'
   ```

## Flow Overview

1. **User requests password reset** → `POST /api/v2/auth/forgot-password`
   - System generates a secure random token
   - Token is hashed and stored in database with 1-hour expiry
   - Email sent to user with reset link

2. **User clicks reset link** → Opens frontend page with token
   - Frontend displays reset password form
   - Token is included in the URL query parameter

3. **User submits new password** → `POST /api/v2/auth/reset-password`
   - System validates token (not expired, not used)
   - Password strength is validated
   - Password is updated in database
   - Token is marked as used
   - Confirmation email is sent

## Security Features

- ✅ Tokens are cryptographically secure (32 bytes)
- ✅ Tokens are hashed before storage
- ✅ Tokens expire after 1 hour
- ✅ Tokens are single-use only
- ✅ Old tokens are automatically invalidated when new ones are created
- ✅ Password strength validation enforced
- ✅ No information disclosure about email existence

## Email Templates

The email templates are located in:
- `/email-templates/password-reset.html` - Main reset email template

## Troubleshooting

### Emails not sending

1. **Check API key**: Ensure `RESEND_API_KEY` is correctly set
2. **Check FROM email**: Must use verified domain in production
3. **Check logs**: Look for errors in backend console
4. **Rate limits**: Free tier has 100 emails/day limit

### Token validation errors

1. **Token expired**: Tokens are valid for 1 hour only
2. **Token already used**: Each token can only be used once
3. **Invalid token**: Check that token from URL matches what's sent to API

### Database errors

1. **Table not found**: Run the migration script
2. **Connection issues**: Check database configuration in `.env`

## API Endpoints

### Forgot Password
```
POST /api/v2/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "If your email is registered, you will receive a password reset link."
}
```

### Reset Password
```
POST /api/v2/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "password": "NewSecurePassword123!"
}

Response: 200 OK
{
  "message": "Password reset successful. You can now login with your new password."
}

Response: 400 Bad Request (if token invalid)
{
  "error": "Invalid or expired reset token"
}
```

## Frontend Integration

The frontend is already set up:
- Form: `/app/auth/forgot-password/page.tsx`
- API client: `/lib/api/auth.ts` → `requestPasswordReset()` function

## Maintenance

Run periodic cleanup of expired tokens:

```sql
DELETE FROM PASSWORD_RESET_TOKENS WHERE EXPIRES_AT < SYSDATE OR USED = 1;
```

Consider adding this as a scheduled job (cron) in production.

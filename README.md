This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## UiTM Cybercrime Platform

A comprehensive campus crime and facility reporting platform for UiTM with emergency services directory, statistics, and user dashboards.

### Tech Stack

- **Frontend**: Next.js 15.4.6 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui (@radix-ui primitives)
- **Styling**: Tailwind CSS
- **Backend**: Express.js + Oracle Database
- **Charts**: Recharts
- **Validation**: Zod
- **Forms**: React Hook Form

## Environment Variables

This project uses an Express.js backend with Oracle Database. Create a `.env.local` file (copy from `.env.example`) and fill in the values before running the app.

Required variables:

- `NEXT_PUBLIC_API_URL` — Your backend API URL (default: http://localhost:3001)
- `NODE_ENV` — Environment (development/production)
- `NEXT_PUBLIC_SITE_URL` — Your site URL (for SEO)

Example `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Make sure `.env.local` is in your `.gitignore` (this repo ignores it by default).

## Backend Setup

The backend API is located in `backend/cybercrime-api/`. It uses Express.js with Oracle Database.

### Starting the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend/cybercrime-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure Oracle Database is running and configured in `server.js`:
   ```javascript
   const dbConfig = {
     user: 'PDBADMIN',
     password: 'PDBADMIN',
     connectString: 'localhost:1521/FREEPDB1'
   };
   ```

4. Start the server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:3001` by default.

### Available API Endpoints

- `GET /api/test` - Health check
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/status/:status` - Get reports by status
- `POST /api/reports` - Create new report
- `GET /api/crimes` - Get all crimes
- `GET /api/announcements` - Get all announcements
- `GET /api/emergency` - Get emergency contacts
- `GET /api/staff` - Get all staff
- `GET /api/users` - Get all users/students
- `GET /api/dashboard/stats` - Get dashboard statistics

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

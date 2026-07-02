# PropertyFlow Database Setup (PostgreSQL + Supabase)

## Overview
This document outlines the steps taken to configure PropertyFlow's backend to use PostgreSQL via Supabase and Prisma ORM.

## Files Modified
- `backend/.env`: Updated to include `DATABASE_URL` and `DIRECT_URL` placeholders for Supabase.
- `backend/prisma/schema.prisma`:
  - Changed `provider` to `postgresql`.
  - Enforced UUID primary keys.
  - Implemented standard and composite indexes.
  - Replaced string types with Prisma Enums (`UserRole`, `MaintenancePriority`, `MaintenanceStatus`, `BookingStatus`).
  - Added soft deletes (`deletedAt`) to all core entities.
  - Retained `AuditLog` and `Notification` as internal infrastructure tables.
- `backend/package.json`: Added `prisma:seed` script configuration.
- `backend/prisma/seed.ts`: Created with minimal generic seed data per PRD specifications.
- `backend/src/modules/*`: Fixed TypeScript errors stemming from the transition from string-based roles and statuses to Prisma Enums.

## Prisma Commands Executed
- `npm install @prisma/client prisma`
- `npx prisma generate` (Successfully generated Prisma Client)
- `npx tsc` (Verified backend compilation successfully with 0 errors)

## Manual Verification Steps Required
Because the credentials are not hardcoded, you must complete the following manual steps:

1. **Update Environment Variables**
   Open `backend/.env` and replace `<PASSWORD>` and `db.xxxxxxxxx.supabase.co` in the `DATABASE_URL` and `DIRECT_URL` with your actual Supabase credentials:
   ```env
   DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@<YOUR_SUPABASE_HOST>:5432/postgres"
   DIRECT_URL="postgresql://postgres:<YOUR_PASSWORD>@<YOUR_SUPABASE_HOST>:5432/postgres"
   ```

2. **Run Initial Database Migration**
   Execute the following command in the `backend` directory to create the tables in Supabase:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the Database**
   Populate the database with the minimal generic development data:
   ```bash
   npm run prisma:seed
   ```
   *(Or run `npx prisma db seed`)*

4. **Verify Backend Startup**
   Start the backend development server to ensure it runs correctly:
   ```bash
   npm run dev
   ```

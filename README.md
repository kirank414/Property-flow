# PropertyFlow

## Problem Statement
Managing a property portfolio often involves disconnected systems for handling tenant requests, amenity bookings, and staff task management. This fragmentation leads to delayed maintenance response times, double-booking of shared amenities, and a lack of clear operational visibility for property managers and owners. PropertyFlow solves this by centralizing all core property operations into a single, unified platform with real-time status tracking and conflict resolution.

## Features
- **Real-Time Maintenance Tracking:** Automated SLA priority categorization (Low, Medium, High, Urgent) with timeline traces.
- **Conflict-Free Amenity Bookings:** Visual timelines preventing overlapping reservations, alongside check-in/check-out capabilities.
- **Role-Based Workspaces:** Context-aware dashboards tailored specifically for Tenants, Staff, Managers, and Admins.
- **Live KPI Monitoring:** Resolution time targets, completion rates, and conflict detection summaries for Managers.
- **Full Audit Trails:** Immutable logs of system activity including ticket updates and booking status modifications.

## Technology Stack
**Frontend:**
- React 18 with TypeScript
- Vite, Tailwind CSS (Strict Dark Mode)
- React Query (TanStack Query)
- Socket.io-client for real-time updates

**Backend:**
- Node.js / Express with TypeScript
- Prisma ORM
- Supabase (PostgreSQL)
- Zod for Validation
- Helmet, CORS, Rate Limiting for Security
- Swagger / OpenAPI for Documentation

## Architecture Diagram
`mermaid
graph TD
    A[Frontend React App] -->|REST API via React Query| B[Node.js Backend]
    A -->|WebSockets| B
    B --> C[(Supabase PostgreSQL)]
    
    A --> D[Tenant Dashboard]
    A --> E[Staff Console]
    A --> F[Manager View]
    A --> G[Admin Workspace]
`

## Installation & Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (or Supabase account)

### 2. Backend Setup
1. Navigate to /backend
2. Run 
pm install
3. Copy .env.example to .env and fill in your database credentials:
   - DATABASE_URL and DIRECT_URL (from Supabase)
   - FRONTEND_URL (default: http://localhost:3000)
4. Run migrations: 
px prisma migrate dev
5. Generate Prisma Client: 
px prisma generate
6. Start development server: 
pm run dev

*(The backend will run on http://localhost:5000. API docs available at /api/v1/docs)*

### 3. Frontend Setup
1. Navigate to the root directory / (frontend)
2. Run 
pm install
3. Copy .env.example to .env and set:
   - VITE_API_URL=http://localhost:5000/api/v1
4. Start development server: 
pm run dev

*(The frontend will run on http://localhost:3000)*

## Deployment Guide

### Backend (Render / Heroku)
1. Add environment variables matching the .env file.
2. Ensure 
pm run build and 
pm start are set as build/start commands.
3. Ensure CORS (FRONTEND_URL) is explicitly set to the production frontend URL.

### Frontend (Vercel / Netlify)
1. Set the root directory if necessary.
2. Add VITE_API_URL pointing to the deployed backend.
3. Build command: 
pm run build
4. Output directory: dist

## API Documentation
Once the backend is running, the Swagger documentation is accessible at:
\http://localhost:5000/api/v1/docs\


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SIGAS Platform is an Environmental and Social Management System (Sistema de Gestão Ambiental e Social) designed for water and sanitation infrastructure projects in Mozambique. It supports multiple government institutions including AIAS, DNAAS, and FIPAG.

## Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start development server

# Build & Production
npm run build           # Build with increased memory allocation
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint (currently ignored in builds)

# Database
npx prisma generate     # Generate Prisma client (runs automatically on install)
npx prisma db push      # Push schema changes to database
npx prisma migrate dev  # Create and apply migrations
npx prisma studio       # Open Prisma Studio GUI
```

### Database Connection
- Uses PostgreSQL with Prisma ORM
- Connection string in DATABASE_URL environment variable
- Multi-tenant architecture with contextual database client

## Architecture Overview

### Multi-Tenant System
The application implements tenant-based data isolation:
- **Contextual Database Client** (`lib/db-context.ts`): Wraps Prisma client to automatically filter queries by tenantId
- **Tenant Routing**: URL-based tenant access via `/tenants/[slug]`
- **Data Isolation**: All queries automatically scoped to current tenant context

### Authentication & Authorization
- **Clerk Auth**: Handles user authentication
- **Roles**: ADMIN, MANAGER, USER (defined in Prisma schema)
- **Protected Routes**: Middleware enforces authentication except for public routes

### Form Architecture
Complex forms use a consistent pattern:
- **React Hook Form**: Form state management
- **Zod Schemas**: Validation schemas in `lib/validations/`
- **Dynamic Fields**: Support for adding/removing form sections
- **File Uploads**: Local storage or AWS S3 via upload service

### API Design
- RESTful routes under `/app/api/`
- Consistent error handling and validation
- Tenant context passed through all API calls
- File upload endpoints for documents and images

## Key Technologies

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: React 18.2 + Tailwind CSS v4
- **Database**: PostgreSQL + Prisma 6.8.2
- **State**: React Query (TanStack Query v5)
- **Forms**: React Hook Form + Zod
- **Storage**: AWS S3 (configurable)
- **Email**: Nodemailer

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_*`: Clerk authentication keys
- `AWS_*`: AWS S3 credentials (optional)
- `EMAIL_SERVER_*`: SMTP configuration

## Project Structure

- `/app`: Next.js App Router pages and API routes
- `/components`: Reusable React components
  - `/ui`: Base UI components
  - `/forms`: Complex form components for ESMS modules
- `/lib`: Core utilities and business logic
  - `/validations`: Zod schemas for form validation
  - `db-context.ts`: Multi-tenant database wrapper
- `/prisma`: Database schema with 70+ models
- `/hooks`: Custom React hooks for data fetching

## Development Guidelines

1. **Multi-tenancy**: Always use contextual database client from `db-context.ts`
2. **Form Development**: Follow existing patterns in `/components/forms/`
3. **Validation**: Create Zod schemas for all forms in `/lib/validations/`
4. **API Routes**: Include tenant context in all database queries
5. **File Uploads**: Use upload service for S3/local storage handling
6. **Internationalization**: UI primarily in Portuguese

## Testing Approach

Check for test scripts in package.json or test directories. Currently no test framework is configured.

## Common Tasks

### Adding a New Form
1. Create validation schema in `/lib/validations/`
2. Create form component in `/components/forms/`
3. Add API route in `/app/api/forms/`
4. Update contextual database client if new models added

### Adding Database Models
1. Update `/prisma/schema.prisma`
2. Add model to contextual client in `/lib/db-context.ts`
3. Run `npx prisma generate` and `npx prisma db push`

### Debugging Multi-tenant Issues
1. Check tenant context is properly passed in API routes
2. Verify contextual database client is used instead of direct `db`
3. Ensure tenant slug is correctly extracted from URL params
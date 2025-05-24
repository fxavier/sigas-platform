// app/api/users/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const tenantId = url.searchParams.get('tenantId');

    if (!tenantId) {
      return new NextResponse('Tenant ID is required', { status: 400 });
    }

    // Check if the user is authorized to access this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can list users
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const users = await db.user.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log('[USERS_POST] Starting user creation process');

    const { userId } = await auth();
    console.log('[USERS_POST] Authenticated user ID:', userId);

    if (!userId) {
      console.log('[USERS_POST] No authenticated user found');
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    console.log('[USERS_POST] Request body:', {
      ...body,
      password: '[REDACTED]',
    });

    const { email, name, password, role, tenantId, projectIds } = body;

    // Validate required fields
    if (!email || !role || !tenantId || !password) {
      console.log('[USERS_POST] Missing required fields:', {
        email: !!email,
        role: !!role,
        tenantId: !!tenantId,
        password: !!password,
      });
      return new NextResponse(
        JSON.stringify({
          error: 'Missing required fields',
          details: {
            email: !email ? 'Email is required' : null,
            role: !role ? 'Role is required' : null,
            tenantId: !tenantId ? 'Tenant ID is required' : null,
            password: !password ? 'Password is required' : null,
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid email format',
          details: 'Please provide a valid email address',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid password',
          details: 'Password must be at least 8 characters long',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Additional password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid password',
          details:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate role
    const validRoles = ['ADMIN', 'MANAGER', 'USER'];
    if (!validRoles.includes(role)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Invalid role',
          details: `Role must be one of: ${validRoles.join(', ')}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the current user is an admin
    console.log('[USERS_POST] Checking if current user is admin');
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        role: 'ADMIN',
      },
    });

    if (!currentUser) {
      console.log('[USERS_POST] Current user is not an admin');
      return new NextResponse(
        JSON.stringify({
          error: 'Only admins can create users',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if tenant exists
    console.log('[USERS_POST] Checking if tenant exists:', tenantId);
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      console.log('[USERS_POST] Tenant not found:', tenantId);
      return new NextResponse(
        JSON.stringify({
          error: 'Tenant not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    console.log('[USERS_POST] Checking if user already exists:', email);
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      console.log('[USERS_POST] User already exists:', email);
      return new NextResponse(
        JSON.stringify({
          error: 'User with this email already exists',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the user in Clerk
    console.log('[USERS_POST] Creating user in Clerk');
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        password: password,
        publicMetadata: {
          role: role,
          tenantId: tenantId,
        },
      });

      console.log('[USERS_POST] User created in Clerk:', clerkUser.id);
    } catch (error: any) {
      console.error('[USERS_POST] Clerk error:', error);
      // Extract more detailed error information
      const errorDetails = error.errors?.[0]?.message || error.message;
      return new NextResponse(
        JSON.stringify({
          error: 'Failed to create user in authentication system',
          details: errorDetails,
          code: error.status || 500,
        }),
        {
          status: error.status || 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create the user in our database
    console.log('[USERS_POST] Creating user in database');
    try {
      const user = await db.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name,
          role,
          tenantId,
          userProjects: projectIds
            ? {
                create: projectIds.map((id: string) => ({
                  projectId: id,
                })),
              }
            : undefined,
        },
        include: {
          userProjects: {
            include: {
              project: true,
            },
          },
        },
      });
      console.log('[USERS_POST] User created in database:', user.id);

      return NextResponse.json(user);
    } catch (error: any) {
      console.error('[USERS_POST] Database error:', error);
      // Attempt to delete the Clerk user if database creation fails
      try {
        console.log(
          '[USERS_POST] Attempting to delete Clerk user after database error'
        );
        await clerkClient.users.deleteUser(clerkUser.id);
        console.log('[USERS_POST] Clerk user deleted successfully');
      } catch (deleteError) {
        console.error('[USERS_POST] Failed to delete Clerk user:', deleteError);
      }
      return new NextResponse(
        JSON.stringify({
          error: 'Failed to create user in database',
          details: error.message,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('[USERS_POST] Unexpected error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

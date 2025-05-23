// app/api/documents/download/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { documentCode, documentName, tenantId, projectId } = body;

    if (!documentCode || !documentName || !tenantId || !projectId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Log the document download event
    // In a production system, you might want to store this in a downloads or activity log table
    console.log(
      `Document downloaded: ${documentCode} - ${documentName} by user ${userId} for tenant ${tenantId} and project ${projectId}`
    );

    // You could implement actual logging to the database here
    // For example, creating a download record or updating a download counter

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DOCUMENT_DOWNLOAD_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// app/api/pad/custom/[customId]/route.ts

import { NextResponse } from 'next/server';
// Use the correct path to your Prisma singleton
import { prisma } from '@/lib/prisma';

/**
 * Checks for the existence of a pad by its customId and returns
 * its main database ID if found.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ customId: string }> }
) {
  const { customId } = await params;

  if (!customId) {
    return NextResponse.json(
      { error: 'Custom ID is required' },
      { status: 400 }
    );
  }

  try {
    // Use 'prisma' as imported
    const pad = await prisma.pad.findUnique({
      where: {
        customId: customId,
      },
      select: {
        id: true, // Only select the database ID
      },
    });

    if (!pad) {
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });
    }

    // Found: return the database ID
    return NextResponse.json({ id: pad.id }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch pad by customId:', error);
    return NextResponse.json(
      { error: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

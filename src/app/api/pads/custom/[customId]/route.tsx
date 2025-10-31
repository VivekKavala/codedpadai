// app/api/pad/custom/[customId]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Utility function to normalize custom IDs to lowercase
 */
function normalizeCustomId(customId: string | null | undefined): string | null {
  if (!customId) return null;

  // Trim whitespace and convert to lowercase
  const normalized = customId.trim().toLowerCase();

  // Validate format (only lowercase letters, numbers, hyphens, underscores)
  const isValid = /^[a-z0-9-_]+$/.test(normalized);

  if (!isValid) {
    return null;
  }

  return normalized;
}

/**
 * Checks for the existence of a pad by its customId (case-insensitive)
 * and returns its main database ID if found.
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

  // Normalize the custom ID to lowercase
  const normalizedCustomId = normalizeCustomId(customId);

  if (!normalizedCustomId) {
    return NextResponse.json(
      {
        error:
          'Invalid custom ID format. Only letters, numbers, hyphens, and underscores are allowed.',
      },
      { status: 400 }
    );
  }

  try {
    // Use findFirst for case-insensitive lookup
    const pad = await prisma.pad.findUnique({
      where: {
        customId: normalizedCustomId, // Search with lowercase version
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

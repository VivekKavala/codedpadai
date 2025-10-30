// app/api/pads/check-id/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/pads/check-id?id=custom-id
 * Check if a custom pad ID is available
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customId = searchParams.get('id');

    // Validate input
    if (!customId) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    // Validate ID format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(customId)) {
      return NextResponse.json(
        {
          available: false,
          error: 'ID must contain only lowercase letters, numbers, and hyphens',
        },
        { status: 400 }
      );
    }

    // Check length constraints
    if (customId.length < 3 || customId.length > 50) {
      return NextResponse.json(
        { available: false, error: 'ID must be between 3 and 50 characters' },
        { status: 400 }
      );
    }

    // Check if ID exists in database
    const existingPad = await prisma.pad.findUnique({
      where: { customId },
      select: { id: true },
    });

    return NextResponse.json({
      available: !existingPad,
      id: customId,
    });
  } catch (error) {
    console.error('Error checking ID availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

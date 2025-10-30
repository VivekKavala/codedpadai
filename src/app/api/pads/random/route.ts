// app/api/pads/random/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Visibility } from '@/generated/prisma'; // Use your generated client enum

export async function GET(req: Request) {
  try {
    // --- UPDATED whereClause ---
    const whereClause = {
      visibility: Visibility.PUBLIC, // Must be public
      isListed: true, // AND must be listed/discoverable
      linkOnlyAccess: false, // Cannot be link-only
      customId: {
        // Must have a custom ID for discovery
        not: null,
      },
    };
    // --- End Update ---

    // Get the total count of eligible pads
    const count = await prisma.pad.count({
      where: whereClause,
    });

    if (count === 0) {
      return NextResponse.json(
        // Updated error message
        { error: 'No discoverable public pads available' },
        { status: 404 }
      );
    }

    // Generate a random number to use as an offset (skip)
    const randomSkip = Math.floor(Math.random() * count);

    // Fetch one random pad using the skip
    const randomPad = await prisma.pad.findFirst({
      where: whereClause,
      skip: randomSkip,
      select: {
        // Return customId for the input field
        customId: true,
      },
    });

    // Ensure pad and customId exist
    if (!randomPad || !randomPad.customId) {
      console.error('Failed to find a random pad despite count > 0', {
        count,
        randomSkip,
      });
      return NextResponse.json(
        { error: 'Could not find a random pad' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: randomPad }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch random pad:', error);
    return NextResponse.json(
      { error: 'An internal error occurred' },
      { status: 500 }
    );
  }
}

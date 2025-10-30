import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use your prisma singleton
import { Visibility, Prisma } from '@/generated/prisma'; // Import Enum and Prisma types
import { auth } from '@/lib/auth'; // Import your auth function
import bcrypt from 'bcryptjs';

/**
 * POST /api/pads/[id]
 * Fetches pad data securely, handling PRIVATE and PROTECTED logic,
 * and the updated linkOnlyAccess behavior.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Use Promise type
) {
  try {
    const { id } = await params; // Await params

    // Get current user session
    const session = await auth(); // Get the session object (Session | null)
    const currentUserId = session?.user?.id; // Safely access user.id

    let accessKey: string | null = null;
    let token: string | null = null;

    try {
      const body = await request.json();
      accessKey = body?.accessKey;
      token = body?.token;
    } catch (error) {
      // No body or invalid JSON body
    }

    // Find pad by its main database ID
    // --- UPDATED: Include files relation, ordered by 'order' ---
    const pad = await prisma.pad.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true }, // Select name needed for display
        },
        files: {
          orderBy: {
            order: 'asc', // Ensure files are sent in the correct order
          },
        },
      },
    });
    // --- END UPDATE ---

    if (!pad) {
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });
    }

    // Check expiry
    if (pad.expiresAt && new Date() > new Date(pad.expiresAt)) {
      return NextResponse.json(
        { error: 'This pad has expired' },
        { status: 410 }
      );
    }

    // --- Authentication/Authorization Logic ---
    let authorized = false;
    let authCheckReason: 'PRIVATE' | 'PROTECTED' | null = null;

    // 1. Check PRIVATE Access (Highest Priority)
    if (pad.visibility === Visibility.PRIVATE) {
      authCheckReason = 'PRIVATE';
      if (currentUserId && pad.userId === currentUserId) {
        authorized = true; // Owner has access
      }
    }
    // 2. Check PROTECTED Access (If not already authorized)
    else if (pad.visibility === Visibility.PROTECTED) {
      authCheckReason = 'PROTECTED';
      if (
        accessKey &&
        pad.passphrase &&
        (await bcrypt.compare(accessKey, pad.passphrase))
      ) {
        authorized = true; // Valid key grants access
      }
    }
    // 3. PUBLIC pads are initially considered accessible
    else if (pad.visibility === Visibility.PUBLIC) {
      authorized = true; // Public pads are accessible by default, but token check might apply
    }

    // 4. Token Check (if linkOnlyAccess is true AND user wasn't authorized by other means)
    if (pad.linkOnlyAccess && !authorized) {
      // If link only is required and user didn't pass owner/key check, token is mandatory
      if (!token || token !== pad.shareToken) {
        // If token is invalid/missing, access is denied.
        // Determine the correct error message based on original visibility.
        if (authCheckReason === 'PRIVATE') {
          return NextResponse.json(
            {
              error:
                'Invalid token. Private pad requires owner login or valid token link.',
              requiresAuth: true,
              reason: 'PRIVATE',
            },
            { status: 401 }
          );
        } else if (authCheckReason === 'PROTECTED') {
          return NextResponse.json(
            {
              error:
                'Invalid token. Protected pad requires access key or valid token link.',
              requiresAuth: true,
              reason: 'PROTECTED',
            },
            { status: 401 }
          );
        } else {
          // Must be PUBLIC or somehow unauthorized otherwise
          return NextResponse.json(
            { error: 'Invalid or missing access token for this link.' },
            { status: 403 }
          ); // Use 403 Forbidden
        }
      }
      // If token IS valid, grant authorization
      authorized = true;
    }

    // 5. Final Access Denied Check
    if (!authorized) {
      // If we reach here and still not authorized, deny access based on the initial reason
      if (authCheckReason === 'PRIVATE') {
        return NextResponse.json(
          {
            error: 'This is a private pad. Access denied.',
            requiresAuth: true,
            reason: 'PRIVATE',
          },
          { status: 401 }
        );
      } else if (authCheckReason === 'PROTECTED') {
        return NextResponse.json(
          {
            error: 'Access key required.',
            requiresAuth: true,
            reason: 'PROTECTED',
          },
          { status: 401 }
        );
      } else {
        // Should not happen for PUBLIC unless linkOnlyAccess was true and token failed (handled above)
        return NextResponse.json({ error: 'Access Denied.' }, { status: 403 }); // Generic Forbidden
      }
    }
    // --- End Auth Logic ---

    // If authorized, return pad data
    const { passphrase, editAccessKey, shareToken, user, ...restOfPad } = pad;
    // restOfPad now contains the 'files' array from the include
    const safePadData = {
      ...restOfPad,
      user: pad.hideCreator ? null : user,
      hasPassphrase: !!pad.passphrase,
      hasEditKey: !!pad.editAccessKey,
      hideCreator: pad.hideCreator,
    };

    return NextResponse.json(safePadData);
  } catch (error) {
    console.error('Error retrieving pad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// --- DELETE Route (No changes needed, 'onDelete: Cascade' in schema handles PadFile deletion) ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    const currentUserId = session?.user?.id;

    let accessKey: string | null = null;
    try {
      const body = await request.json();
      accessKey = body?.accessKey;
    } catch (error) {
      /* No body */
    }

    const pad = await prisma.pad.findUnique({ where: { id } });

    if (!pad)
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });

    // Delete Authorization Checks
    if (pad.visibility === Visibility.PRIVATE) {
      if (!currentUserId || pad.userId !== currentUserId) {
        return NextResponse.json(
          { error: 'Forbidden: You do not own this private pad.' },
          { status: 403 }
        );
      }
    } else if (pad.visibility === Visibility.PROTECTED) {
      if (
        !accessKey ||
        !pad.passphrase ||
        !(await bcrypt.compare(accessKey, pad.passphrase))
      ) {
        return NextResponse.json(
          { error: 'Invalid or missing access key for protected pad.' },
          { status: 401 }
        );
      }
      // Optional owner check could still be added here
    }
    // Optional owner check for PUBLIC/UNLISTED could be added here

    // Deleting the pad will cascade and delete all related PadFile records
    await prisma.pad.delete({ where: { id: pad.id } });

    return NextResponse.json({ success: true, message: 'Pad deleted' });
  } catch (error) {
    console.error('Error deleting pad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// --- GET Route (Remains Disabled) ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST.' },
    { status: 405 }
  );
}

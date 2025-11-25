import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/pads/[id]/viewed
 *
 * This new endpoint is called by the client *only* when a pad is
 * successfully decrypted and displayed, or when a non-encrypted pad
 * is loaded. This is responsible for incrementing views, checking
 * max views, handling burn-after-reading, and logging audits.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // --- FIX: Await the params promise ---
    const { id } = await params;
    // --- End Fix ---

    const body = await request.json();
    const token = body?.token;

    // Get client info for audit logging
    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Find the pad first to check its rules
    const pad = await prisma.pad.findUnique({
      where: { id },
    });

    if (!pad) {
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });
    }

    // Use type assertion for custom schema fields
    const padData = pad as any;

    // Check link-only access before logging view
    if (padData.linkOnlyAccess || padData.viewOnlyViaLink) {
      if (!token || token !== padData.shareToken) {
        return NextResponse.json(
          { error: 'Invalid token for logging view' },
          { status: 403 }
        );
      }
    }

    // --- All view-related logic is now here ---

    // 1. Check if pad has expired (view-based)
    if (padData.maxViews && pad.views >= padData.maxViews) {
      await prisma.pad.delete({ where: { id: pad.id } });
      return NextResponse.json(
        {
          error: 'This pad has reached its maximum view count and been deleted',
          burned: true,
        },
        { status: 410 }
      );
    }

    // 2. Handle burn after reading
    if (padData.burnAfterReading) {
      // Delete the pad immediately
      await prisma.pad.delete({ where: { id: pad.id } });

      // Create audit log for the "burn" view
      if (padData.enableAuditLogs) {
        await prisma.auditLog.create({
          data: {
            padId: pad.id,
            action: 'VIEW_AND_BURN',
            ipAddress: clientIp,
            userAgent: userAgent,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'This pad was viewed and has been deleted.',
        burned: true,
      });
    }

    // 3. Increment view count and update last viewed
    await prisma.pad.update({
      where: { id: pad.id },
      data: {
        views: { increment: 1 },
        // lastViewedAt: new Date(), // Uncomment when field is available
      },
    });

    // 4. Create audit log if enabled
    if (padData.enableAuditLogs) {
      await prisma.auditLog.create({
        data: {
          padId: pad.id,
          action: 'VIEW',
          ipAddress: clientIp,
          userAgent: userAgent,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'View logged' });
  } catch (error) {
    console.error('Error in view logging:', error instanceof Error ? error.message : 'Unknown error');
  }
}

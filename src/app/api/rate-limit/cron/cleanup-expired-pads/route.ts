// app/api/cron/cleanup-expired-pads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/cron/cleanup-expired-pads
 *
 * Cron job to delete expired pads
 * Should be called periodically (e.g., every hour) via a service like Vercel Cron
 *
 * In vercel.json, add:
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup-expired-pads",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find expired pads (time-based)
    const expiredPads = await prisma.pad.findMany({
      where: {
        expiresAt: {
          lte: now,
        },
      },
      select: {
        id: true,
        customId: true,
        expiresAt: true,
      },
    });

    // Find pads that exceeded max views
    // Find pads that exceeded max views
    const padsWithMaxViews = await prisma.pad.findMany({
      where: {
        maxViews: { not: null },
      },
      select: {
        id: true,
        customId: true,
        views: true,
        maxViews: true,
      },
    });

    const viewExpiredPads = padsWithMaxViews.filter(
      (p) => p.views >= (p.maxViews ?? Infinity)
    );

    // Combine all expired pad IDs
    const allExpiredIds = [
      ...expiredPads.map((p) => p.id),
      ...viewExpiredPads.map((p) => p.id),
    ];

    // Delete expired pads (audit logs will cascade delete)
    let deletedCount = 0;
    if (allExpiredIds.length > 0) {
      const result = await prisma.pad.deleteMany({
        where: {
          id: { in: allExpiredIds },
        },
      });
      deletedCount = result.count;
    }

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed',
      timeExpired: expiredPads.length,
      viewExpired: viewExpiredPads.length,
      totalDeleted: deletedCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * For local development/testing
 * POST /api/cron/cleanup-expired-pads
 */
export async function POST(request: NextRequest) {
  return GET(request);
}

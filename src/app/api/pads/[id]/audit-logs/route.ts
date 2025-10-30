// app/api/pads/[id]/audit-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * GET /api/pads/[id]/audit-logs?accessKey=xxx&limit=50
 * Retrieve audit logs for a pad (requires access verification)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const accessKey = searchParams.get('accessKey');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Find pad
    const pad = await prisma.pad.findUnique({
      where: { customId: id },
    });

    if (!pad) {
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });
    }

    // Check if audit logs are enabled
    if (!pad.enableAuditLogs) {
      return NextResponse.json(
        { error: 'Audit logs are not enabled for this pad' },
        { status: 403 }
      );
    }

    // Verify access key for protected/private pads
    if (
      (pad.visibility === 'PROTECTED' || pad.visibility === 'PRIVATE') &&
      pad.passphrase
    ) {
      if (!accessKey) {
        return NextResponse.json(
          { error: 'Access key required' },
          { status: 401 }
        );
      }

      const isValidKey = await bcrypt.compare(accessKey, pad.passphrase);
      if (!isValidKey) {
        return NextResponse.json(
          { error: 'Invalid access key' },
          { status: 403 }
        );
      }
    }

    // Retrieve audit logs
    const logs = await prisma.auditLog.findMany({
      where: { padId: pad.id },
      orderBy: { timestamp: 'desc' },
      take: Math.min(limit, 100), // Max 100 logs per request
    });

    return NextResponse.json({
      success: true,
      logs: logs.map((log) => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        // Partially mask IP for privacy
        ipAddress: log.ipAddress
          ? log.ipAddress.split('.').slice(0, 2).join('.') + '.xxx.xxx'
          : 'unknown',
        userAgent: log.userAgent,
      })),
      total: logs.length,
    });
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

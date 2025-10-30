import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use your prisma singleton
import { EditPermission, Prisma, Visibility } from '@/generated/prisma'; // Import types
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth'; // Import your auth function

/**
 * PUT /api/pads/[id]/update
 * Update pad content, title, and files with edit permission validation.
 * Handles creating, updating, and deleting files in a transaction.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const currentUserId = session?.user?.id;

    const body = await request.json();
    const {
      title,
      files, // Array of files { id?, title, content, order }
      editAccessKey,
    } = body;

    // --- Validation ---
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'Files must be a non-empty array' },
        { status: 400 }
      );
    }
    if (files.some((f: any) => !f.title || f.content === undefined)) {
      return NextResponse.json(
        { error: 'All files must have a title and content' },
        { status: 400 }
      );
    }
    if (files.some((f: any) => !f.title.trim() || !f.content.trim())) {
      // You might want to allow empty content, but for now we check
      return NextResponse.json(
        { error: 'File title and content cannot be empty' },
        { status: 400 }
      );
    }

    // --- Get Original Pad for Auth & File Diff ---
    const pad = await prisma.pad.findUnique({
      where: { id },
      include: {
        files: {
          select: { id: true }, // Get existing file IDs
        },
      },
    });

    if (!pad) {
      return NextResponse.json({ error: 'Pad not found' }, { status: 404 });
    }

    if (pad.expiresAt && new Date() > new Date(pad.expiresAt)) {
      return NextResponse.json(
        { error: 'This pad has expired and cannot be edited' },
        { status: 410 }
      );
    }

    // --- Authorization Check ---
    let authorized = false;

    // 1. Check for private pad owner
    if (pad.visibility === Visibility.PRIVATE) {
      if (currentUserId && pad.userId === currentUserId) {
        authorized = true;
      }
    }
    // 2. Check for edit access key (for non-private pads)
    else if (pad.editPermission === EditPermission.ACCESS_KEY) {
      if (
        editAccessKey &&
        pad.editAccessKey &&
        (await bcrypt.compare(editAccessKey, pad.editAccessKey))
      ) {
        authorized = true;
      } else {
        return NextResponse.json(
          { error: 'Invalid Edit Access Key', requiresEditKey: true },
          { status: 401 }
        );
      }
    }
    // 3. Check for "ANYONE" permission (for non-private pads)
    else if (pad.editPermission === EditPermission.ANYONE) {
      authorized = true;
    }

    if (!authorized) {
      return NextResponse.json(
        { error: 'You are not authorized to edit this pad.' },
        { status: 403 }
      );
    }

    // --- Transactional Update Logic ---
    const existingFileIds = pad.files.map((f) => f.id);

    // Get IDs from incoming files (ignore new client-side IDs)
    const incomingFileIds = files
      .map((f: any) => f.id)
      .filter((fileId: any) => fileId && !fileId.startsWith('new_'));

    // 1. Files to delete: exist in DB but not in incoming list
    const filesToDelete = existingFileIds.filter(
      (fileId) => !incomingFileIds.includes(fileId)
    );

    // 2. Files to create: have a client-side ID (e.g., "new_...")
    const filesToCreate = files
      .filter((f: any) => f.id && f.id.startsWith('new_'))
      .map((file: any) => ({
        title: file.title,
        content: file.content,
        order: file.order,
        padId: id, // Link to this pad
      }));

    // 3. Files to update: exist in DB and in incoming list
    const filesToUpdate = files
      .filter((f: any) => f.id && !f.id.startsWith('new_'))
      .map((file: any) => ({
        where: { id: file.id },
        data: {
          title: file.title,
          content: file.content,
          order: file.order,
        },
      }));

    // Get client info for audit logging
    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Run in a transaction
    const updatedPad = await prisma.$transaction(async (tx) => {
      // 1. Delete removed files
      if (filesToDelete.length > 0) {
        await tx.padFile.deleteMany({
          where: {
            id: {
              in: filesToDelete,
            },
            padId: id, // Ensure we only delete from this pad
          },
        });
      }

      // 2. Create new files
      if (filesToCreate.length > 0) {
        await tx.padFile.createMany({
          data: filesToCreate,
        });
      }

      // 3. Update existing files (loop required for individual updates)
      for (const updateOp of filesToUpdate) {
        await tx.padFile.update(updateOp);
      }

      // 4. Update the main pad title and updatedAt
      const padUpdate = await tx.pad.update({
        where: { id },
        data: {
          title: title || 'Untitled Pad',
          updatedAt: new Date(), // Force update timestamp
        },
        select: {
          updatedAt: true,
        },
      });

      // 5. Create audit log if enabled
      if (pad.enableAuditLogs) {
        await tx.auditLog.create({
          data: {
            padId: pad.id,
            action: 'EDIT',
            ipAddress: clientIp,
            userAgent: userAgent,
          },
        });
      }

      return padUpdate;
    });

    return NextResponse.json(
      { success: true, pad: { updatedAt: updatedPad.updatedAt } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating pad:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database error.', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

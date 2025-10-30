import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Visibility, EditPermission, Prisma } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Generate a unique share token
 */
function generateShareToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a random, unique custom ID
 */
async function generateUniqueRandomId(attempts = 10): Promise<string | null> {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < attempts; i++) {
    let id = '';
    for (let j = 0; j < 8; j++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const exists = await prisma.pad.findUnique({ where: { customId: id } });
    if (!exists) {
      return id;
    }
  }
  return null; // Failed to generate after attempts
}

// --- UPDATED: Define file type for validation ---
interface FileInput {
  title: string;
  content: string;
  order: number;
}
const MAX_FILE_CONTENT_LENGTH = 500000; // Match client-side
// --- END OF UPDATE ---

/**
 * POST /api/pads/create
 * Create a new secure pad
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract fields with defaults
    const {
      title,
      // content, // --- REMOVED ---
      files, // --- ADDED ---
      customId,
      visibility = Visibility.PUBLIC,
      isListed = true, // Default based on schema
      accessKey,
      editPermission = EditPermission.ANYONE,
      editAccessKey,
      encrypted = false,
      linkOnlyAccess = false, // Use this single flag now
      expiresAt,
      maxViews,
      burnAfterReading = false,
      disableCopy = false,
      // viewOnlyViaLink removed
      enableAuditLogs = false,
      notifyOnView = false, // Kept but likely always false from UI
      hideCreator = false, // Based on schema
      userId, // Sent by client form
    } = body;

    // --- UPDATED: Validation for 'files' array ---
    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file (tab) is required' },
        { status: 400 }
      );
    }
    if (
      files.every((f: FileInput) => !f.content || f.content.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: 'Content is required in at least one file' },
        { status: 400 }
      );
    }
    if (files.some((f: FileInput) => !f.title || f.title.trim().length === 0)) {
      return NextResponse.json(
        { error: 'All tabs must have a title' },
        { status: 400 }
      );
    }
    if (
      files.some((f: FileInput) => f.content.length > MAX_FILE_CONTENT_LENGTH)
    ) {
      return NextResponse.json(
        {
          error: `Content in one or more files exceeds the ${MAX_FILE_CONTENT_LENGTH} character limit`,
        },
        { status: 400 }
      );
    }
    // --- END OF UPDATE ---

    if (visibility === Visibility.PROTECTED && !accessKey) {
      return NextResponse.json(
        { error: 'Access key is required for protected pads' },
        { status: 400 }
      );
    }
    if (visibility === Visibility.PRIVATE && !userId) {
      return NextResponse.json(
        { error: 'User must be logged in to create a private pad' },
        { status: 401 }
      );
    }
    if (
      visibility !== Visibility.PRIVATE &&
      editPermission === EditPermission.ACCESS_KEY &&
      !editAccessKey
    ) {
      return NextResponse.json(
        {
          error:
            'Edit access key is required when edit permission is set to ACCESS_KEY',
        },
        { status: 400 }
      );
    }

    // Validate and check/generate custom ID
    let finalCustomId = customId?.trim() || null;
    if (finalCustomId) {
      if (!/^[a-z0-9-]+$/.test(finalCustomId)) {
        return NextResponse.json(
          {
            error:
              'Custom ID must contain only lowercase letters, numbers, and hyphens',
          },
          { status: 400 }
        );
      }
      if (finalCustomId.length < 3 || finalCustomId.length > 50) {
        return NextResponse.json(
          { error: 'Custom ID must be between 3 and 50 characters' },
          { status: 400 }
        );
      }
      const existingPad = await prisma.pad.findUnique({
        where: { customId: finalCustomId },
      });
      if (existingPad) {
        return NextResponse.json(
          { error: 'This custom ID is already taken' },
          { status: 409 }
        );
      }
    } else {
      finalCustomId = await generateUniqueRandomId();
      if (!finalCustomId) {
        return NextResponse.json(
          { error: 'Failed to generate unique ID' },
          { status: 500 }
        );
      }
    }

    // Hash passwords/keys
    let hashedPassphrase = null;
    if (visibility === Visibility.PROTECTED && accessKey) {
      hashedPassphrase = await bcrypt.hash(accessKey, 10);
    }
    let hashedEditKey = null;
    if (
      visibility !== Visibility.PRIVATE &&
      editPermission === EditPermission.ACCESS_KEY &&
      editAccessKey
    ) {
      hashedEditKey = await bcrypt.hash(editAccessKey, 10);
    }

    // Generate share token only if linkOnlyAccess is true
    let shareToken = linkOnlyAccess ? generateShareToken() : null;

    // Parse expiry date
    let parsedExpiresAt: Date | null = null;
    if (expiresAt) {
      parsedExpiresAt = new Date(expiresAt);
      if (isNaN(parsedExpiresAt.getTime())) {
        return NextResponse.json(
          { error: 'Invalid expiry date format' },
          { status: 400 }
        );
      }
    }

    // Validate maxViews
    let parsedMaxViews: number | null = null;
    if (maxViews != null) {
      parsedMaxViews = parseInt(maxViews as string); // Ensure it's parsed correctly
      if (isNaN(parsedMaxViews) || parsedMaxViews <= 0) {
        return NextResponse.json(
          { error: 'Invalid max views value' },
          { status: 400 }
        );
      }
    }

    // Get client info
    const clientIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Build data object using Prisma types
    const padData: Prisma.PadCreateInput = {
      title: title?.trim() || 'Untitled Pad',
      // content, // --- REMOVED ---
      // --- ADDED: Nested create for files ---
      files: {
        create: files.map((file: FileInput) => ({
          title: file.title,
          content: file.content, // This is the content (already encrypted by client if applicable)
          order: file.order,
        })),
      },
      // --- END OF UPDATE ---
      customId: finalCustomId,
      visibility,
      isListed: visibility === Visibility.PUBLIC ? isListed : false, // Only relevant if public
      encrypted,
      passphrase: hashedPassphrase,
      hideCreator,
      editPermission:
        visibility === Visibility.PRIVATE
          ? EditPermission.ANYONE
          : editPermission, // Default for private
      editAccessKey: hashedEditKey,
      linkOnlyAccess, // Save the single flag
      // viewOnlyViaLink: undefined, // Removed
      shareToken,
      expiresAt: parsedExpiresAt,
      maxViews: parsedMaxViews,
      burnAfterReading,
      disableCopy,
      enableAuditLogs: userId ? enableAuditLogs : false, // Only allow if user is linked
      notifyOnView: false, // Force false
      user: userId ? { connect: { id: userId } } : undefined,
    };

    // Create pad and its files in a transaction
    const pad = await prisma.pad.create({
      data: padData,
      select: {
        // Select only needed fields for response
        id: true,
        customId: true,
        visibility: true,
        isListed: true,
        editPermission: true,
        encrypted: true,
        expiresAt: true,
        maxViews: true,
        burnAfterReading: true,
        linkOnlyAccess: true, // Return status of flags
        hideCreator: true,
        userId: true, // To determine anonymity status in success view
      },
    });

    // Create audit log
    if (padData.enableAuditLogs && pad.id) {
      // Check pad.id just in case
      try {
        await prisma.auditLog.create({
          data: {
            padId: pad.id,
            action: 'CREATE',
            ipAddress: clientIp,
            userAgent: userAgent,
          },
        });
      } catch (auditError) {
        console.warn('Could not create audit log:', auditError);
      }
    }

    // Build response URL (use main ID)
    let padUrl = `/pad/${pad.id}`;
    if (shareToken) {
      padUrl += `?token=${shareToken}`;
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        id: pad.id,
        customId: pad.customId,
        url: padUrl, // URL to access the pad
        shareToken: shareToken, // Explicitly return token if generated
        message: 'Pad created successfully',
        // Return the created pad data (selected fields) for the success view
        pad: pad,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating pad:', error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = (error.meta?.target as string[])?.join(', ');
      return NextResponse.json(
        { error: `The value provided for ${target} is already taken.` },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

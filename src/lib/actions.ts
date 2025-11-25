'use server';

import { prisma } from '@/lib/prisma';
import { hashPassphrase } from '@/lib/encryption';
import { ApiResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// --- Utility function for normalizing custom IDs ---
function normalizeCustomId(customId: string | null | undefined): string | null {
  if (!customId) return null;

  // Trim whitespace and convert to lowercase
  const normalized = customId.trim().toLowerCase();

  // Validate format (only lowercase letters, numbers, hyphens, underscores)
  const isValid = /^[a-z0-9-_]+$/.test(normalized);

  if (!isValid) {
    throw new Error(
      'Custom ID can only contain lowercase letters, numbers, hyphens, and underscores'
    );
  }

  return normalized;
}

// --- Manual type definitions ---
interface PadFile {
  id: string;
  title: string;
  content: string;
  order: number;
  padId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Pad {
  id: string;
  customId: string | null;
  title: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
  isListed: boolean;
  encrypted: boolean;
  passphrase: string | null;
  hideCreator: boolean;
  editPermission: 'ANYONE' | 'ACCESS_KEY';
  editAccessKey: string | null;
  linkOnlyAccess: boolean;
  shareToken: string | null;
  expiresAt: Date | null;
  maxViews: number | null;
  burnAfterReading: boolean;
  disableCopy: boolean;
  views: number;
  uniqueViews: number;
  lastViewedAt: Date | null;
  enableAuditLogs: boolean;
  notifyOnView: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export type PadWithFiles = Pad & {
  files: PadFile[];
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

interface PadCreateInput {
  title: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
  passphrase?: string;
  isListed: boolean;
  encrypted: boolean;
  userId?: string;
  hideCreator: boolean;
  expiresAt?: string | null;
  maxViews?: number;
  burnAfterReading?: boolean;
  disableCopy?: boolean;
  enableAuditLogs?: boolean;
  linkOnlyAccess?: boolean;
  shareToken?: string;
  editPermission?: 'ANYONE' | 'ACCESS_KEY';
  editAccessKey?: string;
  files: {
    title: string;
    content: string;
    order: number;
  }[];
}

export async function createPad(
  data: PadCreateInput,
  customId?: string
): Promise<ApiResponse<Pad>> {
  try {
    const session = await auth();

    // Validate passphrase if provided
    if (data.visibility === 'PROTECTED' && !data.passphrase?.trim()) {
      return {
        success: false,
        error: 'Passphrase is required for protected pads',
      };
    }

    // --- NORMALIZE CUSTOM ID TO LOWERCASE ---
    let normalizedCustomId: string | null = null;
    try {
      normalizedCustomId = normalizeCustomId(customId);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Invalid custom ID format',
      };
    }

    // Hash passphrase if provided
    let hashedPassphrase: string | undefined;
    if (data.passphrase) {
      hashedPassphrase = await hashPassphrase(data.passphrase);
    }

    // Hash edit access key if provided
    let hashedEditAccessKey: string | undefined;
    if (data.editAccessKey) {
      hashedEditAccessKey = await hashPassphrase(data.editAccessKey);
    }

    // Check if pad with custom ID already exists (case-insensitive check)
    if (normalizedCustomId) {
      const existingPad = await prisma.pad.findFirst({
        where: {
          customId: normalizedCustomId, // Already lowercase
        },
      });

      if (existingPad) {
        return {
          success: false,
          error: 'A pad with this custom ID already exists',
        };
      }
    }

    // Create pad in database
    const pad = await prisma.pad.create({
      data: {
        customId: normalizedCustomId || undefined, // Store lowercase version
        title: data.title.trim() || 'Untitled Pad',
        visibility: data.visibility,
        isListed: data.isListed,
        encrypted: data.encrypted,
        passphrase: hashedPassphrase,
        userId: session?.user?.id || undefined,
        hideCreator: data.hideCreator,
        expiresAt: data.expiresAt || undefined,
        maxViews: data.maxViews || undefined,
        burnAfterReading: data.burnAfterReading,
        disableCopy: data.disableCopy,
        enableAuditLogs: data.enableAuditLogs,
        linkOnlyAccess: data.linkOnlyAccess,
        shareToken: data.shareToken || undefined,
        editPermission: data.editPermission,
        editAccessKey: hashedEditAccessKey,

        files: {
          create: data.files.map((file) => ({
            title: file.title,
            content: file.content,
            order: file.order,
          })),
        },
      },
    });

    revalidatePath('/explore');
    revalidatePath(`/pad/${pad.id}`);
    if (normalizedCustomId) {
      revalidatePath(`/${normalizedCustomId}`);
    }

    return {
      success: true,
      data: pad as Pad,
    };
  } catch (error) {
    console.error('Error creating pad:', error);
    return {
      success: false,
      error: 'Failed to create pad. Please try again.',
    };
  }
}

// --- GET PAD BY CUSTOM ID (with lowercase normalization) ---
export async function getPadByCustomId(
  customId: string
): Promise<ApiResponse<PadWithFiles>> {
  try {
    // Normalize the input customId to lowercase for lookup
    const normalizedCustomId = normalizeCustomId(customId);

    if (!normalizedCustomId) {
      return {
        success: false,
        error: 'Invalid custom ID',
      };
    }

    const pad = await prisma.pad.findFirst({
      where: {
        customId: normalizedCustomId, // Case-insensitive lookup
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        files: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!pad) {
      return {
        success: false,
        error: 'Pad not found',
      };
    }

    // Increment view count
    await prisma.pad.update({
      where: { id: pad.id },
      data: {
        views: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });

    return {
      success: true,
      data: pad as PadWithFiles,
    };
  } catch (error) {
    console.error('Error fetching pad by custom ID:', error);
    return {
      success: false,
      error: 'Failed to fetch pad',
    };
  }
}

// --- GET PAD BY ID (unchanged, but keeping for completeness) ---
export async function getPad(id: string): Promise<ApiResponse<PadWithFiles>> {
  try {
    const pad = await prisma.pad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        files: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!pad) {
      return {
        success: false,
        error: 'Pad not found',
      };
    }

    // Increment view count
    await prisma.pad.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });

    return {
      success: true,
      data: pad as PadWithFiles,
    };
  } catch (error) {
    console.error('Error fetching pad:', error);
    return {
      success: false,
      error: 'Failed to fetch pad',
    };
  }
}

// --- GET PUBLIC PADS (unchanged) ---
export type PadWithFirstFile = Pad & {
  files: PadFile[];
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export async function getPublicPads(
  limit: number = 20
): Promise<ApiResponse<PadWithFirstFile[]>> {
  try {
    const pads = await prisma.pad.findMany({
      where: {
        visibility: 'PUBLIC',
        isListed: true,
        expiresAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        files: {
          take: 1,
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return {
      success: true,
      data: pads as PadWithFirstFile[],
    };
  } catch (error) {
    console.error('Error fetching public pads:', error);
    return {
      success: false,
      error: 'Failed to fetch pads',
    };
  }
}

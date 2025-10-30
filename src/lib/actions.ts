'use server';

import { prisma } from '@/lib/prisma';
import { hashPassphrase } from '@/lib/encryption'; // Assuming this import
import { ApiResponse } from '@/lib/types'; // <-- FIX: Removed 'Pad' from import
import { revalidatePath } from 'next/cache';

// --- FIX: Manually define PadFile type to avoid import error ---
interface PadFile {
  id: string;
  title: string;
  content: string;
  order: number;
  padId: string;
  createdAt: Date;
  updatedAt: Date;
}
// --- END FIX ---

// --- FIX: Manually define Pad type based on NEW schema ---
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
// --- END FIX ---

// Define a more complete Pad type that includes the files
export type PadWithFiles = Pad & {
  files: PadFile[];
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

// Define the input for the createPad function, matching the new schema
// This should mirror the fields from your CreatePadForm
interface PadCreateInput {
  title: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
  passphrase?: string;
  isListed: boolean;
  encrypted: boolean;
  userId?: string;
  hideCreator: boolean;
  // Add other fields from your schema that you collect in the form
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
    // ---
    // You would add all your advanced validation here (title, files, etc.)
    // ---

    // Validate passphrase if provided
    if (data.visibility === 'PROTECTED' && !data.passphrase?.trim()) {
      return {
        success: false,
        error: 'Passphrase is required for protected pads',
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

    // Check if pad with custom ID already exists
    if (customId) {
      const existingPad = await prisma.pad.findUnique({
        where: { customId: customId }, // <-- FIX: Check 'customId' field
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
        customId: customId || undefined, // <-- FIX: Set 'customId' field
        title: data.title.trim() || 'Untitled Pad',
        visibility: data.visibility,
        isListed: data.isListed,
        encrypted: data.encrypted,
        passphrase: hashedPassphrase,
        userId: data.userId || undefined,
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

        // --- FIX: Create files in a nested transaction ---
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
    if (customId) {
      revalidatePath(`/custom/${customId}`);
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

// --- NEW FUNCTION ---
// Needed for your [customId]/page.tsx resolver
export async function getPadByCustomId(
  customId: string
): Promise<ApiResponse<PadWithFiles>> {
  try {
    const pad = await prisma.pad.findUnique({
      where: { customId },
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
            order: 'asc', // Get files in the correct tab order
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
      where: { id: pad.id }, // Update by the *primary key*
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

// --- UPDATED FUNCTION ---
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
            order: 'asc', // Get files in the correct tab order
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

// --- UPDATED FUNCTION ---
// This type is for the explore page, showing just one file
export type PadWithFirstFile = Pad & {
  files: PadFile[]; // Will only contain one file
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
        isListed: true, // Only show pads meant for the explore page
        expiresAt: null, // Don't show expired pads
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
          // Optimization: Only take the first file for the preview
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

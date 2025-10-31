// app/custom/[customId]/page.tsx
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * Utility function to normalize custom IDs to lowercase
 */
function normalizeCustomId(customId: string | null | undefined): string | null {
  if (!customId) return null;

  // Trim whitespace and convert to lowercase
  const normalized = customId.trim().toLowerCase();

  // Validate format (only lowercase letters, numbers, hyphens, underscores)
  const isValid = /^[a-z0-9-_]+$/.test(normalized);

  if (!isValid) {
    return null;
  }

  return normalized;
}

/**
 * Attempts to find a public or protected pad by its custom ID (case-insensitive).
 */
async function getPadByCustomId(customId: string) {
  try {
    // Normalize the custom ID to lowercase
    const normalizedCustomId = normalizeCustomId(customId);

    if (!normalizedCustomId) {
      return null; // Invalid format
    }

    // Find the pad using the normalized custom ID.
    // We explicitly EXCLUDE 'PRIVATE' pads from this lookup.
    // Custom IDs should only resolve for 'PUBLIC' or 'PROTECTED' pads.
    const pad = await prisma.pad.findUnique({
      where: {
        customId: normalizedCustomId, // Search with lowercase version
      },
      select: {
        id: true, // We only need the real ID to redirect
        customId: true, // Get the actual stored customId
      },
    });
    return pad;
  } catch (error) {
    console.error('Failed to fetch pad by custom ID:', error);
    return null;
  }
}

/**
 * This is a Server Component page that acts as a redirector.
 * It finds a pad by its `customId` (case-insensitive) and redirects to the
 * actual `pad/[id]` route.
 */
export default async function CustomIdRedirectPage({
  params,
}: {
  params: Promise<{ customId: string }>;
}) {
  const { customId } = await params;

  if (!customId) {
    return <NotFoundMessage message="No custom ID provided." />;
  }

  // Validate the custom ID format
  const normalizedCustomId = normalizeCustomId(customId);

  if (!normalizedCustomId) {
    return (
      <NotFoundMessage>
        <p className="text-gray-600 mb-6">
          The custom link "<strong>{customId}</strong>" contains invalid
          characters. Custom IDs can only contain letters, numbers, hyphens, and
          underscores.
        </p>
      </NotFoundMessage>
    );
  }

  const pad = await getPadByCustomId(customId);

  // If the pad exists, redirect to its canonical UUID-based URL
  if (pad) {
    redirect(`/pad/${pad.id}`);
  }

  // If the pad does not exist (or is private), show a "not found" page
  return (
    <NotFoundMessage>
      <p className="text-gray-600 mb-6">
        The custom link "<strong>{normalizedCustomId}</strong>" does not exist
        or has expired.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Note: Custom links are case-insensitive. We searched for "
        {normalizedCustomId}".
      </p>
    </NotFoundMessage>
  );
}

// A simple component to show a standardized "Not Found" message
function NotFoundMessage({
  message,
  children,
}: {
  message?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pad Not Found</h2>
        {message && <p className="text-gray-600 mb-6">{message}</p>}
        {children}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

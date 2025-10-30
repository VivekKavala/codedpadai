import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * Attempts to find a public or protected pad by its custom ID.
 */
async function getPadByCustomId(customId: string) {
  try {
    // Find the pad using the custom ID.
    // We explicitly EXCLUDE 'PRIVATE' pads from this lookup.
    // Custom IDs should only resolve for 'PUBLIC' or 'PROTECTED' pads.
    const pad = await prisma.pad.findFirst({
      where: {
        customId: customId,
        NOT: {
          visibility: 'PRIVATE',
        },
      },
      select: {
        id: true, // We only need the real ID to redirect
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
 * It finds a pad by its `customId` and redirects to the
 * actual `pad/[id]` route.
 */
export default async function CustomIdRedirectPage({
  params,
}: {
  params: Promise<{ customId: string }>;
}) {
  const { customId } = await params;

  if (!customId) {
    // This case is unlikely due to Next.js routing, but good to have
    return <NotFoundMessage message="No custom ID provided." />;
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
        The custom link "<strong>{customId}</strong>" does not exist or has
        expired.
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pad Not Found</h2>
        {message && <p className="text-gray-600 mb-6">{message}</p>}
        {children}
        <Link
          href="/dashboard"
          className="inline-flex items-center !p-0 !bg-transparent hover:!bg-transparent text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

import { prisma } from '../../lib/prisma';
import { Visibility } from '../../generated/prisma';
import ExplorePads from '../../components/ExplorePads'; // Client component for UI
// Removed Button import as it's not used here

// Revalidate the page periodically (e.g., every 5 minutes)
export const revalidate = 300;

const PAGE_SIZE = 12; // Number of pads per page

// Updated Type Definition to include hideCreator
export type ExplorePadData = {
  id: string;
  customId: string | null;
  title: string;
  createdAt: Date;
  hideCreator: boolean; // <-- ADDED
  user: {
    name: string | null;
  } | null;
}[];

// Type for the function's return value including count
type GetPadsResult = {
  pads: ExplorePadData;
  totalCount: number;
};

/**
 * Fetches a specific page of public, listed, and non-expired pads.
 * Returns pads and total count. Returns empty array/zero count on error.
 */
async function getExplorePads(page: number = 1): Promise<GetPadsResult> {
  try {
    const skip = (page - 1) * PAGE_SIZE;
    const take = PAGE_SIZE;

    const whereClause = {
      visibility: Visibility.PUBLIC,
      isListed: true, // Only show discoverable pads
      linkOnlyAccess: false, // <-- ADDED: Exclude share-only links
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };

    // Fetch pads and count
    const [pads, totalCount] = await prisma.$transaction([
      prisma.pad.findMany({
        where: whereClause,
        select: {
          id: true,
          customId: true,
          title: true,
          createdAt: true,
          hideCreator: true, // <-- Select hideCreator
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: take,
      }),
      prisma.pad.count({ where: whereClause }),
    ]);

    // Ensure pads is always an array
    const validPads = Array.isArray(pads) ? pads : [];

    return { pads: validPads, totalCount };
  } catch (error) {
    console.error('Failed to fetch explore pads:', error);
    return { pads: [], totalCount: 0 }; // Return empty result on error
  }
}

/**
 * Explore Page Server Component
 */
export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pageQuery = (await searchParams)?.page;
  const currentPage =
    typeof pageQuery === 'string' && parseInt(pageQuery) > 0
      ? parseInt(pageQuery)
      : 1;

  // Fetch pads with error handling assurance
  const { pads: initialPads, totalCount } = await getExplorePads(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Explore Public Pads
        </h1>
        <ExplorePads
          initialPads={initialPads} // Already guaranteed to be an array
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

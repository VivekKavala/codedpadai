// src/app/dashboard/page.tsx
import { auth } from '../../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { Activity, ChevronLeft, ChevronRight, Search } from 'lucide-react'; // <-- Added icons
import { Prisma } from '@/generated/prisma'; // <-- Import Prisma types

// --- UPDATED: Define props to accept searchParams ---
interface DashboardPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string; // <-- ADDED: for search
  }>;
}

// --- UPDATED: Component signature to accept props ---
export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const searchParamsValues = await searchParams;
  // --- UPDATED: Pagination and Search logic ---
  const pageSize = 10; // Show 10 pads per page
  const page = parseInt(searchParamsValues.page || '1', 10);
  const currentPage = Math.max(page, 1);
  const searchQuery = searchParamsValues.query || ''; // Get search query

  // Build the where clause for Prisma
  const whereClause: Prisma.PadWhereInput = {
    userId: session.user.id,
  };

  if (searchQuery) {
    whereClause.title = {
      contains: searchQuery,
      mode: 'insensitive', // Case-insensitive search
    };
  }
  // --- END: Pagination and Search logic ---

  // --- UPDATED: Fetch total count and paginated pads in a transaction ---
  const [totalPads, pads] = await prisma.$transaction([
    prisma.pad.count({ where: whereClause }), // <-- Use updated whereClause
    prisma.pad.findMany({
      where: whereClause, // <-- Use updated whereClause
      select: {
        id: true,
        customId: true,
        title: true,
        visibility: true,
        views: true,
        createdAt: true,
        enableAuditLogs: true,
        files: {
          // Fetch first file's content for snippet
          select: {
            content: true,
          },
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalPads / pageSize);
  // --- END: Data fetching update ---

  // --- ADDED: Helper to create pagination links that preserve search query ---
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParamsValues); // Gets current params (query, etc.)
    params.set('page', pageNumber.toString());
    return `/dashboard?${params.toString()}`;
  };
  // --- END ADD ---

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Pad
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pb-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Welcome back, {session.user.name || 'User'}!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your secure pads and create new ones.
              </p>
            </div>
          </div>

          {/* --- NEW: Search Bar --- */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <form method="GET" className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <label htmlFor="search" className="sr-only">
                    Search pads
                  </label>
                  <input
                    type="search"
                    name="query"
                    id="search"
                    defaultValue={searchQuery}
                    placeholder="Search your pads by title..."
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
          {/* --- END NEW --- */}

          {/* Pads List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Pads
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {/* UPDATED: Show total pads count */}
                {totalPads} pad{totalPads !== 1 ? 's' : ''} found
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {pads.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <p className="text-gray-500">
                    {searchQuery
                      ? 'No pads found for your search.'
                      : 'No pads yet.'}
                  </p>
                  <Link
                    href="/create"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-500"
                  >
                    Create your first pad →
                  </Link>
                </li>
              ) : (
                pads.map((pad) => {
                  // --- ADDED: Get snippet from the first file ---
                  const snippet = pad.files[0]?.content || '[No content]';

                  return (
                    <li key={pad.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/pad/${pad.id}`}
                              className="block focus:outline-none"
                            >
                              <p className="text-sm font-medium text-blue-600 truncate hover:text-blue-500">
                                {pad.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {/* --- UPDATED: Use snippet --- */}
                                {snippet.substring(0, 150)}
                                {snippet.length > 150 ? '...' : ''}
                              </p>
                            </Link>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                            {/* Audit Log Link */}
                            {pad.enableAuditLogs && (
                              <Link
                                href={`/dashboard/logs/${pad.id}`}
                                className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
                                title="View audit logs"
                              >
                                <Activity className="h-4 w-4 mr-1" />
                                Logs
                              </Link>
                            )}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {pad.visibility}
                            </span>
                            <div className="text-sm text-gray-500">
                              {pad.views} views
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Created {new Date(pad.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            {/* --- UPDATED: Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="px-4 py-3 sm:px-6 border-t border-gray-200 flex items-center justify-between">
                <Link
                  href={createPageURL(currentPage - 1)}
                  className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                    currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                  }`}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : undefined}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </Link>
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <Link
                  href={createPageURL(currentPage + 1)}
                  className={`inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                    currentPage >= totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }`}
                  aria-disabled={currentPage >= totalPages}
                  tabIndex={currentPage >= totalPages ? -1 : undefined}
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
            )}
            {/* --- END UPDATED --- */}
          </div>
        </div>
      </main>
    </div>
  );
}

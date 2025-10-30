'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { type ExplorePadData } from '@/app/explore/page'; // Adjusted import path

// Updated Props to expect hideCreator within ExplorePadData elements
interface ExplorePadsProps {
  initialPads: ExplorePadData | undefined; // Still handle potential undefined from RSC boundary
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

const DOTS = '...';

/**
 * Helper function to generate a range of numbers
 */
const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

/**
 * Custom hook logic for generating pagination range
 */
const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}) => {
  const paginationRange = useMemo(() => {
    const totalPages = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageSlots = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPages <= totalPageSlots) {
      return range(1, totalPages);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount.
      Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPages];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // Fallback just in case
    return range(1, totalPages);
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

const ExplorePads: React.FC<ExplorePadsProps> = ({
  initialPads,
  totalCount,
  pageSize,
  currentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Log the received prop
  useEffect(() => {
    // console.log("ExplorePads received initialPads:", initialPads, "currentPage:", currentPage, "totalCount:", totalCount);
  }, [initialPads, currentPage, totalCount]);

  // Ensure pads is always an array
  const pads = useMemo(
    () => (Array.isArray(initialPads) ? initialPads : []),
    [initialPads]
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // --- ADDED PAGINATION LOGIC ---
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
    siblingCount: 1,
  });

  // Memoize filtered and sorted pads
  const filteredPads = useMemo(() => {
    let filtered = [...pads]; // Use the guaranteed array

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((pad) =>
        pad.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort pads
    filtered.sort((a, b) => {
      try {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        if (isNaN(dateA) || isNaN(dateB)) return 0; // Handle invalid dates
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      } catch (e) {
        console.error(
          'Error parsing date during sort:',
          a.createdAt,
          b.createdAt,
          e
        );
        return 0; // Prevent crash on invalid date format
      }
    });

    return filtered;
  }, [pads, searchTerm, sortBy]); // Depend on the safe 'pads' array

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as 'newest' | 'oldest')}
          >
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pads Grid/List */}
      {/* Use the safe 'pads' array length for the initial check */}
      {pads.length === 0 && totalCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No public pads available yet.</p>
        </div>
      ) : filteredPads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPads.map((pad) => (
            <Link
              href={`/pad/${pad.id}`} // Link using the main database ID
              key={pad.id}
              className="block group"
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border border-gray-100 hover:border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 truncate">
                    {pad.title || 'Untitled Pad'}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 flex items-center gap-1 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    Created{' '}
                    {pad.createdAt
                      ? new Date(pad.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Unknown Date'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {/* --- UPDATED: Use hideCreator flag --- */}
                  By{' '}
                  {pad.hideCreator
                    ? 'Anonymous'
                    : pad.user?.name || 'Anonymous'}
                  {/* --- END UPDATE --- */}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No public pads found matching your criteria.
          </p>
        </div>
      )}

      {/* --- UPDATED PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <Button
            asChild
            variant="outline"
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <Link href={`/explore?page=${currentPage - 1}`} scroll={false}>
              <ChevronLeft className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Previous</span>
            </Link>
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {paginationRange?.map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="flex items-center justify-center h-10 w-10 text-gray-500"
                    aria-hidden="true"
                  >
                    {DOTS}
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  asChild
                  variant={page === currentPage ? 'default' : 'outline'}
                  disabled={page === currentPage}
                  aria-label={`Go to page ${page}`}
                  className="h-10 w-10"
                >
                  <Link href={`/explore?page=${page}`} scroll={false}>
                    {page}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Button
            asChild
            variant="outline"
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <Link href={`/explore?page=${currentPage + 1}`} scroll={false}>
              <span className="sr-only sm:not-sr-only">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExplorePads;

'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Monitor,
  Clock,
  Shield,
  FileText,
  Eye,
  MapPin,
  Smartphone,
} from 'lucide-react';
import type { ProcessedLog } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

// Helper function to get the icon (moved from page.tsx)
function getActionIcon(action: string) {
  // ... (same as before)
  switch (action.toUpperCase()) {
    case 'VIEW':
      return <Eye className="w-4 h-4 text-blue-500" />;
    case 'EDIT':
      return <FileText className="w-4 h-4 text-yellow-500" />;
    case 'CREATE':
      return <Shield className="w-4 h-4 text-green-500" />;
    default:
      return <Monitor className="w-4 h-4 text-gray-500" />;
  }
}

interface AuditLogListProps {
  logs: ProcessedLog[];
  // NEW: Pre-calculated filter options from the server
  uniqueActions: string[];
  uniqueLocations: string[];
}

export default function AuditLogList({
  logs,
  uniqueActions,
  uniqueLocations,
}: AuditLogListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // --- NEW FILTER STATE ---
  const [filterAction, setFilterAction] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // --- NEW: Memoized filtered logs ---
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Filter by Action
    if (filterAction) {
      filtered = filtered.filter(
        (log) => log.action.toUpperCase() === filterAction
      );
    }

    // Filter by Location
    if (filterLocation) {
      filtered = filtered.filter((log) => log.locationText === filterLocation);
    }

    // Filter by Date Range
    if (filterStartDate) {
      const startDate = new Date(filterStartDate);
      filtered = filtered.filter((log) => new Date(log.timestamp) >= startDate);
    }
    if (filterEndDate) {
      // Set to end of day
      const endDate = new Date(filterEndDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((log) => new Date(log.timestamp) <= endDate);
    }

    return filtered;
  }, [logs, filterAction, filterLocation, filterStartDate, filterEndDate]);

  // --- NEW: Reset to page 1 when filters change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [filterAction, filterLocation, filterStartDate, filterEndDate]);

  // --- UPDATED: Paginate the filtered logs ---
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // --- UPDATED: Pagination handlers ---
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // --- NEW: Filter reset handler ---
  const resetFilters = () => {
    setFilterAction('');
    setFilterLocation('');
    setFilterStartDate('');
    setFilterEndDate('');
    setCurrentPage(1);
  };

  return (
    <>
      {/* --- NEW FILTER BAR --- */}
      <div className="mb-6 p-4 bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Action Filter */}
          <div>
            <label
              htmlFor="filter-action"
              className="block text-sm font-medium text-gray-700"
            >
              Action
            </label>
            <select
              id="filter-action"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label
              htmlFor="filter-location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <select
              id="filter-location"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="filter-start-date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="filter-start-date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="filter-end-date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="filter-end-date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <button
              onClick={resetFilters}
              className="mt-1 w-full inline-flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      {/* --- END FILTER BAR --- */}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {/* UPDATED: Check filtered logs length */}
          {filteredLogs.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No audit logs found matching your filters.
              </p>
            </li>
          ) : (
            currentLogs.map((log) => (
              <li key={log.id} className="p-4 sm:p-6 hover:bg-gray-50">
                {/* ... (log rendering part is unchanged) ... */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="p-1.5 bg-gray-100 rounded-full"
                      title={log.action}
                    >
                      {getActionIcon(log.action)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {log.action.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 text-xs text-gray-600 space-y-1.5 pl-10 sm:pl-0">
                    <p
                      className="flex items-center gap-1.5"
                      title={log.ipAddress || 'Unknown IP'}
                    >
                      <Monitor className="w-3 h-3 text-gray-400" />
                      <span>{log.ipAddress || 'Unknown'}</span>
                    </p>
                    <p
                      className="flex items-center gap-1.5"
                      title={log.locationTitle}
                    >
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{log.locationText}</span>
                    </p>
                    <p
                      className="flex items-center gap-1.5 truncate"
                      title={log.userAgent || 'Unknown User Agent'}
                    >
                      <Smartphone className="w-3 h-3 text-gray-400" />
                      <span className="truncate">
                        {log.userAgent || 'Unknown'}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* --- UPDATED: Pagination controls --- */}
        {/* Now based on filteredLogs.length */}
        {filteredLogs.length > ITEMS_PER_PAGE && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              {/* ... (mobile buttons unchanged) ... */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredLogs.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredLogs.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {/* ... (desktop buttons unchanged) ... */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    &lt;
                  </button>
                  <span
                    aria-current="page"
                    className="relative z-10 inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700"
                  >
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    &gt;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

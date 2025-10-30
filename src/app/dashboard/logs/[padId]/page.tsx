import { auth } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Monitor,
  Clock,
  Shield,
  FileText,
  Eye,
  MapPin,
  Smartphone,
} from 'lucide-react';
// --- NEW IMPORTS ---
import AuditLogList from '@/components/AuditLogsList';
import type { ProcessedLog } from '@/lib/types';

// --- (Interface GeoInfo remains the same) ---
// Interface for our location data
interface GeoInfo {
  country?: string;
  city?: string;
  regionName?: string;
}

// --- (getGeoData function remains the same) ---
/**
 * Fetches geolocation data for a single IP address.
 * Uses ip-api.com, which is free and requires no API key.
 * NOTE: This service has rate limits. See "Best Practice" in the chat.
 */
async function getGeoData(ip: string): Promise<GeoInfo | null> {
  // Don't fetch for localhost or invalid IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return null;
  }

  try {
    // We only ask for the fields we need to be efficient
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName`,
      {
        // Set a short timeout
        signal: AbortSignal.timeout(2000),
      }
    );

    if (!res.ok) {
      console.warn(
        `Geo API request failed for ${ip} with status: ${res.status}`
      );
      return null;
    }

    const data = await res.json();

    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
        regionName: data.regionName,
      };
    } else {
      console.warn(`Geo API returned error for ${ip}: ${data.message}`);
      return null;
    }
  } catch (error) {
    // This could be a fetch error or timeout
    console.error(`Failed to fetch geo data for IP ${ip}:`, error);
    return null;
  }
}
// --- END NEW HELPER ---

// --- (getPadWithLogs function remains the same) ---
/**
 * Fetches a pad and its audit logs, ensuring user ownership.
 */
async function getPadWithLogs(padId: string, userId: string) {
  try {
    const pad = await prisma.pad.findUnique({
      where: {
        id: padId,
        userId: userId, // CRITICAL: Ensures only the owner can view logs
      },
      include: {
        auditLogs: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });
    return pad;
  } catch (error) {
    console.error('Failed to fetch pad with logs:', error);
    return null;
  }
}

// --- (getActionIcon function has been REMOVED from here) ---

export default async function AuditLogPage({
  params,
}: {
  params: Promise<{ padId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const { padId } = await params;
  const pad = await getPadWithLogs(padId, session.user.id);

  // --- (Pad not found logic remains the same) ---
  if (!pad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pad Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The pad you are looking for either does not exist or you do not have
            permission to view its logs.
          </p>
          <Button
            asChild
            variant="ghost"
            href="/dashboard"
            className="inline-flex items-center !p-0 !bg-transparent hover:!bg-transparent text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- (Logging disabled logic remains the same) ---
  if (!pad.enableAuditLogs) {
    // ... (This part is unchanged)
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              href="/dashboard"
              className="inline-flex items-center !p-0 !bg-transparent hover:!bg-transparent text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="text-center p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Logging Disabled
            </h2>
            <p className="text-gray-600">
              Audit logging was disabled for the pad "
              <span className="font-semibold">{pad.title}</span>" when these
              events occurred.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- (Geo data fetching logic remains the same) ---
  const geoDataMap = new Map<string, GeoInfo | null>();

  if (pad.auditLogs.length > 0) {
    // 1. Get all unique, valid IPs
    const uniqueIPs = [
      ...new Set(pad.auditLogs.map((log) => log.ipAddress).filter(Boolean)),
    ] as string[];

    // 2. Fetch data for all unique IPs in parallel
    const geoDataPromises = uniqueIPs.map((ip) => getGeoData(ip));
    const geoResults = await Promise.allSettled(geoDataPromises);

    // 3. Create the lookup map
    geoResults.forEach((result, index) => {
      const ip = uniqueIPs[index];
      if (result.status === 'fulfilled') {
        geoDataMap.set(ip, result.value); // Store result (or null if API failed)
      } else {
        // Promise was rejected (e.g., network error)
        geoDataMap.set(ip, null);
      }
    });
  }
  // --- END NEW LOGIC ---

  // --- (Summary calculation logic remains the same) ---
  const totalLogs = pad.auditLogs.length;
  const totalViews = pad.auditLogs.filter(
    (log) => log.action.toUpperCase() === 'VIEW'
  ).length;
  const totalEdits = pad.auditLogs.filter(
    (log) => log.action.toUpperCase() === 'EDIT'
  ).length;

  // Calculate location stats based on views
  const locationViewCounts = new Map<string, number>();
  for (const log of pad.auditLogs) {
    // Only count views that have an IP
    if (log.action.toUpperCase() !== 'VIEW' || !log.ipAddress) {
      continue;
    }

    const geo = geoDataMap.get(log.ipAddress);
    // Aggregate by country, or 'Unknown' if not found
    const country = geo?.country || 'Unknown';

    // Increment the count for that country
    locationViewCounts.set(country, (locationViewCounts.get(country) || 0) + 1);
  }

  // Get the top 5 locations
  const topLocations = Array.from(locationViewCounts.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by count, descending
    .slice(0, 5) // Take the top 5
    .map(([name, count]) => ({ name, count }));
  // --- END SUMMARY CALCULATION ---

  // --- NEW: PRE-PROCESS LOGS FOR CLIENT COMPONENT ---
  const processedLogs: ProcessedLog[] = pad.auditLogs.map((log) => {
    const geo = log.ipAddress ? geoDataMap.get(log.ipAddress) : null;

    const locationTitle =
      geo && (geo.city || geo.regionName || geo.country)
        ? [geo.city, geo.regionName, geo.country].filter(Boolean).join(', ')
        : 'Location Unknown';

    const locationText =
      geo && (geo.city || geo.country)
        ? `${geo.city ? `${geo.city}, ` : ''}${geo.country}`
        : 'N/A';

    return {
      id: log.id,
      action: log.action,
      // Convert Date to string for serialization
      timestamp: log.timestamp.toISOString(),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      locationText,
      locationTitle,
    };
  });
  // --- NEW: Pre-calculate filter options ---
  const uniqueActions = [
    ...new Set(processedLogs.map((log) => log.action.toUpperCase())),
  ].sort();
  const uniqueLocations = [
    ...new Set(processedLogs.map((log) => log.locationText)),
  ]
    .filter(Boolean) // Remove 'N/A' or empty strings
    .sort();
  // --- END PRE-PROCESSING ---

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- (Header remains the same) --- */}
      <div className="bg-white shadow-sm">
        {/* ... (This part is unchanged) ... */}
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <Button
              asChild
              variant="ghost"
              className="inline-flex items-center !p-0 !bg-transparent hover:!bg-transparent text-blue-600 hover:text-blue-700"
              href="/dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Logs for: <span className="text-blue-600">{pad.title}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* --- (Summary section remains the same) --- */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Activity Summary
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total Views */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Views
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {totalViews}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Total Edits */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-md">
                    <FileText className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Edits
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {totalEdits}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Total Events */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-gray-100 rounded-md">
                    <Monitor className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Events
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {totalLogs}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Top Locations */}
            <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                    <MapPin className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">
                      Top View Locations
                    </h3>
                  </div>
                </div>
                {topLocations.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No view data from known locations.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {topLocations.map((loc) => (
                      <li
                        key={loc.name}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="font-medium text-gray-800">
                          {loc.name}
                        </span>
                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                          {loc.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* --- END SUMMARY SECTION --- */}
        {/* --- MODIFIED: Log List --- */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Logs</h3>
        {/* Pass the pre-processed, serializable logs to the client component */}
        {/* --- MODIFIED: Log List --- */}
        <AuditLogList
          logs={processedLogs}
          uniqueActions={uniqueActions}
          uniqueLocations={uniqueLocations}
        />{' '}
        {/* --- END MODIFIED Log List --- */}
      </main>
    </div>
  );
}

// ... (Placeholder Button component remains unchanged)
// A placeholder Button component if not globally available
// In a real app, you'd import this from '@components/ui/button'
const Button: React.FC<
  {
    asChild?: boolean;
    variant?: 'ghost' | 'outline';
    className?: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ asChild, variant, className, children, ...props }) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantStyle =
    variant === 'ghost'
      ? 'hover:bg-gray-100 hover:text-gray-900'
      : variant === 'outline'
        ? 'border border-gray-200 hover:bg-gray-100'
        : 'bg-blue-600 text-white hover:bg-blue-700';

  const combinedClassName = `${baseStyle} ${variantStyle} ${className || ''} px-4 py-2`;

  if (asChild) {
    // This is a simplified version. React.cloneElement would be needed for a real asChild
    return (
      <a className={combinedClassName} {...props}>
        {children}
      </a>
    );
  }
  return <button className={combinedClassName}>{children}</button>;
};

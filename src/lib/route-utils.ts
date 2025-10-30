/**
 * Utility functions for handling Next.js 15 async params and searchParams
 */

export async function getParams<T extends Record<string, string>>(
  params: Promise<T>
): Promise<T> {
  return await params;
}

export async function getSearchParams(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<{ [key: string]: string | string[] | undefined }> {
  return await searchParams;
}

/**
 * Helper to extract a single param value
 */
export async function getParam(
  params: Promise<{ [key: string]: string }>,
  key: string
): Promise<string> {
  const resolvedParams = await params;
  return resolvedParams[key];
}

/**
 * Helper to extract search param value
 */
export async function getSearchParam(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
  key: string
): Promise<string | string[] | undefined> {
  const resolvedSearchParams = await searchParams;
  return resolvedSearchParams[key];
}

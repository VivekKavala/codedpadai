// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://codedpadai.com';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/features',
    '/how-it-works',
    '/contact',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
    '/legal/cookie-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // You can add dynamic pages here (e.g., public pads)
  // const dynamicPages = await fetchPublicPads();

  return [...staticPages];
}

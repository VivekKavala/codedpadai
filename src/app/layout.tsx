import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose what you need
  variable: '--font-poppins',
});
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import ToolTip from '@/components/ToolTip';
import CookieConsentBanner from '@/components/CookieConsent';
import Script from 'next/script';
import Analytics from '@/components/Analytics';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CodedPadAI - Share and Store Code Securely',
  description:
    'CodedPadAI lets you protect and share your code or text safely — anytime, with anyone. Secure storage, easy sharing, and smart organization.',
  keywords: [
    'code sharing',
    'secure storage',
    'text snippets',
    'developer tools',
    'privacy',
  ],
  authors: [{ name: 'CodedPadAI Team' }],
  openGraph: {
    title: 'CodedPadAI - Share and Store Code Securely',
    description:
      'CodedPadAI lets you protect and share your code or text safely — anytime, with anyone.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodedPadAI - Share and Store Code Securely',
    description:
      'CodedPadAI lets you protect and share your code or text safely — anytime, with anyone.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased bg-white text-gray-900`}
      >
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <NextTopLoader
          color="#155dfc" // customize color
          height={4} // thickness of the bar
          showSpinner={false} // hide default spinner
          easing="ease"
          speed={500}
        />
        <Toaster
          position="bottom-right"
          // --- THIS IS THE FIX ---
          // 'classNames' goes INSIDE 'toastOptions' on older versions
          toastOptions={{
            classNames: {
              // Base style for all toasts
              toast:
                'rounded-xl shadow-lg border border-gray-700 bg-slate-800 text-white',

              // Specific style for error toasts
              error: 'border-red-500/50 bg-red-950 text-white',

              // success: "border-green-500/50 bg-green-950 text-white",
              // ...etc
            },
          }}
        />
        <Suspense>
          <Analytics />
        </Suspense>
        <Header />
        {children}
        <CookieConsentBanner />
        <ToolTip />
        <Footer />
      </body>
    </html>
  );
}

import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

/**
 * Global 404 "Not Found" page for the application.
 * Next.js will automatically render this component when a route is not found.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center !p-0 !bg-transparent hover:!bg-transparent text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back home
        </Link>
      </div>
    </div>
  );
}

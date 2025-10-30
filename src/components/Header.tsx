import Link from 'next/link';
import Logo from './Logo';
import { Home, Search, User } from 'lucide-react';
import { auth } from '@/lib/auth';
import MobileMenu from './MobileMenu';

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full flex justify-center items-center bg-white/80 backdrop-blur-sm shadow-sm top-0 z-50">
      <div className="max-w-[1500px] w-full px-4 flex justify-between">
        <div className="flex items-center">
          <MobileMenu />
          <div className="p-2">
            <Logo />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors items-center gap-2 md:flex hidden"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 md:flex hidden"
            >
              Explore
            </Link>
            <Link
              href="/features"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors items-center gap-2 md:flex hidden"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 md:flex hidden"
            >
              How it works
            </Link>
            {session?.user ? (
              <Link href="/profile">
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

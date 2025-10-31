import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/components/ProfileClient';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Render the client component, passing in the user data */}
        <ProfileClient user={session.user} />

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

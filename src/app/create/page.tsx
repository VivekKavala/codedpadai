import { Metadata } from 'next';
import CreatePadForm from '@/components/CreatePadForm';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Create a Pad - CodedPadAI',
  description:
    'Create a secure pad to store and share your code or text safely.',
};

export default async function CreatePadPage() {
  const session = await auth();

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Create a New Pad
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Store your code, text, or secrets securely. Choose who can access it
            and how.
          </p>
        </div>

        <CreatePadForm userId={session?.user.id || null} />
      </div>
    </div>
  );
}

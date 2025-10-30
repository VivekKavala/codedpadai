'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react'; // 1. Import useSession
import { useRouter } from 'next/navigation'; // 2. Import useRouter
import { toast } from 'sonner';
import { User } from 'next-auth';
import {
  User as UserIcon,
  Mail,
  Shield,
  Edit,
  Save,
  X,
  Trash,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button'; // Assuming you have this

// Define the props for the client component
interface ProfileClientProps {
  user: User;
}

export function ProfileClient({ user }: ProfileClientProps) {
  // 3. Get the 'update' function from useSession and 'router' from useRouter
  const { update } = useSession();
  const router = useRouter();

  // State for editing name
  const [name, setName] = useState(user.name || '');
  const [originalName, setOriginalName] = useState(user.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State for account deletion
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- 4. THIS IS THE FIXED FUNCTION ---
  const handleSaveName = async () => {
    if (name === originalName) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update name');
      }

      // 5. On success, call update()
      // This tells NextAuth to refresh the session token with the new name
      // using the logic in your auth.ts file.
      await update({ name: data.user.name });

      // 6. Then, call router.refresh()
      // This tells Next.js to re-run the Server Component (page.tsx)
      // to get the fresh data (which is now uncached).
      router.refresh();

      toast.success('Name updated successfully!');
      setIsEditingName(false);
      setOriginalName(name); // Set the new original name
    } catch (error: any) {
      toast.error(error.message);
      setName(originalName); // Revert to original name on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(originalName);
    setIsEditingName(false);
  };

  // --- Account Deletion Function ---
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete account');
      }

      toast.success('Account deleted successfully. You are being logged out.');
      router.push('/api/auth/signout');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              User Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your account details and settings.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {/* Name Field */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 self-center">
                  Full name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
                      >
                        {isSaving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>{name || 'Not set'}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </dd>
              </div>

              {/* Email Field */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </dd>
              </div>

              {/* User ID Field */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-xs">{user.id}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-red-300">
          <div className="px-4 py-5 sm:px-6 bg-red-50 border-b border-red-200">
            <h3 className="text-lg leading-6 font-semibold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Danger Zone
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-4">
            {showDeleteConfirm ? (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  This will permanently delete your account, pads, and all
                  associated data. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Delete your account
                  </h4>
                  <p className="text-sm text-gray-600">
                    Once deleted, your account and all data are gone forever.
                  </p>
                </div>
                {/* This is the part that was cut off */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 sm:mt-0 sm:ml-4 inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            )}
            <hr />
            {/* Logout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Log out</h4>
                <p className="text-sm text-gray-600">
                  Log out of your current session.
                </p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Go to Dashboard Link */}
        <div className="mt-6 flex justify-center">
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

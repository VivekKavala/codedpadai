'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function PadIdInput() {
  const router = useRouter();
  const [padId, setPadId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetError = () => setError('');

  const handleOpenPad = async () => {
    const id = padId.trim();
    if (!id) {
      setError('Please enter a Pad ID');
      return;
    }

    setIsLoading(true);
    resetError();

    try {
      const res = await fetch(`/api/pads/custom/${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          router.push(`/pad/${data.id}`);
          return;
        }
      }

      if (res.status === 404) {
        toast.error('Custom pad not found.');
        setPadId('');
        return;
      }

      if (res.status >= 500) {
        toast.error('Server error. Please try again later.');
        return;
      }

      toast.error('An unexpected error occurred. Please try again.');
    } catch (err) {
      console.error('Fetch failed:', err);
      toast.error('Network error. Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * --- 1. RENAMED and UPDATED ---
   * Fetches a random public pad's customId and populates the input field.
   */
  const discoverPublicPad = async () => {
    setIsLoading(true);
    resetError();
    try {
      const res = await fetch('/api/pads/random');
      if (res.status === 404) {
        setError('No public pads are available to discover.');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch random pad');

      const data = await res.json();
      const pad = data?.data;

      // --- 2. THIS IS THE NEW BEHAVIOR ---
      if (pad?.customId) {
        setPadId(pad.customId); // Set the customId in the input field
        toast.success('Public pad ID loaded. Click "Open Pad" to view it.');
      } else {
        setError('No public pads are available to discover.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not fetch a random pad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOpenPad();
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-4 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Open a Pad
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Enter a Pad ID to open an existing pad or create a new one
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative h-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter Pad ID"
                  value={padId}
                  name="padId"
                  onChange={(e) => setPadId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-sm md:text-lg"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button
              onClick={handleOpenPad}
              disabled={isLoading || !padId.trim()}
              size="lg"
              className="w-full h-12 text-sm md:text-lg transform transition hover:-translate-y-0.5"
            >
              {/* ... (button loading state is unchanged) ... */}
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Opening...
                </>
              ) : (
                <>
                  Open Pad
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>
                Don't have a Pad ID?{' '}
                <button
                  // --- 3. UPDATED ---
                  onClick={discoverPublicPad}
                  className="text-blue-600 hover:text-blue-700 underline"
                  disabled={isLoading}
                >
                  Discover a public pad
                </button>{' '}
                or{' '}
                <button
                  onClick={() => router.push('/create')}
                  className="text-blue-600 hover:text-blue-700 underline"
                  disabled={isLoading}
                >
                  create a new pad
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

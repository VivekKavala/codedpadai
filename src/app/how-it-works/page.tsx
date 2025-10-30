import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Import Image
import {
  Shield,
  SquareStack,
  Clock,
  Briefcase,
  User,
  Lightbulb,
  Pencil, // Added
  Lock, // Added
  Server, // Added
  Unlock, // Added
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-50/70 relative isolate pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Background Gradient */}
        <div
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          {/* --- UPDATED: Centered gradient --- */}
          <div
            className="relative left-1/2 -translate-x-1/2 aspect-[1155/678] w-[36.125rem] rotate-[30deg] bg-gradient-to-tr from-[#809fff] to-[#9089fc] opacity-30 sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            How CodedPadAI Works
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            We believe in transparent security. Here’s a simple breakdown of our
            features and, most importantly, how we protect your data.
          </p>
        </div>
      </section>

      {/* --- NEW: Security Flow Section --- */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Zero-Knowledge Architecture
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Security Flow
            </p>
            <p className="mt-4 text-lg text-gray-600">
              When you choose "Client-Side Encryption," we use a zero-knowledge
              model. This means we *never* see your unencrypted data. Here’s the
              step-by-step flow:
            </p>
          </div>
          <div className="mt-20">
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {/* Step 1 */}
              <li className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 ring-8 ring-blue-50">
                  <Pencil className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  1. You Create
                </h3>
                <p className="mt-2 text-gray-600">
                  You type your code or notes directly into your browser. All
                  content stays on your device.
                </p>
              </li>
              {/* Step 2 */}
              <li className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 ring-8 ring-blue-50">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  2. Browser Encrypts
                </h3>
                <p className="mt-2 text-gray-600">
                  When you hit "Create," your browser generates a random key and
                  encrypts your data *before* it's sent.
                </p>
              </li>
              {/* Step 3 */}
              <li className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 ring-8 ring-blue-50">
                  <Server className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  3. Server Stores
                </h3>
                <p className="mt-2 text-gray-600">
                  We only store the scrambled, encrypted "gibberish." We *never*
                  see your key or your original content.
                </p>
              </li>
              {/* Step 4 */}
              <li className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 ring-8 ring-blue-50">
                  <Unlock className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  4. Browser Decrypts
                </h3>
                <p className="mt-2 text-gray-600">
                  The unique key is part of the share link (after the #). It's
                  never sent to our server. Only the recipient's browser can use
                  it to unlock the data.
                </p>
              </li>
            </ol>
          </div>
          <div className="mt-16 max-w-3xl mx-auto p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-900 font-medium">
              **The Result:** We can't read your data, and no attacker can
              either. Even if our database was stolen, your pads would be
              unreadable, useless blocks of encrypted text.
            </p>
          </div>
        </div>
      </section>
      {/* --- END NEW SECTION --- */}

      {/* Core Features Section */}
      <section className="bg-gray-50/70 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Core Features at a Glance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful tools that give you full control over your data.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Multi-File Tabs */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white">
                <SquareStack className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Organize with Tabs
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Stop sharing multiple files. Group your HTML, CSS, and JS into a
                single, shareable pad.
              </p>
            </div>

            {/* Feature 2: Client-Side Encryption */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Zero-Knowledge Encryption
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Our core security feature. Your data is encrypted *in your
                browser* before it's stored.
              </p>
            </div>

            {/* Feature 3: Expiry & Access Control */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Lifecycle Control
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Set pads to "burn after reading," expire after a set time, or
                delete after a specific view count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Use Cases Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Who is CodedPadAI For?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From individual developers to security-conscious teams, our tools
              are built to be flexible.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-8 bg-gray-50/70 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white ring-2 ring-gray-200">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Developers & Teams
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Securely share API keys, config files, or bug reports with
                teammates using password-protected, expiring links.
              </p>
              {/* --- UPDATED: Added unoptimized prop --- */}
              <Image
                src="https://placehold.co/100x100/e0e7ff/60a5fa?text=Dev"
                alt="Developer icon"
                width={100}
                height={100}
                className="w-16 h-16 mt-4 opacity-50 rounded-lg"
                unoptimized={true}
              />
            </div>
            <div className="flex flex-col items-center p-8 bg-gray-50/70 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white ring-2 ring-gray-200">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Job Seekers
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Submit your take-home coding challenge in a multi-tab pad.
                Password-protect it and get notified when it's viewed.
              </p>
              {/* --- UPDATED: Added unoptimized prop --- */}
              <Image
                src="https://placehold.co/100x100/e0e7ff/60a5fa?text=Job"
                alt="Job seeker icon"
                width={100}
                height={100}
                className="w-16 h-16 mt-4 opacity-50 rounded-lg"
                unoptimized={true}
              />
            </div>
            <div className="flex flex-col items-center p-8 bg-gray-50/70 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white ring-2 ring-gray-200">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Daily Note Takers
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Quickly jot down sensitive information, like a private key or a
                temporary password, with a "burn after reading" link.
              </p>
              {/* --- UPDATED: Added unoptimized prop --- */}
              <Image
                src="https://placehold.co/100x100/e0e7ff/60a5fa?text=Note"
                alt="Note taker icon"
                width={100}
                height={100}
                className="w-16 h-16 mt-4 opacity-50 rounded-lg"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-50/70">
        <div className="max-w-4xl mx-auto py-24 px-6 sm:py-32 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get Started in Seconds
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            No account required. Create your first secure pad and experience
            true data privacy.
          </p>
          <div className="mt-10">
            <Link
              href="/create"
              className="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Create Your Secure Pad Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

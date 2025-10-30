'use client';

import React from 'react';
import {
  ShieldCheck, // Client-Side Encryption
  Key, // Password Protection / Edit Access
  Clock, // Expiry / Burn After Reading
  SquareStack, // Multi-Tab Pads
  Code, // Content / Code snippet
  EyeOff, // Total Privacy
  Link, // Custom IDs / Secret Link
  QrCode, // QR Code Sharing
  CopyMinus, // Disable Copying
  BarChart2, // View Count / Audit Logs (conceptually)
  UserRound, // Anonymous Creation / Dashboard
  Search, // Explore / Search
  Trash2, // Deletion (Expiry/Burn)
} from 'lucide-react';

const features = [
  {
    name: 'Client-Side Encryption',
    description:
      'Your data is encrypted in your browser before ever reaching our servers, ensuring true privacy.',
    icon: ShieldCheck,
  },
  {
    name: 'Multi-Tab Pads',
    description:
      'Organize related code, notes, or files within a single pad using intuitive tabs, just like an IDE.',
    icon: SquareStack,
  },
  {
    name: 'Password Protection',
    description:
      'Secure your pads with an access key, ensuring only authorized viewers can unlock their content.',
    icon: Key,
  },
  {
    name: 'Time & View Expiry',
    description:
      'Set pads to automatically delete after a specific time, a certain number of views, or even after a single read.',
    icon: Clock,
  },
  {
    name: 'Anonymous Creation',
    description:
      'Create and share pads instantly without needing an account, prioritizing speed and privacy.',
    icon: UserRound,
  },
  {
    name: 'Custom & Secret Links',
    description:
      'Use custom, readable IDs or secret share tokens for easy yet secure access to your pads.',
    icon: Link,
  },
  {
    name: 'Audit Logging',
    description:
      'Keep track of who accessed your pads and when, providing full transparency and control.',
    icon: BarChart2,
  },
  {
    name: 'Disable Copying',
    description:
      'Prevent casual copying of pad content, adding an extra layer of protection for sensitive information.',
    icon: CopyMinus,
  },
  {
    name: 'Private & Unlisted Options',
    description:
      'Control pad visibility, making them private to you or only accessible via a direct link.',
    icon: EyeOff,
  },
];

export default function FeaturesGrid() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Powerful Capabilities
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for secure code sharing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            CodedPadAI offers robust features designed for developers, teams,
            and anyone needing to share sensitive information with control and
            confidence.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-6 w-6 flex-none text-blue-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

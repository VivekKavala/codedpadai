import React from 'react';
import { Check, X, Shield } from 'lucide-react';

// Define feature data
const features = [
  {
    name: 'Client-Side Encryption',
    codedPad: true,
    privateBin: true,
    gist: false,
    pastebin: false,
  },
  {
    name: 'Multi-Tab Interface (IDE-like)',
    codedPad: true,
    privateBin: false,
    gist: false,
    pastebin: false,
  },
  {
    name: 'User Accounts & Dashboard',
    codedPad: true,
    privateBin: false,
    gist: true,
    pastebin: true,
  },
  {
    name: 'Burn After Reading',
    codedPad: true,
    privateBin: true,
    gist: false,
    pastebin: false,
  },
  {
    name: 'Password Protection',
    codedPad: true,
    privateBin: true,
    gist: false,
    pastebin: true,
  },
  {
    name: 'Public "Explore" Page',
    codedPad: true,
    privateBin: false,
    gist: true,
    pastebin: true,
  },
];

// Helper to render check or x
const FeatureCheck = ({ enabled }: { enabled: boolean }) => {
  return enabled ? (
    <Check className="h-5 w-5 text-green-500" />
  ) : (
    <X className="h-5 w-5 text-gray-400" />
  );
};

export default function ComparisonTable() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose CodedPadAI?
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            See how our features stack up against other popular code sharing
            tools. We combine security, power, and ease of use.
          </p>
        </div>

        <div className="mt-20 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Pastebin.com
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      GitHub Gist
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      PrivateBin
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-3 pr-4 text-center text-sm font-semibold sm:pr-6 bg-blue-50 text-blue-700 rounded-tr-lg"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <Shield className="h-4 w-4" />
                        CodedPadAI
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {features.map((feature) => (
                    <tr key={feature.name}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {feature.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <FeatureCheck enabled={feature.pastebin} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <FeatureCheck enabled={feature.gist} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        <FeatureCheck enabled={feature.privateBin} />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium text-center sm:pr-6 bg-blue-50">
                        <span className="flex justify-center">
                          <FeatureCheck enabled={feature.codedPad} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

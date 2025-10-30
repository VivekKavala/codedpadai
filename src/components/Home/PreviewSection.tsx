import React from 'react';
import { SquareStack, Lock, Shield, Flame } from 'lucide-react';

export default function PreviewSection() {
  return (
    <section className="py-24 bg-gray-50/70 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See it in Action
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Here's a preview of our clean, multi-tab interface and powerful
            security features.
          </p>
        </div>

        {/* Start of Mockup */}
        <div className="mt-20">
          <div className="relative max-w-4xl mx-auto rounded-xl bg-white shadow-2xl border border-gray-200">
            {/* Fake Browser/Window Bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-400"></span>
            </div>

            {/* Mockup App Header (Title + Badges) */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 text-left">
                My Secure Project
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Security Badges */}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  <Shield className="w-3 h-3" /> Encrypted
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  <Lock className="w-3 h-3" /> Protected
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                  <Flame className="w-3 h-3" /> Burn After Reading
                </span>
              </div>
            </div>

            {/* Mockup Tab Bar */}
            <div className="flex items-center border-b border-gray-200 px-2 sm:px-4">
              <button
                type="button"
                className="py-3 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600"
                aria-hidden="true"
              >
                script.js
              </button>
              <button
                type="button"
                className="py-3 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                aria-hidden="true"
              >
                style.css
              </button>
              <button
                type="button"
                className="py-3 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700"
                aria-hidden="true"
              >
                README.md
              </button>
            </div>

            {/* Mockup Content Area */}
            <div className="p-6 bg-gray-50 rounded-b-xl">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-gray-800 max-h-60 overflow-y-auto">
                <span className="text-purple-600">function</span>{' '}
                <span className="text-blue-500">encryptData</span>(
                <span className="text-orange-500">data, key</span>) {'{'}
                <br />
                {'  '}
                <span className="text-gray-400">// Client-side encryption</span>
                <br />
                {'  '}
                <span className="text-purple-600">const</span> encrypted ={' '}
                <span className="text-blue-500">AES</span>.
                <span className="text-blue-500">encrypt</span>(data, key);
                <br />
                {'  '}
                <span className="text-purple-600">return</span> encrypted.
                <span className="text-blue-500">toString</span>();
                <br />
                {'}'}
                <br />
                <br />
                <span className="text-gray-400">// This data never leaves</span>
                <br />
                <span className="text-gray-400">
                  // your browser unencrypted.
                </span>
              </pre>
            </div>
          </div>
        </div>
        {/* End of Mockup */}
      </div>
    </section>
  );
}

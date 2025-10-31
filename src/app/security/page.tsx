// app/security/page.tsx
import React from 'react';
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Code,
} from 'lucide-react';

const SecurityDocumentationPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={40} />
            <h1 className="text-4xl font-bold">Security Documentation</h1>
          </div>
          <p className="text-xl text-gray-300">
            Technical details about how CodedPadAI implements security and
            encryption
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Encryption Implementation */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-blue-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">
              Encryption Implementation
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Client-Side Encryption
              </h3>
              <p className="text-gray-700 mb-4">
                When you enable encryption for a pad, the following process
                occurs entirely in your browser:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 font-mono text-sm">
                <p>
                  <strong>Algorithm:</strong> AES-256-GCM
                </p>
                <p>
                  <strong>Mode:</strong> Galois/Counter Mode (authenticated
                  encryption)
                </p>
                <p>
                  <strong>Key Derivation:</strong> PBKDF2 with SHA-256
                </p>
                <p>
                  <strong>Iterations:</strong> 100,000 rounds
                </p>
                <p>
                  <strong>Salt:</strong> Randomly generated per pad (16 bytes)
                </p>
                <p>
                  <strong>IV:</strong> Randomly generated per encryption (12
                  bytes)
                </p>
                <p>
                  <strong>Implementation:</strong> Web Crypto API (SubtleCrypto)
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Encryption Process
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>User provides a passphrase</li>
                <li>PBKDF2 derives an encryption key from the passphrase</li>
                <li>Content is encrypted using AES-256-GCM in the browser</li>
                <li>
                  Only the encrypted ciphertext is transmitted to our servers
                </li>
                <li>Salt and IV are stored alongside the ciphertext</li>
                <li>The passphrase never leaves your browser</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> We cannot decrypt your encrypted
                pads. If you lose your passphrase, the data cannot be recovered
                by anyone, including us.
              </p>
            </div>
          </div>
        </section>

        {/* Password Hashing */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Key className="text-purple-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">
              Password & Passphrase Hashing
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Account Passwords
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Algorithm:</strong> bcrypt
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Cost Factor:</strong> 10 rounds
                </p>
                <p className="text-sm text-gray-700">
                  Passwords are never stored in plaintext
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Protected Pad Passphrases
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Algorithm:</strong> bcrypt
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Cost Factor:</strong> 10 rounds
                </p>
                <p className="text-sm text-gray-700">
                  Used for access control, not encryption
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Edit Access Keys
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Algorithm:</strong> bcrypt
                </p>
                <p className="text-sm text-gray-700">
                  Hashed before storage to protect edit permissions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transport Security */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Transport Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-1"
                size={20}
              />
              <div>
                <p className="font-semibold text-gray-900">HTTPS/TLS 1.3</p>
                <p className="text-sm text-gray-600">
                  All data transmission is encrypted in transit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-1"
                size={20}
              />
              <div>
                <p className="font-semibold text-gray-900">HSTS Enabled</p>
                <p className="text-sm text-gray-600">
                  HTTP Strict Transport Security enforces secure connections
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-1"
                size={20}
              />
              <div>
                <p className="font-semibold text-gray-900">Secure Headers</p>
                <p className="text-sm text-gray-600">
                  Content-Security-Policy and other security headers configured
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Store */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What We Store
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                For Encrypted Pads
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Encrypted ciphertext (we cannot read this)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    Salt and IV (needed for decryption, but useless without
                    passphrase)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Metadata (title, visibility, settings)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Your passphrase (never transmitted or stored)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Plaintext content (only you have this)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                For Unencrypted Pads
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">!</span>
                  <span>Plaintext content (we can technically read this)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Metadata (title, visibility, settings)</span>
                </li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-3">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> For sensitive data, always use
                  encryption. Unencrypted pads are stored in plaintext in our
                  database.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-amber-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">
              Security Limitations & Considerations
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">
                Client-Side Encryption Risks
              </h3>
              <ul className="text-sm text-amber-800 space-y-1 ml-4">
                <li>• Relies on browser security and implementation</li>
                <li>
                  • Vulnerable to compromised client devices or malicious
                  browser extensions
                </li>
                <li>• Cannot protect against keyloggers or screen capture</li>
                <li>• Passphrase strength is critical</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">
                What We Don't Protect Against
              </h3>
              <ul className="text-sm text-amber-800 space-y-1 ml-4">
                <li>• Compromised user devices</li>
                <li>• Weak or reused passphrases</li>
                <li>• Social engineering attacks</li>
                <li>• Screenshots or screen recording</li>
                <li>• Browser vulnerabilities or malicious extensions</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Best Practices
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Use strong, unique passphrases for encrypted pads</li>
                <li>• Enable "burn after reading" for highly sensitive data</li>
                <li>• Use private browsing mode for sensitive operations</li>
                <li>• Don't share passphrases over insecure channels</li>
                <li>• Verify the URL is correct before entering passphrases</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Open Source & Audits */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-indigo-600" size={32} />
            <h2 className="text-2xl font-bold text-gray-900">Transparency</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Current Status:</strong> CodedPadAI is currently a
              closed-source project. We are a small team and have not yet
              undergone independent security audits.
            </p>
            <p>
              <strong>Our Commitment:</strong> We strive to be transparent about
              our security implementation and limitations. This documentation
              page is our effort to be honest about what we do and don't
              protect.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm">
                If you identify security vulnerabilities, please report them
                responsibly to{' '}
                <a
                  href="mailto:legal@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  legal@codedpadai.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Technical Specifications Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Component
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Implementation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3 font-medium">Content Encryption</td>
                  <td className="p-3 text-gray-700">
                    AES-256-GCM (Web Crypto API)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Key Derivation</td>
                  <td className="p-3 text-gray-700">
                    PBKDF2-SHA256 (100k iterations)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Password Hashing</td>
                  <td className="p-3 text-gray-700">bcrypt (cost factor 10)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Transport Encryption</td>
                  <td className="p-3 text-gray-700">TLS 1.3</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Database</td>
                  <td className="p-3 text-gray-700">PostgreSQL</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Framework</td>
                  <td className="p-3 text-gray-700">Next.js 14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SecurityDocumentationPage;

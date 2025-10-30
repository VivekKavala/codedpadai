// app/legal/privacy-policy/page.tsx
import React from 'react';
import { Shield, Lock, Eye, Mail, Clock, Globe } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated: string = 'October 27, 2025';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 mb-2">
            <strong>CodedPadAI.com</strong> - Secure Pad Sharing Service
          </p>
          <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe size={24} className="text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to CodedPadAI.com. We are committed to protecting your
              privacy and ensuring the security of your data. This Privacy
              Policy explains how we collect, use, store, and protect your
              information when you use our secure pad sharing service.
              CodedPadAI.com is operated as an individual service based in
              India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Account Information (Optional)
                </h3>
                <p className="text-gray-700 mb-2">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Name (optional)</li>
                  <li>Email address</li>
                  <li>
                    OAuth information (if you sign up via Google or GitHub)
                  </li>
                  <li>Account creation and last update timestamps</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Note: User registration is optional. You can use our service
                  without creating an account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Pad Content
                </h3>
                <p className="text-gray-700 mb-2">
                  When you create a pad, we store:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Pad title and content (text only)</li>
                  <li>Visibility settings (public, private, protected)</li>
                  <li>
                    Security settings (encryption status, access controls)
                  </li>
                  <li>Expiration settings and view limits</li>
                  <li>Creation and modification timestamps</li>
                </ul>
                <p className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-2">
                  <Lock size={16} />
                  Important: Encrypted pads use client-side encryption. We
                  cannot access or read your encrypted content without your
                  passphrase.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Usage Analytics
                </h3>
                <p className="text-gray-700 mb-2">
                  We use Google Analytics to understand how our service is used:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Page views and navigation patterns</li>
                  <li>Device type, browser, and operating system</li>
                  <li>Geographic location (country/city level)</li>
                  <li>Referral sources</li>
                  <li>Session duration and interaction data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  4. Technical Information
                </h3>
                <p className="text-gray-700 mb-2">We automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>IP address (for security and audit logs)</li>
                  <li>Browser type and version</li>
                  <li>Device identifiers</li>
                  <li>Access timestamps</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  5. Cookies and Local Storage
                </h3>
                <p className="text-gray-700">
                  We use cookies and browser local storage for session
                  management, authentication, and user preferences. See our
                  Cookie Policy for detailed information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>1. Service Delivery:</strong> To provide, maintain, and
                improve our pad sharing service.
              </p>
              <p>
                <strong>2. Authentication:</strong> To manage user accounts and
                authentication (OAuth via Google/GitHub).
              </p>
              <p>
                <strong>3. Security:</strong> To protect against fraud, abuse,
                and unauthorized access.
              </p>
              <p>
                <strong>4. Analytics:</strong> To understand usage patterns and
                improve user experience.
              </p>
              <p>
                <strong>5. Communication:</strong> To respond to your inquiries
                and support requests.
              </p>
              <p>
                <strong>6. Compliance:</strong> To comply with legal obligations
                and enforce our Terms of Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={24} className="text-blue-600" />
              Data Security
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We implement industry-standard security measures to protect your
                data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Client-Side Encryption:</strong> Encrypted pads are
                  encrypted in your browser before being sent to our servers.
                </li>
                <li>
                  <strong>Hashed Passwords:</strong> All passwords and
                  passphrases are hashed using bcrypt before storage.
                </li>
                <li>
                  <strong>Secure Connections:</strong> All data transmission
                  uses HTTPS/TLS encryption.
                </li>
                <li>
                  <strong>Access Controls:</strong> Strict access controls
                  protect our database and servers.
                </li>
                <li>
                  <strong>Regular Backups:</strong> Your data is regularly
                  backed up to prevent loss.
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                However, no method of transmission over the internet is
                completely secure. While we strive to protect your data, we
                cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Data Retention
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Pads:</strong> Pads are retained according to their
                expiration settings. Expired pads are automatically deleted.
                Pads with "burn after reading" are deleted immediately after
                first view.
              </p>
              <p>
                <strong>User Accounts:</strong> Account data is retained until
                you delete your account. You can delete your account at any time
                from your account settings, which will permanently remove all
                your data including pads and audit logs.
              </p>
              <p>
                <strong>Audit Logs:</strong> When enabled, audit logs are
                retained for 90 days for security purposes.
              </p>
              <p>
                <strong>Analytics:</strong> Google Analytics data is retained
                according to Google's retention policies (typically 26 months).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights (GDPR)
            </h2>
            <p className="text-gray-700 mb-4">
              If you are located in the European Economic Area (EEA), you have
              the following rights under GDPR:
            </p>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>1. Right to Access:</strong> You can request a copy of
                your personal data.
              </p>
              <p>
                <strong>2. Right to Rectification:</strong> You can update or
                correct your information through your account settings.
              </p>
              <p>
                <strong>3. Right to Erasure:</strong> You can delete your pads
                and your entire account at any time through account settings.
              </p>
              <p>
                <strong>4. Right to Restrict Processing:</strong> You can
                request we limit how we process your data.
              </p>
              <p>
                <strong>5. Right to Data Portability:</strong> You can export
                your pad content at any time.
              </p>
              <p>
                <strong>6. Right to Object:</strong> You can object to certain
                data processing activities.
              </p>
              <p>
                <strong>7. Right to Withdraw Consent:</strong> You can withdraw
                consent for analytics cookies at any time.
              </p>
            </div>
            <p className="text-gray-700 mt-4">
              To exercise any of these rights, contact us at{' '}
              <a
                href="mailto:privacy@codedpadai.com"
                className="text-blue-600 hover:underline"
              >
                privacy@codedpadai.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Third-Party Services
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>We use the following third-party services:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <p>
                  <strong>Google Analytics:</strong> For usage analytics.
                </p>
                <p>
                  <strong>Google OAuth:</strong> For authentication via Google
                  account.
                </p>
                <p>
                  <strong>GitHub OAuth:</strong> For authentication via GitHub
                  account.
                </p>
                <p>
                  <strong>CDN Services:</strong> May be used for faster content
                  delivery.
                </p>
              </div>
              <p className="mt-3">
                We do not sell your data to third parties. Third-party services
                are used solely to provide and improve our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700">
              Our service does not have specific age restrictions. However, we
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us at{' '}
              <a
                href="mailto:privacy@codedpadai.com"
                className="text-blue-600 hover:underline"
              >
                privacy@codedpadai.com
              </a>
              , and we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              International Data Transfers
            </h2>
            <p className="text-gray-700 mb-3">
              Our servers are located in India. If you access our service from
              outside India, your information may be transferred to, stored, and
              processed in India.
            </p>
            <p className="text-gray-700">
              For users in the European Economic Area (EEA), we ensure
              appropriate safeguards are in place to protect your data in
              accordance with GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-3">
              We may update this Privacy Policy from time to time. When we make
              changes, we will update the "Last Updated" date and post the
              revised policy on this page. We encourage you to review this
              Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={24} className="text-blue-600" />
              Contact Us
            </h2>
            <p className="text-gray-700 mb-3">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:privacy@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@codedpadai.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;

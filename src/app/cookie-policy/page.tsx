// app/cookie-policy/page.tsx
import React from 'react';
import { Cookie, Settings, BarChart3, Shield, Clock } from 'lucide-react';

const CookiePolicyPage: React.FC = () => {
  const lastUpdated: string = 'October 27, 2025';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-gray-600 mb-2">
            <strong>CodedPadAI.com</strong> - Understanding Our Use of Cookies
          </p>
          <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cookies are small text files that are placed on your device
              (computer, smartphone, or tablet) when you visit a website. They
              are widely used to make websites work more efficiently and provide
              information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In addition to cookies, we also use browser local storage and
              session storage for similar purposes. These technologies help us
              provide you with a better, faster, and safer experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              CodedPadAI.com uses cookies and similar technologies for the
              following purposes:
            </p>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-green-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">
                  1. Necessary Cookies (Essential)
                </h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                <p className="text-sm font-medium text-green-800 mb-2">
                  These cookies are essential for the website to function
                  properly. They cannot be disabled.
                </p>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Purpose:</strong> Enable core website functionality,
                security, and user authentication.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Cookies Used:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <strong>Session Token:</strong> Maintains your logged-in
                    session
                    <br />
                    <span className="text-gray-600">
                      Duration: Session (deleted when browser closes)
                    </span>
                  </li>
                  <li>
                    <strong>CSRF Token:</strong> Protects against cross-site
                    request forgery attacks
                    <br />
                    <span className="text-gray-600">Duration: Session</span>
                  </li>
                  <li>
                    <strong>Authentication Cookie:</strong> Remembers your login
                    status
                    <br />
                    <span className="text-gray-600">
                      Duration: 30 days or until logout
                    </span>
                  </li>
                  <li>
                    <strong>Local Storage:</strong> Stores pad content
                    temporarily before saving
                    <br />
                    <span className="text-gray-600">
                      Duration: Persistent until manually cleared
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="text-blue-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">
                  2. Analytics Cookies (Optional)
                </h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Purpose:</strong> Help us understand how visitors use
                our website so we can improve the user experience.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Cookies Used:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <strong>Google Analytics (_ga, _gid, _gat):</strong> Tracks
                    page views, session duration, and user interactions
                    <br />
                    <span className="text-gray-600">
                      Duration: _ga (2 years), _gid (24 hours), _gat (1 minute)
                    </span>
                    <br />
                    <span className="text-gray-600">Provider: Google LLC</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Note:</strong> You can opt out of analytics cookies
                through our cookie consent banner or by enabling "Do Not Track"
                in your browser.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="text-purple-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">
                  3. Functional Cookies (Optional)
                </h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Purpose:</strong> Remember your preferences and settings
                to provide a personalized experience.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Cookies Used:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <strong>Theme Preference:</strong> Remembers your dark/light
                    mode choice
                    <br />
                    <span className="text-gray-600">Duration: 1 year</span>
                  </li>
                  <li>
                    <strong>Language Preference:</strong> Stores your selected
                    language
                    <br />
                    <span className="text-gray-600">Duration: 1 year</span>
                  </li>
                  <li>
                    <strong>Editor Settings:</strong> Saves your code editor
                    preferences (font size, theme, etc.)
                    <br />
                    <span className="text-gray-600">
                      Duration: Persistent (local storage)
                    </span>
                  </li>
                  <li>
                    <strong>Cookie Consent:</strong> Remembers your cookie
                    preferences
                    <br />
                    <span className="text-gray-600">Duration: 1 year</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              In addition to our own cookies, we use cookies from third-party
              services:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Google Analytics
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  We use Google Analytics to analyze website traffic and user
                  behavior. Google Analytics sets cookies to collect information
                  about your use of our website.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  OAuth Providers (Google, GitHub)
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  When you sign in using Google or GitHub, these services may
                  set their own cookies for authentication purposes.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Content Delivery Network (CDN)
                </h4>
                <p className="text-sm text-gray-700">
                  We may use CDN services to deliver static content faster.
                  These services may set cookies for performance optimization.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Manage Cookies
            </h2>
            <p className="text-gray-700 mb-4">
              You have several options for managing cookies:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  1. Cookie Consent Banner
                </h4>
                <p className="text-gray-700 mb-2">
                  When you first visit our website, you'll see a cookie consent
                  banner where you can:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Accept all cookies</li>
                  <li>Reject optional cookies (keeping only necessary ones)</li>
                  <li>Customize your cookie preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  2. Browser Settings
                </h4>
                <p className="text-gray-700 mb-3">
                  Most web browsers allow you to control cookies through their
                  settings. You can:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete cookies after each session</li>
                  <li>View and delete individual cookies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  3. Opt-Out Tools
                </h4>
                <p className="text-gray-700 mb-2">
                  For analytics cookies specifically, you can enable "Do Not
                  Track" in your browser settings.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Blocking or deleting necessary
                cookies may affect the functionality of our website. You may not
                be able to log in, save pads, or use certain features if
                necessary cookies are disabled.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Cookie Duration and Data Retention
            </h2>
            <p className="text-gray-700 mb-3">
              Different cookies have different lifespans:
            </p>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Session Cookies:</strong> Deleted when you close your
                browser
              </p>
              <p>
                <strong>Persistent Cookies:</strong> Remain on your device until
                they expire or you delete them manually
              </p>
              <p>
                <strong>Local Storage:</strong> Persists until you clear your
                browser data or we remove it
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for legal, operational, or regulatory
              reasons. The "Last Updated" date at the top of this page indicates
              when the policy was last revised. We encourage you to review this
              policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions About Cookies?
            </h2>
            <p className="text-gray-700 mb-3">
              If you have questions about our use of cookies or this Cookie
              Policy, please contact us:
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

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Related Policies
            </h3>
            <div className="space-y-2">
              <p>
                <a
                  href="/privacy"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Privacy Policy
                </a>
                <span className="text-gray-600 ml-2">
                  - Learn how we collect and use your data
                </span>
              </p>
              <p>
                <a
                  href="/terms"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Terms of Service
                </a>
                <span className="text-gray-600 ml-2">
                  - Review our terms and conditions
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CookiePolicyPage;

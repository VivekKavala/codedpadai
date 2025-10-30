// components/CookieConsentBanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        const saved: CookiePreferences = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences): void => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());

    if (prefs.analytics && typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    setIsVisible(false);
  };

  const handleAcceptAll = (): void => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = (): void => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = (): void => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences): void => {
    if (key === 'necessary') return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="w-full max-w-4xl pointer-events-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="text-white" size={24} />
              <h3 className="text-white font-semibold text-lg">
                Cookie Preferences
              </h3>
            </div>
            <button
              onClick={handleRejectAll}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {!showPreferences ? (
              <>
                <p className="text-gray-700 mb-4">
                  We use cookies to enhance your browsing experience, analyze
                  site traffic, and improve our services. Your privacy matters
                  to us, and we're committed to protecting your data.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  By clicking "Accept All", you consent to our use of cookies.
                  You can customize your preferences or learn more in our{' '}
                  <a
                    href="/cookie-policy"
                    className="text-blue-600 hover:underline"
                  >
                    Cookie Policy
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 min-w-[140px] bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="flex-1 min-w-[140px] border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Customize
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-6">
                  Choose which cookies you want to allow. You can change these
                  settings at any time.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Shield
                          className="text-green-600 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Necessary Cookies
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Required for basic site functionality,
                            authentication, and security. These cannot be
                            disabled.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        Always Active
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <BarChart3
                          className="text-blue-600 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Analytics Cookies
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Help us understand how visitors interact with our
                            website (Google Analytics).
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => togglePreference('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Cookie
                          className="text-purple-600 flex-shrink-0"
                          size={20}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Functional Cookies
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Remember your preferences and settings for a better
                            experience.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={() => togglePreference('functional')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="flex-1 min-w-[140px] border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

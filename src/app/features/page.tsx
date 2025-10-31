// app/features/page.tsx
import React from 'react';
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Trash2,
  FileText,
  Link2,
  QrCode,
  BarChart3,
  Users,
  Settings,
  Layers,
  Copy,
  Download,
  Key,
  Globe,
  UserCheck,
  Zap,
  CheckCircle,
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'AES-256-GCM Encryption',
      description:
        'Industry-standard encryption using the Web Crypto API. When enabled, your content is encrypted in your browser before transmission using AES-256-GCM.',
      details: [
        'Client-side encryption using Web Crypto API',
        'AES-256-GCM (Galois/Counter Mode)',
        'PBKDF2 key derivation from passphrase',
        'Server stores only encrypted ciphertext',
      ],
    },
    {
      icon: Key,
      title: 'Edit Access Control',
      description:
        'Optional access keys for edit permissions. Edit access keys are hashed (bcrypt) and stored separately from view credentials.',
      details: [
        'Optional edit access key for write protection',
        'Hashed with bcrypt before storage',
        'Independent from view permissions',
        'Per-pad configuration',
      ],
    },
    {
      icon: Shield,
      title: 'Password Protection',
      description:
        'Passphrase-protected pads for controlled access. Passphrases are hashed server-side before comparison.',
      details: [
        'Passphrase required for viewing',
        'Bcrypt hashing for storage',
        'Separate from encryption keys',
        'Configurable per pad',
      ],
    },
    {
      icon: Link2,
      title: 'Token-Based Access',
      description:
        'Share tokens provide an additional access control layer. Each pad can have a unique access token to prevent direct URL access.',
      details: [
        'Unique token per pad',
        'Prevents unauthorized direct access',
        'Optional per-pad setting',
        'Revocable by deleting pad',
      ],
    },
  ];

  const visibilityOptions = [
    {
      icon: Globe,
      title: 'Public Pads',
      color: 'blue',
      description:
        'Accessible to anyone with the link. No authentication required.',
      features: [
        'No login or password needed',
        'Shareable via link or QR code',
        'Optional listing in explore page',
        'Perfect for public code snippets',
      ],
    },
    {
      icon: Key,
      title: 'Protected Pads',
      color: 'orange',
      description:
        'Require a passphrase to view content. Secure sharing with authorized users.',
      features: [
        'Passphrase required for access',
        'Can be shared with multiple people',
        'No account needed to view',
        'Ideal for team collaboration',
      ],
    },
    {
      icon: UserCheck,
      title: 'Private Pads',
      color: 'purple',
      description:
        'Only visible to the account that created them. Requires login to access.',
      features: [
        'Login required to view',
        'Only accessible by creator',
        'Complete privacy',
        'Best for personal notes',
      ],
    },
  ];

  const contentFeatures = [
    {
      icon: Layers,
      title: 'Multi-Tab Interface',
      description:
        'Organize your content with unlimited tabs within a single pad. Each tab can hold different code files, notes, or text.',
      details: [
        'Create unlimited tabs per pad',
        'Custom names for each tab',
        'Up to 500,000 characters per tab',
        'Perfect for multi-file projects',
      ],
    },
    {
      icon: FileText,
      title: 'Massive Content Support',
      description:
        'Each tab supports up to 500,000 characters - enough for large documents, extensive code files, or detailed notes.',
      details: [
        '500,000 characters per tab',
        'Text-only content for security',
        'Fast loading regardless of size',
        'Syntax highlighting coming soon',
      ],
    },
    {
      icon: Copy,
      title: 'Copy Protection',
      description:
        'Prevent unauthorized copying of your content. Disable text selection and right-click context menus.',
      details: [
        'Disable text selection',
        'Disable right-click menu',
        'Prevent easy content theft',
        'Note: Screenshots still possible',
      ],
    },
  ];

  const expirationFeatures = [
    {
      icon: Clock,
      title: 'Time-Based Expiration',
      description:
        'Set a specific date and time for your pad to automatically expire and be permanently deleted.',
      features: [
        'Custom expiration date and time',
        'Automatic deletion after expiry',
        'Permanent and irreversible',
        'Perfect for temporary shares',
      ],
    },
    {
      icon: Eye,
      title: 'View Limit',
      description:
        'Limit the number of times your pad can be viewed. Once the limit is reached, the pad is permanently deleted.',
      features: [
        'Set maximum view count',
        'Tracks total views (not unique)',
        'Auto-deletion after limit',
        'Great for one-time shares',
      ],
    },
    {
      icon: Trash2,
      title: 'Burn After Reading',
      description:
        'Ultimate privacy - the pad is permanently deleted immediately after the first view. No one can ever view it again.',
      features: [
        'Deleted after first view',
        'Even creator cannot view again',
        'Permanent and immediate',
        'Perfect for highly sensitive data',
      ],
    },
  ];

  const sharingFeatures = [
    {
      icon: Link2,
      title: 'Custom URLs',
      description:
        'Create memorable, custom URLs for your pads instead of random strings.',
      example: 'codedpadai.com/my-custom-id',
    },
    {
      icon: QrCode,
      title: 'QR Code Generation',
      description:
        'Every pad automatically generates a QR code for easy mobile sharing.',
      example: 'Scan and share instantly',
    },
    {
      icon: Download,
      title: 'Downloadable QR Codes',
      description:
        'Download QR codes as images to share in presentations or documents.',
      example: 'PNG format, high quality',
    },
  ];

  const analyticsFeatures = [
    {
      icon: BarChart3,
      title: 'View Analytics',
      description:
        'Track how many times your pad has been viewed and when it was last accessed.',
      metrics: [
        'Total views counter',
        'Last viewed timestamp',
        'View history trends',
      ],
    },
    {
      icon: Settings,
      title: 'Comprehensive Audit Logs',
      description:
        'Detailed logs of all actions performed on your pads (available for logged-in users).',
      metrics: [
        'IP-based tracking',
        'Action types (view, edit, delete)',
        'Location data',
        'Timestamp for each action',
      ],
    },
    {
      icon: Users,
      title: 'IP Address Tracking',
      description:
        'See the IP address of everyone who accessed your pad for security monitoring.',
      metrics: [
        'Full IP address visibility',
        'Geographic location',
        'Access patterns',
        'Permanent log retention',
      ],
    },
  ];

  const accountFeatures = [
    {
      icon: Settings,
      title: 'Dashboard Management',
      description:
        'Logged-in users get access to a powerful dashboard to manage all their pads in one place.',
      benefits: [
        'View all your pads at a glance',
        'Quick access to pad settings',
        'Bulk operations support',
        'Organized pad management',
      ],
    },
    {
      icon: BarChart3,
      title: 'Pad Analytics',
      description:
        'Track detailed analytics for each of your pads including views, access logs, and usage patterns.',
      benefits: [
        'Per-pad statistics',
        'Audit log access',
        'IP tracking',
        'Filter by date, action, location',
      ],
    },
    {
      icon: Shield,
      title: 'Private Pads',
      description:
        'Create private pads that only you can access with your account.',
      benefits: [
        'Account-only access',
        'Complete privacy',
        'No sharing required',
        'Perfect for personal use',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Powerful Features</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Everything you need for secure, private, and efficient content
              sharing. Built with modern technology and uncompromising security
              standards.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Security Features
            </h2>
            <p className="text-lg text-gray-600">
              Transparent security implementation details
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                      <Icon className="text-blue-600" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-16">
                    {feature.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visibility Options */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Flexible Visibility Options
            </h2>
            <p className="text-lg text-gray-600">
              Choose how you want to share your content
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {visibilityOptions.map((option, index) => {
              const Icon = option.icon;
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                orange: 'from-orange-500 to-orange-600',
                purple: 'from-purple-500 to-purple-600',
              };
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`bg-gradient-to-br ${colorClasses[option.color as keyof typeof colorClasses]} p-6 text-white`}
                  >
                    <Icon size={40} className="mb-3" />
                    <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                    <p className="text-sm opacity-90">{option.description}</p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {option.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle
                            className="text-green-500 flex-shrink-0 mt-0.5"
                            size={16}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Content Management
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools for organizing and protecting your content
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {contentFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-indigo-100 rounded-lg p-3 w-fit mb-4">
                    <Icon className="text-indigo-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expiration Features */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expiration & Auto-Deletion
            </h2>
            <p className="text-lg text-gray-600">
              Control how long your pads remain accessible
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {expirationFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-red-100 rounded-lg p-3 w-fit mb-4">
                    <Icon className="text-red-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-6">{feature.description}</p>
                  <div className="space-y-3">
                    {feature.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8 border-l-4 border-orange-500">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> You can only set ONE type of expiration per
              pad (time-based OR view limit OR burn after reading). Once a pad
              expires or reaches its limit, it is{' '}
              <strong>permanently deleted</strong> and cannot be recovered.
            </p>
          </div>
        </div>
      </section>

      {/* Sharing Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Easy Sharing
            </h2>
            <p className="text-lg text-gray-600">
              Multiple ways to share your pads
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sharingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200"
                >
                  <Icon className="text-blue-600 mb-4" size={36} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-gray-600 font-mono">
                      {feature.example}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Analytics & Monitoring
            </h2>
            <p className="text-lg text-gray-600">
              Track and monitor pad access in detail
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {analyticsFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
                    <Icon className="text-purple-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.metrics.map((metric, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <BarChart3
                          className="text-purple-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <Shield
                className="text-blue-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <span>
                <strong>Privacy Note:</strong> Audit logs and detailed analytics
                are only available for logged-in users. Logs are retained
                permanently and can be filtered by action type, location, and
                date.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Account Features */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Account Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Unlock additional features with a free account
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {accountFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-indigo-100 rounded-lg p-3 w-fit mb-4">
                    <Icon className="text-indigo-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 md:p-12 border-2 border-yellow-200">
            <div className="text-center mb-8">
              <Zap className="mx-auto text-yellow-600 mb-4" size={48} />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-700">
                We're constantly working on new features to improve your
                experience
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={20} />
                  Text Formatting
                </h3>
                <p className="text-sm text-gray-600">
                  Rich text formatting, markdown support, and advanced text
                  editing capabilities.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={20} />
                  Syntax Highlighting
                </h3>
                <p className="text-sm text-gray-600">
                  Beautiful code highlighting for all major programming
                  languages.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={20} />
                  AI Assistance
                </h3>
                <p className="text-sm text-gray-600">
                  Smart AI features to help you write and format content
                  efficiently.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={20} />
                  AI Summarization
                </h3>
                <p className="text-sm text-gray-600">
                  Intelligent content summarization for quick understanding of
                  large documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start using CodedPadAI today - no registration required to get
            started!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Zap size={20} />
              Get Started Now
            </a>
            <a
              href="/about"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

const Sparkles: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 24,
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18M3 12h18M7 7l10 10M7 17l10-10" />
  </svg>
);

export default FeaturesPage;

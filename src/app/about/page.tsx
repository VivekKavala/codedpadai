// app/about/page.tsx
import React from 'react';
import {
  Shield,
  Lock,
  Zap,
  Users,
  Code,
  Heart,
  Github,
  Sparkles,
  Share2,
  DollarSign,
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description:
        'Your secrets remain yours. We use client-side encryption with user-generated keys, ensuring even we cannot access your encrypted content.',
    },
    {
      icon: Zap,
      title: 'Modern Interface',
      description:
        'A clean, intuitive, and lightning-fast interface designed for the modern web. No clutter, just functionality.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description:
        'We respect your privacy above all else. Your encrypted pads are truly private - not even our servers can decrypt them.',
    },
    {
      icon: Users,
      title: 'Free for Everyone',
      description:
        'No paywalls, no premium tiers, no advertisements. CodedPadAI is completely free and accessible to all.',
    },
  ];

  const upcomingFeatures = [
    {
      icon: Sparkles,
      title: 'AI Assistance',
      description:
        'Smart AI features to help you write, format, and organize your content more efficiently.',
    },
    {
      icon: Code,
      title: 'Programming Language Support',
      description:
        'Enhanced syntax highlighting and language-specific features for developers.',
    },
    {
      icon: Sparkles,
      title: 'AI Summarization',
      description:
        'Intelligent content summarization to help you quickly understand large documents.',
    },
  ];

  const team = [
    {
      name: 'Vivek Kavala',
      github: 'VivekKavala',
      githubUrl: 'https://github.com/VivekKavala',
    },
    {
      name: 'Jithendra Kavala',
      github: 'JithendraKavala',
      githubUrl: 'https://github.com/JithendraKavala',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About CodedPadAI</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Elevating the standards of secure code sharing with modern design
              and uncompromising privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-blue-600" size={36} />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At CodedPadAI, we believe that{' '}
              <strong>your secrets should remain secrets forever</strong>. In a
              world where data breaches and privacy violations are increasingly
              common, we're committed to building a platform where users can
              share sensitive information with complete confidence.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We respect user privacy so deeply that{' '}
              <strong>even we cannot see the content of encrypted pads</strong>.
              Through end-to-end encryption with user-generated keys, your data
              remains exclusively yours. Our mission is to provide a modern,
              intuitive interface combined with military-grade security - making
              secure sharing accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why We Built CodedPadAI
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The idea for CodedPadAI was born from a simple observation:
              existing code and text sharing platforms were either outdated in
              design, lacking in security features, or compromised user privacy
              through ads and data collection.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We asked ourselves:{' '}
              <em>
                "Why can't there be a platform that's modern, secure, and
                respects users?"
              </em>{' '}
              A platform that doesn't treat user data as a commodity, doesn't
              bombard you with advertisements, and doesn't require you to
              sacrifice privacy for functionality.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              CodedPadAI is our answer - a platform that raises the bar for what
              secure sharing should be in the modern web era.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Icon className="text-blue-600" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Built with Modern Technology
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Technology Stack
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>
                      <strong>Next.js</strong> - Modern React framework for
                      blazing-fast performance
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>
                      <strong>PostgreSQL</strong> - Robust and reliable database
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>
                      <strong>Prisma ORM</strong> - Type-safe database access
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Security Excellence
                </h3>
                <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Lock
                      className="text-blue-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        End-to-End Encryption
                      </h4>
                      <p className="text-sm text-gray-700">
                        We're incredibly proud of our implementation of true
                        end-to-end encryption. Your content is encrypted in your
                        browser with a key only you possess. Decryption happens
                        exclusively on your device - never on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600">
              We're constantly working to improve CodedPadAI with exciting new
              features
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                >
                  <Icon className="text-blue-600 mb-4" size={32} />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meet the Team
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Github size={18} />@{member.github}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Everyone */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Users className="mx-auto mb-6 text-blue-200" size={48} />
          <h2 className="text-3xl font-bold mb-6">Built for Everyone</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            CodedPadAI isn't built for a specific audience - it's for anyone who
            needs to share information securely. Whether you're a developer
            sharing code snippets, a student collaborating on notes, a
            professional handling sensitive documents, or just someone who
            values privacy - CodedPadAI is here for you.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Try CodedPadAI Today
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-green-600" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  No Login Required
                </h3>
                <p className="text-gray-700 text-sm">
                  Start using CodedPadAI immediately. No account creation needed
                  to get started.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Share2 className="text-blue-600" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Share with Friends
                </h3>
                <p className="text-gray-700 text-sm">
                  Love CodedPadAI? Help us grow by sharing it with your friends
                  and colleagues.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-purple-600" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Support Us</h3>
                <p className="text-gray-700 text-sm">
                  Help keep CodedPadAI free and ad-free by sponsoring our
                  development efforts.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Privacy First
              </h3>
              <p className="text-gray-700">
                Your privacy is non-negotiable. We will never compromise on user
                data protection.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Modern & Fast
              </h3>
              <p className="text-gray-700">
                Clean design and lightning-fast performance. No bloat, just what
                you need.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Free Forever
              </h3>
              <p className="text-gray-700">
                No ads, no premium tiers. CodedPadAI is and will always be free
                for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            We'd love to hear from you. Whether you have feedback, questions, or
            just want to say hi!
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

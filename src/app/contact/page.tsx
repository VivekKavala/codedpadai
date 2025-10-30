// app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Shield,
  Scale,
  Copyright,
  Loader2,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  category: 'general' | 'privacy' | 'dmca' | 'legal';
  subject: string;
  message: string;
}

interface Status {
  type: 'success' | 'error' | '';
  message: string;
}

interface Category {
  value: 'general' | 'privacy' | 'dmca' | 'legal';
  label: string;
  email: string;
  icon: typeof MessageSquare;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories: Category[] = [
    {
      value: 'general',
      label: 'General Inquiry',
      email: 'vivekkavala63@gmail.com',
      icon: MessageSquare,
    },
    {
      value: 'privacy',
      label: 'Privacy Concern',
      email: 'vivekkavala63@gmail.com',
      icon: Shield,
    },
    {
      value: 'dmca',
      label: 'DMCA / Copyright',
      email: 'vivekkavala63@gmail.com',
      icon: Copyright,
    },
    {
      value: 'legal',
      label: 'Legal Matter',
      email: 'vivekkavala63@gmail.com',
      icon: Scale,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: '', message: '' });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return false;
    }
    if (!formData.subject.trim()) {
      setStatus({ type: 'error', message: 'Please enter a subject' });
      return false;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setStatus({
        type: 'error',
        message: 'Please enter a message (minimum 10 characters)',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message:
            "Thank you for contacting us! We'll get back to you within 24-48 hours.",
        });
        setFormData({
          name: '',
          email: '',
          category: 'general',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          'Failed to send message. Please try again or email us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.value === formData.category
  );
  const Icon = selectedCategory?.icon || MessageSquare;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="text-blue-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Have a question or concern? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon className="text-gray-400" size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Your message will be sent to:{' '}
                    <span className="font-medium">
                      {selectedCategory?.email}
                    </span>
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Please provide as much detail as possible..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.message.length} characters
                  </p>
                </div>

                {status.message && (
                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      status.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle
                        className="text-green-600 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                    ) : (
                      <AlertCircle
                        className="text-red-600 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                    )}
                    <p
                      className={`text-sm ${
                        status.type === 'success'
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}
                    >
                      {status.message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Email Us Directly
              </h3>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.value} className="flex items-start gap-3">
                      <Icon
                        className="text-blue-600 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {cat.label}
                        </p>
                        <a
                          href={`mailto:${cat.email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {cat.email}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Response Time
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                We typically respond to all inquiries within{' '}
                <strong>24-48 hours</strong> during business days.
              </p>
              <p className="text-sm text-gray-600">
                For urgent matters, please indicate "URGENT" in your subject
                line.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Additional Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="/privacy"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookie-policy"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;

'use client';

import React, { useState } from 'react';
import { ChevronDown, Shield, User, Flame, GitBranch } from 'lucide-react';

// Define the FAQ data
const faqs = [
  {
    icon: Shield,
    question: 'Is CodedPadAI truly secure?',
    answer:
      'Yes. We use client-side (end-to-end) encryption. This means your data is encrypted in your browser *before* it ever reaches our servers. We cannot read your private pads even if we wanted to.',
  },
  {
    icon: User,
    question: 'Do I need an account to create a pad?',
    answer:
      'No! You can create a fully secure, encrypted, and password-protected pad completely anonymously. Creating an account is optional and simply allows you to manage all your pads from a personal dashboard.',
  },
  {
    icon: Flame,
    question: 'What happens when a pad "burns after reading"?',
    answer:
      'The "Burn After Reading" option ensures the pad is permanently deleted from our servers the moment it is viewed one time. The link will immediately stop working, providing the highest level of ephemeral security.',
  },
  {
    icon: GitBranch,
    question: 'How is this different from a GitHub Gist?',
    answer:
      'GitHub Gists are great for versioning public code. CodedPadAI is built for *privacy and security*. Our key features, like client-side encryption, "burn after reading," and expiry timers, do not exist on Gist, making us the ideal choice for sharing sensitive information.',
  },
];

// Single FAQ item component
function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = faq.icon;
  return (
    <div className="border-b border-gray-200">
      <h2>
        <button
          type="button"
          className="flex w-full items-center justify-between py-6 text-left"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-3 text-base font-semibold text-gray-900">
            <Icon className="h-5 w-5 text-blue-600" />
            {faq.question}
          </span>
          <span className="ml-6 flex h-7 items-center">
            <ChevronDown
              className={`h-6 w-6 transform transition-transform duration-200 ${
                isOpen ? '-rotate-180' : 'rotate-0'
              }`}
            />
          </span>
        </button>
      </h2>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-base leading-7 text-gray-600">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

// Main FAQ component
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Have questions? We have answers. Here are some of the most common
            things our users ask.
          </p>
        </div>
        <div className="mt-20 max-w-4xl mx-auto">
          <dl className="space-y-2">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

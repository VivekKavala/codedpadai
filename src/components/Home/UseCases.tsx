import React from 'react';
import { Code2, BrainCircuit, UserCheck, Briefcase } from 'lucide-react';

const useCases = [
  {
    icon: Code2,
    title: 'Programmers & Developers',
    description:
      'Securely share code snippets, API keys, or config files with teammates. Use "burn after reading" for maximum security on sensitive data.',
  },
  {
    icon: BrainCircuit,
    title: 'Students & Educators',
    description:
      'Submit your coding assignments in a clean, multi-tab pad. Password-protect your work and share a single, clean link with your professor.',
  },
  {
    icon: Briefcase,
    title: 'Business Professionals',
    description:
      'Share confidential notes, legal text, or internal memos. Our client-side encryption ensures no one but the recipient can read it.',
  },
  {
    icon: UserCheck,
    title: 'Security Agents & Pentesters',
    description:
      'Safely transmit sensitive findings, credentials, or reports. Use our ephemeral, encrypted pads that self-destruct after one view.',
  },
];

export default function UseCases() {
  return (
    <section className="py-24 bg-white sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Who is CodedPadAI For?
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our platform is built for anyone who values data privacy and
            control, from individuals to entire teams.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
                <useCase.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-7 text-gray-900">
                {useCase.title}
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-24 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Share and Store Code
            <span className="block text-blue-600">Securely</span>
          </h1>
          <p className="md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            CodedPadAI lets you protect and share your code or text safely —
            anytime, with anyone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/create"
              className="w-fit text-sm md:text-lg justify-center px-8 py-3 md:py-4 flex gap-1 items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Create a Pad
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/explore"
              className="w-fit text-sm md:text-lg justify-center px-8 py-3 md:py-4 border border-black/80 rounded-lg"
            >
              Explore Pads
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

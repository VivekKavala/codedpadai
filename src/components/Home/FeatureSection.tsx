import { Card, CardContent } from '@/components/ui/card';
import { Shield, Share2, Tag } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'AES-level protection for private pads. Your code stays safe with enterprise-grade encryption.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Generate short public links instantly. Share your code with anyone, anywhere, anytime.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Tag,
    title: 'Smart Organization',
    description: 'Tag and manage your pads effortlessly. Find what you need with powerful search and filters.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to manage code
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for developers who value security, simplicity, and speed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

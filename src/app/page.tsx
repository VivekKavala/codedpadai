import HeroSection from '@/components/Home/HeroSection';
import PadIdInput from '@/components/Home/PadIdInput';
import FeatureSection from '@/components/Home/FeatureSection';
import PreviewSection from '@/components/Home/PreviewSection';
import FeaturesGrid from '@/components/Features';
import UseCases from '@/components/Home/UseCases';
import ComparisonTable from '@/components/Home/ComparisonTable';
import FaqSection from '@/components/Home/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <PadIdInput />
        </div>
        <FeaturesGrid />
        <FeatureSection />
        <UseCases />
        <PreviewSection />
        <ComparisonTable />
        <FaqSection />
      </main>
    </div>
  );
}

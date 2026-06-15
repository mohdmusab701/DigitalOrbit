import { Metadata } from 'next';
import AIHeroSection from '@/frontend/sections/ai/AIHeroSection';
import AIServicesSection from '@/frontend/sections/ai/AIServicesSection';
import AIBenefitsSection from '@/frontend/sections/ai/AIBenefitsSection';
import AIShowcaseSection from '@/frontend/sections/ai/AIShowcaseSection';
import AIStatsSection from '@/frontend/sections/ai/AIStatsSection';
import AICTASection from '@/frontend/sections/ai/AICTASection';

export const metadata: Metadata = {
  title: 'AI Solutions | DigitalOrbit',
  description: 'Automate your business with intelligent AI. From custom AI chatbots to autonomous multi-agent systems, we build premium AI solutions.',
};

export default function AISolutionsPage() {
  return (
    <main>
      <AIHeroSection />
      <AIServicesSection />
      <AIBenefitsSection />
      <AIStatsSection />
      <AIShowcaseSection />
      <AICTASection />
    </main>
  );
}

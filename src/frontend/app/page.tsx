import HeroSection from '@/frontend/sections/HeroSection';
import TrustedBySection from '@/frontend/sections/TrustedBySection';
import ServicesOverview from '@/frontend/sections/ServicesOverview';
import WhyChooseUsSection from '@/frontend/sections/WhyChooseUsSection';
import ProcessSection from '@/frontend/sections/ProcessSection';
import TestimonialsSection from '@/frontend/sections/TestimonialsSection';
import CTASection from '@/frontend/sections/CTASection';

export default function HomePage() {
 return (
 <>
 <HeroSection />
 <TrustedBySection />
 <ServicesOverview />
 <WhyChooseUsSection />
 <ProcessSection />
 <TestimonialsSection />
 <CTASection />
 </>
 );
}

"use client";

import SectionHeading from '@/frontend/components/common/SectionHeading';
import ServiceCard from '@/frontend/components/ui/ServiceCard';
import { services } from '@/frontend/data/services';

export default function ServicesOverview() {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Services"
          title="Everything You Need to Dominate Digital"
          description="From concept to launch, we provide end-to-end digital solutions that drive measurable business growth."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

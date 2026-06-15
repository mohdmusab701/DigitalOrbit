"use client";

import SectionHeading from '@/frontend/components/common/SectionHeading';
import TestimonialCard from '@/frontend/components/ui/TestimonialCard';
import { testimonials } from '@/frontend/data/testimonials';

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50 dark:bg-dark-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Client Love"
          title="What Our Clients Say"
          description="Don't just take our word for it — hear from the businesses we've helped transform."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

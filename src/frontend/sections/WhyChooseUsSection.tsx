"use client";

import { motion } from 'framer-motion';
import { Zap, Shield, Target, Users } from 'lucide-react';
import SectionHeading from '@/frontend/components/common/SectionHeading';

const whyChooseUs = [
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'We ship production-ready products in weeks, not months. Our agile workflow ensures rapid iteration without compromising quality.',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'Every solution we build follows industry-leading security practices, including SOC 2 compliance and end-to-end encryption.',
  },
  {
    icon: Target,
    title: 'Results-Driven Approach',
    description: 'We don\'t just build — we measure. Every project includes KPI tracking, analytics setup, and data-driven optimization.',
  },
  {
    icon: Users,
    title: 'Dedicated Expert Team',
    description: 'Work with senior engineers and designers from top companies like Google, Amazon, and Stripe. No juniors, no outsourcing.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50 dark:bg-dark-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why DigitalOrbit"
          title="Built Different. Proven Results."
          description="We're not just another agency. Here's what sets us apart from the rest."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {whyChooseUs.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex gap-5 p-6 lg:p-8 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

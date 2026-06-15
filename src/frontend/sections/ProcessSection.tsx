"use client";

import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Zap, Rocket } from 'lucide-react';
import SectionHeading from '@/frontend/components/common/SectionHeading';

const processSteps = [
  {
    step: '01',
    icon: Lightbulb,
    title: 'Discovery & Strategy',
    description: 'We dive deep into your business goals, target audience, and competitive landscape to craft a winning digital strategy.',
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Design & Prototype',
    description: 'Our designers create stunning, user-tested prototypes in Figma with interactive animations and responsive layouts.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Development & Testing',
    description: 'Engineers build your product using cutting-edge tech with comprehensive testing, CI/CD, and code reviews.',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Launch & Scale',
    description: 'We deploy to production, monitor performance, and provide ongoing optimization to ensure sustainable growth.',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          badge="Our Process"
          title="From Vision to Reality in 4 Steps"
          description="Our battle-tested process ensures every project is delivered on time, on budget, and beyond expectations."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary-300 to-transparent dark:from-primary-700 z-10" />
                )}
                <div className="text-center p-6 lg:p-8">
                  <div className="relative inline-flex mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.description}
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

"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import SectionHeading from '@/frontend/components/common/SectionHeading';
import { aiServices } from '@/frontend/data/ai-solutions';

export default function AIServicesSection() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50 dark:bg-dark-card/30 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          badge="AI Capabilities"
          title="Enterprise-Grade AI Solutions"
          description="We build state-of-the-art AI systems tailored to your business needs, leveraging the latest advancements in LLMs and autonomous agents."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {aiServices.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col h-full bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 relative z-10 flex-grow">
                  {service.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8 relative z-10">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto relative z-10 pt-6 border-t border-slate-100 dark:border-dark-border">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Learn more about {service.title.split(' ')[1]}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

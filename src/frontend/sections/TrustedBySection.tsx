"use client";

import { motion } from 'framer-motion';

const trustedBy = [
  'Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack',
];

export default function TrustedBySection() {
  return (
    <section className="py-12 lg:py-16 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-8"
        >
          Trusted by teams at world-class companies
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {trustedBy.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-xl lg:text-2xl font-bold text-slate-300 dark:text-slate-700 hover:text-slate-400 dark:hover:text-slate-500 transition-colors cursor-default"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

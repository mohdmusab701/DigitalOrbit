"use client";

import { motion } from 'framer-motion';

export interface SectionHeadingProps {
  badge?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ badge, title, description, center = true, light = false }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl mb-12 lg:mb-16 ${center ? 'mx-auto text-center' : ''}`}
    >
      {badge && (
        <span className={`inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full mb-4 ${
          light
            ? 'bg-white/10 text-white/80'
            : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
        }`}>
          {badge}
        </span>
      )}
      <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight ${
        light ? 'text-white' : 'text-slate-900 dark:text-white'
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base lg:text-lg leading-relaxed ${
          light ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

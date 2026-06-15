"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/shared/types';

export interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/services#${service.id}`}
        className="group block h-full"
      >
        <div className="relative h-full p-6 lg:p-8 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10">
          {/* Gradient Orb */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500 blur-2xl`} />
          
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
            {service.shortDescription}
          </p>

          {/* Arrow */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
            <span>Learn More</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

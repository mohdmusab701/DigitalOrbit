"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight, Users, TrendingUp } from 'lucide-react';
import { Project } from '@/shared/types';

export interface PortfolioCardProps {
  project: Project;
  index: number;
}

export default function PortfolioCard({ project, index }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10">
        {/* Image Area */}
        <div className={`relative h-52 lg:h-60 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          {/* Abstract pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white/30 rounded-full" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-2 border-white/20 rounded-lg rotate-12" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full" />
          </div>
          {/* Project Initial */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black text-white/20 group-hover:text-white/30 transition-colors">
              {project.title.charAt(0)}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-xl border border-white/30 hover:bg-white/10 transition-colors">
              View Case Study
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>{project.stats.users} Users</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{project.stats.growth}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

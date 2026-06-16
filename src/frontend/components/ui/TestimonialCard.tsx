"use client";

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/shared/types';

export interface TestimonialCardProps {
 testimonial: Testimonial;
 index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.5, delay: index * 0.1 }}
 className="h-full"
 >
 <div className="relative h-full p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5">
 {/* Quote Icon */}
 <Quote className="w-8 h-8 text-primary-100 dark:text-primary-900/50 mb-4" />

 {/* Stars */}
 <div className="flex gap-1 mb-4">
 {Array.from({ length: testimonial.rating }, (_, i) => (
 <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
 ))}
 </div>

 {/* Content */}
 <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-6 italic">
 &ldquo;{testimonial.content}&rdquo;
 </p>

 {/* Author */}
 <div className="flex items-center gap-3 mt-auto">
 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
 {testimonial.avatar}
 </div>
 <div>
 <p className="text-sm font-semibold text-foreground">
 {testimonial.name}
 </p>
 <p className="text-xs text-muted-foreground">
 {testimonial.role}, {testimonial.company}
 </p>
 </div>
 </div>
 </div>
 </motion.div>
 );
}

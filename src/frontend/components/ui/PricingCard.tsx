"use client";

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { PricingPlan } from '@/shared/types';

export interface PricingCardProps {
 plan: PricingPlan;
 index: number;
}

export default function PricingCard({ plan, index }: PricingCardProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.5, delay: index * 0.15 }}
 className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
 >
 {/* Popular Badge */}
 {plan.popular && (
 <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
 <span className="px-4 py-1.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-primary-500/25">
 Most Popular
 </span>
 </div>
 )}

 <div
 className={`relative h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
 plan.popular
 ? 'bg-card border-2 border-primary-500 dark:border-primary-600 shadow-xl shadow-primary-500/10 hover:shadow-primary-500/20'
 : 'bg-card border border-border hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-primary-500/5'
 }`}
 >
 <div className="p-8">
 {/* Plan Name */}
 <h3 className="text-lg font-semibold text-foreground mb-2">
 {plan.name}
 </h3>
 <p className="text-sm text-muted-foreground mb-6">
 {plan.description}
 </p>

 {/* Price */}
 <div className="mb-8">
 <div className="flex items-baseline gap-1">
 {plan.price !== 'Custom' && (
 <span className="text-lg text-muted-foreground font-medium">₹</span>
 )}
 <span className={`text-4xl font-bold ${plan.popular ? 'gradient-text' : 'text-foreground'}`}>
 {plan.price}
 </span>
 </div>
 <span className="text-sm text-muted-foreground">
 {plan.period}
 </span>
 </div>

 {/* CTA */}
 <Link
 href="/contact"
 className={`block w-full text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all active:scale-95 mb-8 ${
 plan.popular
 ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40'
 : 'bg-muted dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-foreground hover:text-primary-600 dark:hover:text-primary-400'
 }`}
 >
 {plan.cta}
 </Link>

 {/* Features */}
 <div className="space-y-3">
 <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
 What&apos;s included
 </p>
 {plan.features.map((feature: string) => (
 <div key={feature} className="flex items-start gap-3">
 <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
 <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
 </div>
 <span className="text-sm text-muted-foreground">
 {feature}
 </span>
 </div>
 ))}
 {plan.notIncluded.map((feature: string) => (
 <div key={feature} className="flex items-start gap-3 opacity-50">
 <div className="w-5 h-5 rounded-full bg-muted dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
 <X className="w-3 h-3 text-muted-foreground" />
 </div>
 <span className="text-sm text-muted-foreground line-through">
 {feature}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 );
}

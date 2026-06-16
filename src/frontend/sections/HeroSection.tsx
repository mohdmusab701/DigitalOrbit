"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export default function HeroSection() {
 return (
 <section className="relative min-h-screen flex items-center overflow-hidden mesh-gradient">
 {/* Decorative elements */}
 <div className="absolute inset-0 dot-pattern opacity-40" />
 <div className="absolute top-20 right-10 lg:right-40 w-72 h-72 bg-primary-500/10 rounded-full blur-[100px]" />
 <div className="absolute bottom-20 left-10 lg:left-20 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />
 
 {/* Animated orbiting circles */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px]">
 <div className="absolute inset-0 border border-primary-200/20 dark:border-primary-500/10 rounded-full" />
 <div className="absolute inset-8 border border-primary-200/15 dark:border-primary-500/8 rounded-full" />
 <div className="absolute inset-16 border border-primary-200/10 dark:border-primary-500/5 rounded-full" />
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
 className="absolute inset-0"
 >
 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50" />
 </motion.div>
 <motion.div
 animate={{ rotate: -360 }}
 transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
 className="absolute inset-8"
 >
 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-accent-500 rounded-full shadow-lg shadow-accent-500/50" />
 </motion.div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-16 relative z-10">
 <div className="max-w-4xl mx-auto text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="mb-6"
 >
 <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400">
 <Sparkles className="w-4 h-4" />
 Trusted by 200+ Companies Worldwide
 </span>
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6"
 >
 Build Smarter.{' '}
 <span className="gradient-text">Grow Faster.</span>
 <br />
 Orbit Higher.
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
 >
 We craft premium digital experiences that transform businesses.
 From stunning websites to AI-powered solutions, we help you
 dominate the digital landscape.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.3 }}
 className="flex flex-col sm:flex-row items-center justify-center gap-4"
 >
 <Link
 href="/contact"
 className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-primary-600/25 hover:shadow-primary-600/40 hover:scale-[1.02] active:scale-[0.98]"
 >
 Start Your Project
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 <Link
 href="/portfolio"
 className="group inline-flex items-center gap-2 px-8 py-4 bg-card dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 text-foreground font-semibold rounded-2xl border border-border dark:border-white/10 transition-all hover:shadow-lg"
 >
 <Play className="w-4 h-4" />
 View Our Work
 </Link>
 </motion.div>

 {/* Quick Stats */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.4 }}
 className="flex items-center justify-center gap-8 lg:gap-16 mt-16 pt-8 border-t border-border"
 >
 {[
 { value: '350+', label: 'Projects' },
 { value: '98%', label: 'Satisfaction' },
 { value: '200+', label: 'Clients' },
 ].map((stat) => (
 <div key={stat.label} className="text-center">
 <div className="text-2xl lg:text-3xl font-bold text-foreground">
 {stat.value}
 </div>
 <div className="text-sm text-muted-foreground">
 {stat.label}
 </div>
 </div>
 ))}
 </motion.div>
 </div>
 </div>
 </section>
 );
}

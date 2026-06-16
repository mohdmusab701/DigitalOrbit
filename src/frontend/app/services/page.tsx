"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';
import SectionHeading from '@/frontend/components/common/SectionHeading';
import { services } from '@/frontend/data/services';

export default function ServicesPage() {
 return (
 <>
 {/* Hero */}
 <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background mesh-gradient relative overflow-hidden">
 <div className="absolute inset-0 dot-pattern opacity-30" />
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
 <SectionHeading
 badge="Our Services"
 title="End-to-End Digital Solutions"
 description="We provide comprehensive digital services to help you build, launch, and scale your products. Every service is backed by our team of industry experts."
 />
 </div>
 </section>

 {/* Services Detail */}
 <section className="py-16 lg:py-24 bg-background">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="space-y-20 lg:space-y-28">
 {services.map((service, index) => {
 const Icon = service.icon;
 const isReversed = index % 2 !== 0;

 return (
 <motion.div
 key={service.id}
 id={service.id}
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: 0.6 }}
 className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
 isReversed ? 'lg:direction-rtl' : ''
 }`}
 >
 {/* Content */}
 <div className={isReversed ? 'lg:order-2' : ''}>
 <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
 <Icon className="w-7 h-7 text-white" />
 </div>
 <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
 {service.title}
 </h2>
 <p className="text-base text-muted-foreground leading-relaxed mb-8">
 {service.description}
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
 {service.features.map((feature: string) => (
 <div key={feature} className="flex items-start gap-3">
 <div className="w-5 h-5 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-0.5">
 <Check className="w-3 h-3 text-primary-600 dark:text-primary-400" />
 </div>
 <span className="text-sm text-muted-foreground">
 {feature}
 </span>
 </div>
 ))}
 </div>
 <Link
 href="/contact"
 className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 active:scale-95"
 >
 Discuss Your Project
 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
 </Link>
 </div>

 {/* Visual */}
 <div className={isReversed ? 'lg:order-1' : ''}>
 <div className={`relative aspect-[4/3] rounded-2xl bg-gradient-to-br ${service.color} overflow-hidden`}>
 <div className="absolute inset-0 bg-black/5" />
 {/* Abstract decorative elements */}
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="relative w-32 h-32">
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
 className="absolute inset-0 border-2 border-white/20 rounded-full"
 />
 <motion.div
 animate={{ rotate: -360 }}
 transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
 className="absolute inset-4 border-2 border-white/15 rounded-full"
 />
 <div className="absolute inset-0 flex items-center justify-center">
 <Icon className="w-12 h-12 text-white/60" />
 </div>
 </div>
 </div>
 {/* Corner decorations */}
 <div className="absolute top-6 left-6 w-20 h-20 border border-white/10 rounded-xl rotate-12" />
 <div className="absolute bottom-6 right-6 w-16 h-16 border border-white/10 rounded-full" />
 <div className="absolute top-1/2 right-12 w-2 h-2 bg-white/30 rounded-full" />
 <div className="absolute bottom-1/3 left-12 w-3 h-3 bg-white/20 rounded-full" />
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
 <div className="absolute inset-0">
 <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
 </div>
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
 Need a Custom Solution?
 </h2>
 <p className="text-lg text-primary-100/80 mb-8 max-w-xl mx-auto">
 We tailor every service to your unique business needs. Let&apos;s discuss how we can help you achieve your goals.
 </p>
 <Link
 href="/contact"
 className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-semibold rounded-2xl hover:bg-primary-50 transition-all hover:shadow-xl"
 >
 Schedule a Call
 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
 </Link>
 </motion.div>
 </div>
 </section>
 </>
 );
}
